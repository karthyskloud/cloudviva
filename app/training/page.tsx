import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Cloud, GitBranch, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trainingReferences, trainingTracks, upcomingCohorts } from "@/lib/training";

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
          <div className="site-container grid items-center gap-8 py-12 sm:grid-cols-[1.05fr_0.95fr] sm:py-16 lg:gap-10">
            <div>
              <p className="section-eyebrow">CloudViva learning</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-[var(--text)] lg:text-5xl">
                From cloud basics to your first confident release.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
                Follow structured paths with prerequisites, sequenced modules, hands-on labs, and a practical capstone.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 lg:flex-row">
                <Link href="#cohorts" className="button-primary whitespace-nowrap">See upcoming batches <ArrowRight size={16} /></Link>
                <Link href="#learning-paths" className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap px-2 font-semibold text-[var(--accent-2)]">Browse the curriculum <BookOpen size={16} /></Link>
              </div>
            </div>
            <div className="training-hero__visual">
              <Image src="/illustrations/learning-paths.png" alt="Illustrated learning path progressing through four cloud and DevOps stages" fill priority sizes="(max-width: 1024px) 100vw, 45vw" />
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
                <article id={track.id} key={track.id} className="training-course scroll-mt-8">
                  <div>
                    <p className="font-mono text-sm font-semibold text-[var(--accent)]">COURSE {track.number}</p>
                    <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-[var(--text)]">{track.title}</h3>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{track.summary}</p>
                      </div>
                      <Link href={`/contact?service=training-interest&course=${track.id}`} className="button-primary shrink-0 text-sm">Ask about this course <ArrowRight size={15} /></Link>
                    </div>
                    <p className="mt-5 rounded-md bg-white px-4 py-3 text-sm leading-relaxed text-[var(--muted)]"><strong className="text-[var(--text)]">Best for:</strong> {track.audience}<br /><strong className="text-[var(--text)]">Before you start:</strong> {track.prerequisites}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-[var(--accent-2)]">Modules and hands-on labs</h4>
                    <ol className="course-modules mt-4">
                      {track.modules.map((module, index) => (
                        <li key={module.title} className="course-module">
                          <span className="course-module__number">{String(index + 1).padStart(2, "0")}</span>
                          <div className="min-w-0">
                            <h5 className="font-semibold text-[var(--text)]">{module.title}</h5>
                            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                              {module.topics.map((topic) => <li key={topic} className="text-sm leading-relaxed text-[var(--muted)]">{topic}</li>)}
                            </ul>
                            <p className="mt-3 text-sm leading-relaxed"><strong className="text-[var(--accent)]">Lab:</strong> <span className="text-[var(--text)]">{module.lab}</span></p>
                          </div>
                        </li>
                      ))}
                    </ol>
                    <div className="course-capstone mt-6">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--accent-2)]" />
                      <p className="text-sm leading-relaxed text-[var(--text)]"><strong>Capstone deliverable:</strong> {track.capstone}</p>
                    </div>
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

        <section className="site-container py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <p className="section-eyebrow">Go deeper</p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--text)]">Official guides behind the learning paths.</h2>
            </div>
            <ul className="grid flex-1 gap-x-8 gap-y-4 sm:grid-cols-2 md:max-w-2xl">
              {trainingReferences.map((reference) => (
                <li key={reference.href} className="border-t border-[var(--border)] pt-3">
                  <a href={reference.href} target="_blank" rel="noreferrer" className="font-semibold text-[var(--accent-2)] hover:text-[var(--accent)]">
                    {reference.label} <span aria-hidden="true">↗</span>
                  </a>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{reference.note}</p>
                </li>
              ))}
            </ul>
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