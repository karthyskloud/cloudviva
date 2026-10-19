import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Cloud, GitBranch, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trainingTracks, upcomingCohorts } from "@/lib/training";

export const metadata: Metadata = {
  title: "Cloud & DevOps Training",
  description: "Practical, beginner-friendly cloud, DevOps, CI/CD, and infrastructure-as-code learning paths from CloudViva.",
};

const lessonSteps = [
  { title: "Review a change", text: "A pull request gives teammates a place to discuss the change before it reaches the main branch." },
  { title: "Run checks", text: "Automated tests catch common mistakes consistently. Start with a quick, reliable check." },
  { title: "Create an artifact", text: "Build a versioned package once so later environments can use the same output." },
  { title: "Deploy deliberately", text: "Start in a non-production environment, verify the release, and define how to roll back." },
];

const pipelineExample = `name: verify

on:
  pull_request:
  push:
    branches: [main]

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm test`;

export default function TrainingPage() {
  return (
    <div className="site-page flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="training-intro">
          <div className="site-container py-16 sm:py-20">
            <p className="section-eyebrow">CloudViva learning</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-[var(--text)] sm:text-5xl">
              Cloud and DevOps skills, built one practical step at a time.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
              Start with cloud concepts, build a first delivery workflow, then learn to manage infrastructure changes safely. No existing pipeline or platform team required.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#cohorts" className="button-primary">See upcoming batches <ArrowRight size={16} /></Link>
              <Link href="#learning-paths" className="inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--accent-2)]">Browse the curriculum <BookOpen size={16} /></Link>
            </div>
          </div>
        </section>

        <section id="cohorts" className="site-container scroll-mt-8 py-14 sm:py-16">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="section-eyebrow">Upcoming batches</p>
              <h2 className="mt-2 text-3xl font-bold text-[var(--text)]">Register interest for the next cohort.</h2>
            </div>
            <p className="max-w-lg text-sm leading-relaxed text-[var(--muted)]">
              Dates, delivery format, and fees are being finalized. Registering interest is not a paid booking; we’ll share the details before enrollment.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {upcomingCohorts.map((cohort) => (
              <article key={cohort.id} className="cohort-card">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[var(--accent-2)]"><CalendarDays size={14} /> Interest open</span>
                  <span className="text-xs text-[var(--muted)]">Dates TBA</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[var(--text)]">{cohort.title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-relaxed text-[var(--muted)]">{cohort.focus}</p>
                <Link href={`/contact?service=training-interest&course=${cohort.id}`} className="button-primary mt-6 w-full text-sm">Register interest <ArrowRight size={15} /></Link>
              </article>
            ))}
          </div>
        </section>

        <section id="learning-paths" className="bg-[#eaf2ef] py-14 sm:py-16">
          <div className="site-container">
            <div className="max-w-2xl">
              <p className="section-eyebrow">Learning paths</p>
              <h2 className="mt-2 text-3xl font-bold text-[var(--text)]">Choose a foundation, not a pile of tools.</h2>
              <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">Each path focuses on concepts you can carry between cloud providers and projects. Platform-specific examples are identified as such.</p>
            </div>

            <div className="mt-8 space-y-4">
              {trainingTracks.map((track) => (
                <article id={track.id} key={track.id} className="learning-card grid gap-6 scroll-mt-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                  <div>
                    <p className="font-mono text-sm font-semibold text-[var(--accent)]">{track.number} <span className="ml-2 font-sans font-medium text-[var(--accent-2)]">{track.level}</span></p>
                    <h3 className="mt-3 text-2xl font-bold text-[var(--text)]">{track.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{track.summary}</p>
                    <p className="mt-5 border-l-2 border-[var(--accent)] pl-4 text-sm leading-relaxed text-[var(--text)]"><strong>Practice outcome:</strong> {track.outcome}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--text)]">What you’ll work through</h4>
                    <ul className="mt-3 space-y-3">
                      {track.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--muted)]">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--accent-2)]" />{topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="site-container grid gap-10 py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div>
            <p className="section-eyebrow">A first practical lesson</p>
            <h2 className="mt-2 text-3xl font-bold text-[var(--text)]">What belongs in a first CI pipeline?</h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
              Keep the first version small: validate a change, run the project’s checks, and make failures visible. Add deployment only after the team can trust those checks.
            </p>
            <ol className="mt-6 space-y-5">
              {lessonSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dcebe6] font-mono text-sm font-semibold text-[var(--accent-2)]">{index + 1}</span>
                  <div><h3 className="font-semibold text-[var(--text)]">{step.title}</h3><p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{step.text}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="training-code-wrap">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-xs text-white/70">
              <GitBranch size={14} /> Example: verify changes before merge
            </div>
            <pre className="overflow-x-auto p-5 text-xs leading-relaxed text-[#d8eee7] sm:text-sm"><code>{pipelineExample}</code></pre>
            <p className="px-5 pb-5 text-xs leading-relaxed text-white/60">This GitHub Actions example assumes a Node.js project with an <code>npm test</code> script. Adapt the runner and commands to your stack; it does not deploy to production.</p>
          </div>
        </section>

        <section className="border-y border-[#d7e3df] bg-white py-12">
          <div className="site-container grid gap-6 md:grid-cols-3">
            <div className="flex gap-3"><Cloud size={20} className="mt-1 shrink-0 text-[var(--accent-2)]" /><p className="text-sm leading-relaxed text-[var(--muted)]"><strong className="text-[var(--text)]">Provider-aware, not provider-locked.</strong> Learn concepts first, then see how they map to a specific platform.</p></div>
            <div className="flex gap-3"><GitBranch size={20} className="mt-1 shrink-0 text-[var(--accent-2)]" /><p className="text-sm leading-relaxed text-[var(--muted)]"><strong className="text-[var(--text)]">Start from zero.</strong> DevOps foundations do not assume a working CI/CD pipeline already exists.</p></div>
            <div className="flex gap-3"><ShieldCheck size={20} className="mt-1 shrink-0 text-[var(--accent-2)]" /><p className="text-sm leading-relaxed text-[var(--muted)]"><strong className="text-[var(--text)]">Practice safely.</strong> Examples use non-production workflows; credentials and production access are handled separately.</p></div>
          </div>
        </section>

        <section className="site-container py-14 text-center sm:py-16">
          <h2 className="text-2xl font-bold text-[var(--text)]">Not sure which path fits?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">Tell us what you’re trying to learn or ship, and we’ll point you to the closest track or upcoming cohort.</p>
          <Link href="/contact?service=training-interest" className="button-primary mt-6">Ask about training <ArrowRight size={16} /></Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}