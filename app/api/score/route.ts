import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  try {
    const { content, type } = await request.json();

    if (!content || typeof content !== "string" || content.trim().length < 10) {
      return Response.json({ error: "Please provide content to analyze." }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: `You are a DevSecOps security expert with deep knowledge of cloud security, Kubernetes, Docker, and CI/CD.
You analyze DevOps configuration files and provide security scores.
Always respond with valid JSON matching this exact structure:
{
  "overallScore": <number 0-100>,
  "grade": "A" | "B" | "C" | "D" | "F",
  "categories": [
    {
      "name": "category name",
      "score": <number 0-100>,
      "status": "pass" | "warn" | "fail",
      "findings": ["finding 1", "finding 2"]
    }
  ],
  "criticalIssues": ["issue 1", "issue 2"],
  "fixes": [
    { "priority": "critical|high|medium|low", "title": "fix title", "description": "what to do", "code": "optional code snippet" }
  ],
  "summary": "2-3 sentence assessment"
}

Score guide: 90-100=A (excellent), 70-89=B (good), 50-69=C (needs work), 30-49=D (poor), 0-29=F (critical issues)
Be specific and actionable. Include real code fixes.`,
      messages: [
        {
          role: "user",
          content: `Analyze this ${type || "DevOps configuration"} for security issues and return JSON only:\n\n${content.slice(0, 8000)}`,
        },
      ],
    });

    const text = message.content[0];
    if (text.type !== "text") {
      return Response.json({ error: "Unexpected response from AI." }, { status: 500 });
    }

    const jsonMatch = text.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "Could not parse AI response." }, { status: 500 });
    }

    let result;
    try {
      result = JSON.parse(jsonMatch[0]);
    } catch {
      return Response.json({ error: "AI response was too long and got cut off. Try with a shorter input." }, { status: 500 });
    }
    return Response.json(result);
  } catch (err) {
    console.error(err);
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("401") || msg.includes("authentication") || msg.includes("API key")) {
      return Response.json({ error: "Invalid or missing Anthropic API key. Add ANTHROPIC_API_KEY to your .env.local file and restart the server." }, { status: 500 });
    }
    return Response.json({ error: `Analysis failed: ${msg || "Unknown error"}` }, { status: 500 });
  }
}
