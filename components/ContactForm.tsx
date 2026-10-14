"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

const services = [
  { value: "aws-terraform", label: "AWS or Terraform fix / deployment support" },
  { value: "cloud-review", label: "AWS cost and security review" },
  { value: "devops-assets", label: "Reusable DevOps assets" },
  { value: "other", label: "Something else" },
];

const fieldClass = "mt-2 w-full rounded-md border px-3 py-3 text-sm text-white outline-none focus:border-sky-400";
const fieldStyle = { borderColor: "var(--border)", background: "var(--surface)" };

export default function ContactForm({ initialService }: { initialService?: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Your enquiry could not be sent. Please try again.");
      }

      form.reset();
      setStatus("sent");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Your enquiry could not be sent. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Project enquiry form">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm text-white">
          Your name
          <input className={fieldClass} style={fieldStyle} name="name" autoComplete="name" maxLength={100} required />
        </label>
        <label className="block text-sm text-white">
          Work email
          <input className={fieldClass} style={fieldStyle} name="email" type="email" autoComplete="email" maxLength={254} required />
        </label>
      </div>

      <label className="block text-sm text-white">
        What do you need help with?
        <select className={fieldClass} style={fieldStyle} name="service" defaultValue={services.some((service) => service.value === initialService) ? initialService : ""} required>
          <option value="" disabled>Select a service</option>
          {services.map((service) => <option key={service.value} value={service.value}>{service.label}</option>)}
        </select>
      </label>

      <label className="block text-sm text-white">
        Project summary
        <textarea className={`${fieldClass} min-h-36 resize-y`} style={fieldStyle} name="details" minLength={20} maxLength={3000} required
          placeholder="What are you working on, what is blocked, and what outcome do you need?" />
      </label>

      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex items-start gap-3 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
        <input className="mt-0.5 accent-sky-500" type="checkbox" name="consent" value="yes" required />
        I agree that CloudViva may use these details to respond to this enquiry.
      </label>

      <button type="submit" disabled={status === "submitting"}
        className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        style={{ background: "var(--accent)" }}>
        {status === "submitting" ? "Sending..." : "Send enquiry"}
        {status !== "submitting" && <ArrowRight size={16} />}
      </button>

      <p className="text-sm" role="status" aria-live="polite" style={{ color: status === "error" ? "#fca5a5" : "var(--muted)" }}>
        {status === "sent" && "Enquiry sent. CloudViva will reply to the email address you provided."}
        {status === "error" && errorMessage}
      </p>
    </form>
  );
}