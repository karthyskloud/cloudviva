import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  try {
    const { plan } = await request.json();

    if (!plan || typeof plan !== "string" || plan.trim().length < 10) {
      return Response.json({ error: "Please provide a valid terraform plan output." }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
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
      messages: [
        {
          role: "user",
          content: `Analyze this terraform plan and return JSON only:\n\n${plan.slice(0, 8000)}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return Response.json({ error: "Unexpected response from AI." }, { status: 500 });
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "Could not parse AI response." }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
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
