import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  try {
    const { content, type } = await request.json();

    if (!content || typeof content !== "string" || content.trim().length < 10) {
      return Response.json({ error: "Please provide content to analyze." }, { status: 400 });
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

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("401") || msg.includes("authentication") || msg.includes("API key")) {
      return Response.json({ error: "Invalid or missing Anthropic API key." }, { status: 500 });
    }
    return Response.json({ error: `Analysis failed: ${msg || "Unknown error"}` }, { status: 500 });
  }
}
