import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/ratelimit";

const recipient = "kloudviva@gmail.com";
const serviceLabels = {
  "cloud-infrastructure": "Cloud infrastructure or Terraform support",
  "cloud-review": "Cloud cost and security review",
  "devops-foundation": "DevOps and CI/CD foundations",
  "devops-assets": "Reusable DevOps workflows or templates",
  other: "Other project enquiry",
};

function isText(value: unknown): value is string {
  return typeof value === "string";
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Please check the enquiry details and try again." }, { status: 400 });
    }

    const form = body as Record<string, unknown>;
    const name = isText(form.name) ? form.name.trim() : "";
    const email = isText(form.email) ? form.email.trim() : "";
    const service = isText(form.service) ? form.service : "";
    const details = isText(form.details) ? form.details.trim() : "";
    const consent = form.consent === "yes";

    if (isText(form.website) && form.website.trim()) {
      return Response.json({ ok: true });
    }

    if (
      name.length < 2 || name.length > 100 ||
      email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !Object.hasOwn(serviceLabels, service) ||
      details.length < 20 || details.length > 3000 ||
      !consent
    ) {
      return Response.json({ error: "Please check the required fields and try again." }, { status: 400 });
    }

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || headersList.get("x-real-ip") || "unknown";
    const { allowed, resetIn } = checkRateLimit(ip);
    if (!allowed) {
      return Response.json(
        { error: `Too many enquiries. Please try again in ${resetIn} minute${resetIn === 1 ? "" : "s"}.` },
        { status: 429 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (!apiKey || !from) {
      return Response.json({ error: "Enquiries are temporarily unavailable. Please try again later." }, { status: 503 });
    }

    const serviceLabel = serviceLabels[service as keyof typeof serviceLabels];
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email,
        subject: `CloudViva enquiry: ${serviceLabel}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Service: ${serviceLabel}`,
          "",
          "Project summary:",
          details,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!emailResponse.ok) {
      return Response.json({ error: "We could not send your enquiry. Please try again later." }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "We could not send your enquiry. Please try again later." }, { status: 500 });
  }
}