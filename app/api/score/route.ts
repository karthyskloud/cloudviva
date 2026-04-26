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

    const { content, type } = await request.json();
    if (!content || typeof content !== "string" || content.trim().length < 10) {
      return Response.json({ error: "Please provide content to analyze." }, { status: 400 });
    }

    // Return cached result instantly if available
    const cacheKey = `score:${type}:${content.trim()}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return Response.json(cached, { headers: { "X-Cache": "HIT", "X-Remaining": String(remaining) } });
    }

    const stream = client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: `You are a DevSecOps security expert with deep knowledge of cloud security, Kubernetes, Docker, and CI/CD.
You analyze DevOps configuration files and provide security scores.
Always respond with valid JSON matching this exact structure:
{
  "overallScore": <number 0-100>,
  "grade": "A" | "B" | "C" | "D" | "F",
  "categories": [
    { "name": "category name", "score": <number 0-100>, "status": "pass" | "warn" | "fail", "findings": ["finding 1"] }
  ],
  "criticalIssues": ["issue 1", "issue 2"],
  "fixes": [
    { "priority": "critical|high|medium|low", "title": "fix title", "description": "what to do", "code": "optional code snippet" }
  ],
  "summary": "2-3 sentence assessment"
}
Score guide: 90-100=A, 70-89=B, 50-69=C, 30-49=D, 0-29=F
Be specific and actionable. Include real code fixes.`,
      messages: [{ role: "user", content: `Analyze this ${type || "DevOps configuration"} for security issues and return JSON only:\n\n${content.slice(0, 8000)}` }],
    });

    let fullText = "";
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              fullText += chunk.delta.text;
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
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
