import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes, Cloud, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cloud Infrastructure & DevOps Services",
  description:
    "Vendor-neutral cloud infrastructure support, cost and security reviews, DevOps foundations, and reusable automation for small teams.",
};

const offers = [
  {
    icon: Cloud,
    number: "01",
    title: "Cloud infrastructure & IaC support",
    summary: "Get unstuck on infrastructure-as-code, deployment, or cloud configuration work without adding a full-time platform team.",
    items: [
      "Terraform configuration, module changes, and plan review",
      "Cloud deployment and infrastructure troubleshooting across providers",
      "Infrastructure changes with a clear implementation handoff",
    ],
    result: "A scoped fix, pull request, or clear implementation plan with handoff notes.",
    service: "cloud-infrastructure",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Cloud cost & security review",
    summary: "A focused review of the cloud setup you have today, with findings ordered by impact and effort.",
    items: [
      "Cloud spending patterns and practical cost opportunities",
      "IAM access, logging, backups, and exposed services",
      "Prioritized recommendations across the agreed cloud scope",
    ],
    result: "A written report for the agreed account and scope. This is not a compliance certification.",
    service: "cloud-review",
  },
  {
    icon: Boxes,
    number: "03",
    title: "DevOps & CI/CD foundations",
    summary: "For teams starting without a release process or pipeline, establish a practical foundation that fits your codebase and team.",
    items: [
      "Git workflow, pull request checks, and branch protections",
      "Build and test automation, then deployments for agreed environments",
      "Secrets handling, release guidance, and a documented handoff",
    ],
    result: "A working first pipeline and documented release process, agreed to your scope.",
    service: "devops-foundation",
  },
  {
    icon: Boxes,
    number: "04",
    title: "Reusable DevOps assets",
    summary: "Create practical building blocks for your team, based on a real workflow and a defined use case.",
    items: [
      "Terraform modules and environment scaffolding",
      "GitHub Actions and deployment workflows",
      "Operational checklists and setup documentation",
    ],
    result: "Assets delivered to an agreed repository with usage notes.",
    service: "devops-assets",
  },
];

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="flex-1">
        <section className="grid-bg border-b" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-6xl mx-auto px-6 pt-32 pb-16">
            <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>CloudViva services</p>
            <h1 className="mt-4 max-w-4xl text-4xl md:text-6xl font-bold leading-tight text-white">
              Cloud infrastructure and DevOps support, scoped around the work you need done.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
              Practical support for startups and small teams: establish your first delivery pipeline, fix an infrastructure blocker, review cloud risks and costs, or build reusable automation.
            </p>
            <Link href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-lg px-5 py-3 font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)" }}>
              Discuss a project <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-8">
          {offers.map((offer) => {
            const Icon = offer.icon;
            return (
              <article key={offer.number} className="grid gap-6 border-b py-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-12"
                style={{ borderColor: "var(--border)" }}>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs" style={{ color: "var(--accent)" }}>{offer.number}</span>
                    <Icon size={18} style={{ color: "var(--accent)" }} />
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-white">{offer.title}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{offer.summary}</p>
                  <Link href={`/contact?service=${offer.service}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
                    style={{ color: "var(--accent)" }}>
                    Enquire about this <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="md:pl-8">
                  <ul className="space-y-3">
                    {offer.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                        <span aria-hidden="true" style={{ color: "var(--accent)" }}>+</span>{item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 border-l-2 pl-4 text-sm leading-relaxed" style={{ borderColor: "var(--accent)", color: "var(--muted)" }}>
                    <span className="font-medium text-white">Typical handoff: </span>{offer.result}
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid gap-8 border-t pt-10 md:grid-cols-3" style={{ borderColor: "var(--border)" }}>
            <div>
              <p className="font-mono text-xs" style={{ color: "var(--accent)" }}>01 / Scope</p>
              <h2 className="mt-3 font-semibold text-white">Start with the problem</h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Send a short enquiry. We confirm fit, boundaries, timing, and a quote before work begins.</p>
            </div>
            <div>
              <p className="font-mono text-xs" style={{ color: "var(--accent)" }}>02 / Agree</p>
              <h2 className="mt-3 font-semibold text-white">Get a clear plan</h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>You approve the scope and access approach first. No production changes happen without agreement.</p>
            </div>
            <div>
              <p className="font-mono text-xs" style={{ color: "var(--accent)" }}>03 / Handoff</p>
              <h2 className="mt-3 font-semibold text-white">Receive usable work</h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Get the agreed fix, report, or assets with documentation and a direct handoff.</p>
            </div>
          </div>
          <p className="mt-10 max-w-3xl text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            Please do not include passwords, API keys, Terraform state, or other secrets in enquiries. Any access needed for a project is agreed separately and kept to the minimum required.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}