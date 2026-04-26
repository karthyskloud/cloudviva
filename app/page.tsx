"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, FileCode2, GitBranch, Zap, Lock, BarChart3, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function fadeUp(i: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.1, duration: 0.5 },
  };
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center pt-40 pb-24 px-6 grid-bg overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)" }} />

        <motion.div {...fadeUp(0)}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
          style={{ background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.3)", color: "var(--accent)" }}>
          <Zap size={11} /> AI-Powered DevSecOps Intelligence
        </motion.div>

        <motion.h1 {...fadeUp(1)}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight max-w-4xl">
          Understand your{" "}
          <span style={{ background: "linear-gradient(135deg, #0ea5e9, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            infrastructure
          </span>{" "}
          before it breaks you
        </motion.h1>

        <motion.p {...fadeUp(2)}
          className="mt-6 text-lg max-w-xl leading-relaxed" style={{ color: "var(--muted)" }}>
          Two AI-powered tools that make DevSecOps fast, clear, and actionable —
          from Terraform plan reviews to full security scoring.
        </motion.p>

        <motion.div {...fadeUp(3)}
          className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <Link href="/terraform"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all hover:opacity-90"
            style={{ background: "var(--accent)", boxShadow: "0 0 30px rgba(14,165,233,0.4)" }}>
            Explain my Terraform Plan <ArrowRight size={16} />
          </Link>
          <Link href="/score"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:text-white glass"
            style={{ color: "var(--muted)" }}>
            Score my Repo <BarChart3 size={16} />
          </Link>
        </motion.div>

        {/* Terminal preview */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 w-full max-w-3xl glass rounded-2xl overflow-hidden animate-float"
          style={{ border: "1px solid rgba(14,165,233,0.3)", boxShadow: "0 0 60px rgba(14,165,233,0.1)" }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.3)" }}>
            <div className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#eab308" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
            <span className="ml-3 text-xs" style={{ color: "var(--muted)", fontFamily: "var(--font-geist-mono)" }}>terraform plan | cloudviva explain</span>
          </div>
          <div className="p-5 text-left" style={{ fontFamily: "var(--font-geist-mono)", fontSize: "13px" }}>
            <p style={{ color: "var(--muted)" }}>$ terraform plan -out=tfplan &amp;&amp; cloudviva explain tfplan</p>
            <div className="mt-3 space-y-2">
              <p style={{ color: "#22c55e" }}>✓ Analyzing 12 resource changes...</p>
              <p className="text-white">⚠ <span style={{ color: "#ef4444", fontWeight: 600 }}>CRITICAL:</span> aws_s3_bucket.data will be <span style={{ color: "#ef4444" }}>DESTROYED</span> — this is irreversible</p>
              <p className="text-white">ℹ <span style={{ color: "#eab308" }}>HIGH:</span> Security group opens port 0-65535 to 0.0.0.0/0</p>
              <p className="text-white">✓ <span style={{ color: "#22c55e" }}>SAFE:</span> 10 resources will be updated with no data loss</p>
              <p className="mt-2" style={{ color: "var(--muted)" }}>→ <span className="text-white">Risk Score: 8.2/10</span> — Review required before applying</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tools */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Two tools. One mission.</h2>
          <p className="mt-3 text-base" style={{ color: "var(--muted)" }}>
            Stop guessing. Start knowing exactly what your infrastructure does and how secure it is.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: <FileCode2 size={22} />,
              title: "Terraform Plan Explainer",
              desc: "Paste your terraform plan output. AI reads it and tells you in plain English exactly what will change, what's risky, and what could break production.",
              href: "/terraform",
              cta: "Explain a Plan",
              features: ["Plain English summaries", "Risk level detection", "Destruction warnings", "Cost impact analysis"],
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
          <h2 className="text-3xl font-bold text-white">How it works</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "01", icon: <FileCode2 size={20} />, title: "Paste or connect", desc: "Paste your terraform plan or connect your GitHub repo. No account required to try." },
            { step: "02", icon: <Zap size={20} />, title: "AI analyzes instantly", desc: "Our AI reads every line — flags risks, explains changes, scores security posture in seconds." },
            { step: "03", icon: <Lock size={20} />, title: "Act with confidence", desc: "Get a clear report with specific fixes. Apply your plan knowing exactly what will happen." },
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
          <h2 className="text-3xl font-bold text-white">Who uses CloudViva</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <GitBranch size={18} />, title: "DevOps Engineers", desc: "Review terraform plans with confidence before applying to production." },
            { icon: <Shield size={18} />, title: "Security Teams", desc: "Audit repos for DevSecOps compliance without manual scanning." },
            { icon: <BarChart3 size={18} />, title: "Startups", desc: "Prep for SOC2 / ISO27001 with an instant security posture score." },
            { icon: <Zap size={18} />, title: "CI/CD Pipelines", desc: "Auto-score every pull request. Catch issues before they reach main." },
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
          style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(139,92,246,0.05) 100%)" }}>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Start for free. No signup.</h2>
          <p className="mt-4 text-base" style={{ color: "var(--muted)" }}>
            Paste a terraform plan or drop a repo URL. See results in seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/terraform"
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-medium text-white transition-all hover:opacity-90"
              style={{ background: "var(--accent)", boxShadow: "0 0 30px rgba(14,165,233,0.4)" }}>
              Explain a Terraform Plan <ArrowRight size={16} />
            </Link>
            <Link href="/score"
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-medium transition-all hover:text-white glass"
              style={{ color: "var(--muted)" }}>
              Get my Security Score
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
