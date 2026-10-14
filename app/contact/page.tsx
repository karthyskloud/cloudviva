import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact CloudViva",
  description: "Send CloudViva an enquiry about AWS, Terraform, cloud reviews, or DevOps assets.",
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { service } = await searchParams;
  const initialService = Array.isArray(service) ? service[0] : service;

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 pt-32 pb-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>Project enquiry</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-white">Tell me what you’re trying to ship.</h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed" style={{ color: "var(--muted)" }}>
              Share the goal and the current blocker. You’ll get a direct reply to discuss scope, timing, and next steps before any work begins.
            </p>
            <div className="mt-10 border-t pt-5" style={{ borderColor: "var(--border)" }}>
              <p className="max-w-md text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                Don’t include credentials, API keys, Terraform state, or confidential configuration in this form.
              </p>
            </div>
          </div>
          <ContactForm initialService={initialService} />
        </div>
      </main>
      <Footer />
    </div>
  );
}