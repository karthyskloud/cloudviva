import Anthropic from "@anthropic-ai/sdk";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/ratelimit";
import { getCached, setCache } from "@/lib/cache";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("401") || msg.includes("authentication")) return "API key is invalid or missing.";
  if (msg.includes("429") || msg.includes("rate_limit")) return "AI service is busy. Please wait a moment and try again.";
  if (msg.includes("529") || msg.includes("overloaded")) return "AI service is temporarily overloaded. Please try again in a few seconds.";
  if (msg.includes("credit") || msg.includes("billing")) return "Service is temporarily unavailable. Please try again later.";
  return "Analysis failed. Please try again.";
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || headersList.get("x-real-ip") || "unknown";

    const { allowed, remaining, resetIn } = checkRateLimit(ip);
    if (!allowed) {
      return Response.json(
        { error: `You've reached the limit of 5 analyses per hour. Resets in ${resetIn} minute${resetIn !== 1 ? "s" : ""}.` },
        { status: 429 }
      );
    }

    const { plan } = await request.json();
    if (!plan || typeof plan !== "string" || plan.trim().length < 10) {
      return Response.json({ error: "Please provide a valid terraform plan output." }, { status: 400 });
    }

    // Return cached result instantly if available
    const cacheKey = `terraform:${plan.trim()}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return Response.json(cached, { headers: { "X-Cache": "HIT", "X-Remaining": String(remaining) } });
    }

    const stream = client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: `You are a senior DevOps engineer and cloud security expert.
You analyze terraform plan output and explain it clearly.
Always respond with valid JSON matching this exact structure:
{
  "summary": "1-2 sentence plain English summary of what this plan will do",
  "riskScore": <number 1-10>,
  "riskLevel": "critical" | "high" | "medium" | "low",
  "changes": [
    { "action": "create|update|destroy|replace", "resource": "resource name", "explanation": "plain English explanation", "risk": "critical|high|medium|low" }
  ],
  "warnings": ["warning 1", "warning 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "safeToApply": true | false
}
Rules:
- riskLevel "critical" = data destruction, security exposure, irreversible actions
- riskLevel "high" = significant changes to security groups, IAM, databases
- riskLevel "medium" = configuration changes with some risk
- riskLevel "low" = safe updates and additions
- Be specific and practical. Real engineers will act on this.`,
      messages: [{ role: "user", content: `Analyze this terraform plan and return JSON only:\n\n${plan.slice(0, 8000)}` }],
    });

    // Collect full streamed text, cache result, then stream to client
    const encoder = new TextEncoder();
    let fullText = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              fullText += chunk.delta.text;
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          // Cache the result after streaming completes
          const jsonMatch = fullText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try { setCache(cacheKey, JSON.parse(jsonMatch[0])); } catch { /* ignore */ }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Cache": "MISS", "X-Remaining": String(remaining) },
    });
  } catch (err) {
    return Response.json({ error: friendlyError(err) }, { status: 500 });
  }
}
