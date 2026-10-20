"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Shield, FileCode2, GitBranch, CheckCircle, BookOpen, CalendarDays } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trainingTracks, upcomingCohorts } from "@/lib/training";

export default function Home() {
  return (
    <div className="site-page flex min-h-screen flex-col">
      <Navbar />

      <section className="learning-hero">
        <div className="site-container grid items-center gap-8 py-12 sm:grid-cols-[1.05fr_0.95fr] sm:py-16 sm:gap-6 lg:gap-10">
          <div>
            <p className="section-eyebrow">CloudViva · Learn by building</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-[1.05] text-[var(--text)] sm:text-5xl xl:text-7xl">
              Learn cloud.<br /><span className="text-[var(--accent)]">Ship with confidence.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              Practical cloud and DevOps training for developers and small teams—from cloud basics to your first reliable release pipeline.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3 lg:flex-row">
              <Link href="#cohorts" className="button-primary whitespace-nowrap">Explore upcoming cohorts <ArrowRight size={16} /></Link>
              <Link href="/training#learning-paths" className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap px-2 font-semibold text-[var(--accent-2)]">See what you’ll learn <BookOpen size={16} /></Link>
            </div>
            <p className="mt-6 text-sm text-[var(--muted)]">
              Beginner-friendly <span className="mx-2 text-[var(--accent)]">/</span> Hands-on labs <span className="mx-2 text-[var(--accent)]">/</span> No existing DevOps setup needed
            </p>
          </div>
          <div className="learning-hero__visual">
            <Image src="/illustrations/cloud-learning.png" alt="Illustration of cloud architecture connected to learning modules and code" fill priority sizes="(max-width: 1024px) 100vw, 45vw" />
            <div className="learning-hero__caption"><GitBranch size={15} /> Learn it. Build it. Review it.</div>
          </div>
        </div>
      </section>

      <section className="site-container py-16 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-eyebrow">Choose your starting point</p>
            <h2 className="mt-2 text-3xl font-bold text-[var(--text)]">Learn the parts that make software shippable.</h2>
          </div>
          <Link href="/training" className="inline-flex items-center gap-2 font-semibold text-[var(--accent-2)]">View learning paths <ArrowRight size={16} /></Link>
        </div>
        <div className="grid gap-x-8 gap-y-7 md:grid-cols-3">
          {trainingTracks.map((track) => (
            <article key={track.id} className="learning-path-preview">
              <span className="font-mono text-sm font-semibold text-[var(--accent)]">{track.number} /</span>
              <p className="mt-4 text-xs font-semibold uppercase text-[var(--accent-2)]">{track.audience}</p>
              <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">{track.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{track.summary}</p>
              <Link href={`/training#${track.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-2)]">Explore this course <ArrowRight size={14} /></Link>
            </article>
          ))}
        </div>
      </section>

      <section id="cohorts" className="border-y bg-[#eaf2ef] py-16 sm:py-20 section-rule">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="section-eyebrow">Upcoming learning batches</p>
            <h2 className="mt-2 text-3xl font-bold text-[var(--text)]">Pick a topic. Register your interest.</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">Cohort dates and format are being finalized. Register interest and we’ll send the schedule and fees before enrollment opens.</p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {upcomingCohorts.map((cohort) => (
              <article key={cohort.id} className="cohort-card">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[var(--accent-2)]"><CalendarDays size={14} /> Interest open</span>
                  <span className="text-xs text-[var(--muted)]">Dates TBA</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[var(--text)]">{cohort.title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-relaxed text-[var(--muted)]">{cohort.focus}</p>
                <Link href={`/contact?service=training-interest&course=${cohort.id}`} className="button-primary mt-5 w-full text-sm">Register interest <ArrowRight size={15} /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[#eaf2ef]">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="section-eyebrow">Hands-on engineering</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Need a person to fix or review your cloud setup?</h2>
            <p className="mt-2 text-sm max-w-2xl" style={{ color: "var(--muted)" }}>
              Get scoped cloud infrastructure, CI/CD, and security help, with clear deliverables and a direct handoff.
            </p>
          </div>
          <Link href="/services" className="button-primary shrink-0">View services <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)]">Practice what you learn with free tools.</h2>
          <p className="mt-3 text-base" style={{ color: "var(--muted)" }}>
            Use the plan explainer and security score to connect lessons to real infrastructure changes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: <FileCode2 size={22} />,
              title: "IaC Plan Explainer",
              desc: "Paste your Terraform, CloudFormation, Azure ARM, Pulumi or Ansible plan output. AI explains every change in plain English with risk levels and recommendations.",
              href: "/terraform",
              cta: "Explain a Plan",
              features: ["Terraform, CloudFormation, ARM, Pulumi", "Plain English summaries", "Risk level detection", "Destruction warnings"],
              badge: "Tool 01",
            },
            {
              icon: <Shield size={22} />,
              title: "DevSecOps Score",
              desc: "Connect your GitHub repo. Get a security score across your Dockerfile, K8s manifests, CI/CD pipelines, and IaC — with actionable fixes.",
              href: "/score",
              cta: "Score my Repo",
              features: ["Security posture score", "Dockerfile analysis", "K8s manifest scanning", "CI/CD pipeline audit"],
              badge: "Tool 02",
            },
          ].map((tool, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.5 }}
              className="glass rounded-2xl p-7 flex flex-col gap-5 group hover:border-indigo-500/40 transition-all"
              style={{ borderColor: "var(--border)" }}>
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(14,165,233,0.15)", color: "var(--accent)", border: "1px solid rgba(14,165,233,0.3)" }}>
                  {tool.icon}
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded" style={{ color: "var(--muted)", background: "rgba(255,255,255,0.04)" }}>
                  {tool.badge}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{tool.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{tool.desc}</p>
              </div>
              <ul className="space-y-2">
                {tool.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
                    <CheckCircle size={13} style={{ color: "var(--accent)" }} /> {f}
                  </li>
                ))}
              </ul>
              <Link href={tool.href}
                className="mt-auto flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-3"
                style={{ color: "var(--accent)" }}>
                {tool.cta} <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">A clear route from learning to doing</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "01", icon: <BookOpen size={20} />, title: "Choose a learning path", desc: "Start with cloud foundations, a first delivery pipeline, or infrastructure as code." },
            { step: "02", icon: <FileCode2 size={20} />, title: "Practice in small steps", desc: "Use concrete examples to understand the workflow before applying it to a real system." },
            { step: "03", icon: <Shield size={20} />, title: "Carry it into your work", desc: "Use the checklists and free tools to review changes and make the next release safer." },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              className="relative p-6 rounded-2xl glass flex flex-col gap-3">
              <span className="text-5xl font-bold" style={{ color: "rgba(14,165,233,0.15)", fontFamily: "var(--font-geist-mono)" }}>{s.step}</span>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center -mt-2"
                style={{ background: "rgba(14,165,233,0.12)", color: "var(--accent)" }}>
                {s.icon}
              </div>
              <h3 className="font-semibold text-white">{s.title}</h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Different starting points. Practical next steps.</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <BookOpen size={18} />, title: "New to cloud", desc: "Build a clear foundation without assuming prior platform experience." },
            { icon: <GitBranch size={18} />, title: "Developers", desc: "Move from manual releases toward tested, repeatable delivery." },
            { icon: <Shield size={18} />, title: "Small teams", desc: "Learn access, backups, monitoring, and cost-aware operations as you grow." },
            { icon: <FileCode2 size={18} />, title: "Platform builders", desc: "Make infrastructure changes easier to review and repeat across environments." },
          ].map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-5 rounded-xl glass flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(14,165,233,0.1)", color: "var(--accent)" }}>
                {c.icon}
              </div>
              <h4 className="font-semibold text-white text-sm">{c.title}</h4>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-12 text-center glow-border"
          style={{ background: "#eaf2ef" }}>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)]">Start learning by trying a tool.</h2>
          <p className="mt-4 text-base" style={{ color: "var(--muted)" }}>
            Use the free plan explainer or security score alongside the training paths.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/terraform" className="button-primary">Explain a plan <ArrowRight size={16} /></Link>
            <Link href="/score" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-5 font-semibold text-[var(--accent-2)]">Try the security score</Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
