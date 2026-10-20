"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Loader2, ArrowRight, AlertTriangle, CheckCircle, XCircle, Trash2, Upload, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SAMPLES: Record<string, string> = {
  "Dockerfile": `FROM node:14
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
ENV NODE_ENV=development
ENV DB_PASSWORD=mysecretpassword123
USER root
CMD ["node", "server.js"]`,

  "Kubernetes manifest": `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: myapp:latest
        ports:
        - containerPort: 80
        env:
        - name: DB_PASSWORD
          value: "admin123"
        securityContext:
          privileged: true
          runAsUser: 0
        resources: {}
---
apiVersion: v1
kind: Service
metadata:
  name: web-app
spec:
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    app: web-app`,

  "CI/CD pipeline": `name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2

    - name: Build Docker image
      run: docker build -t myapp .

    - name: Login to Docker Hub
      run: echo "\${{ secrets.DOCKER_PASSWORD }}" | docker login -u admin --password-stdin

    - name: Push image
      run: docker push myapp:latest

    - name: Deploy to server
      run: |
        ssh root@\${{ secrets.SERVER_IP }} "
          docker pull myapp:latest &&
          docker stop app || true &&
          docker run -d --name app -p 80:80 --privileged myapp:latest
        "`,

  "Terraform configuration": `provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "data" {
  bucket = "company-prod-data"
}

resource "aws_s3_bucket_public_access_block" "data" {
  bucket = aws_s3_bucket.data.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_security_group" "web" {
  name = "web-sg"
  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "main" {
  engine         = "mysql"
  instance_class = "db.t3.micro"
  username       = "admin"
  password       = "mysecretpassword"
  publicly_accessible = true
  skip_final_snapshot = true
}`,

  "Docker Compose file": `version: '3'
services:
  web:
    image: myapp:latest
    ports:
      - "80:80"
    environment:
      - DB_PASSWORD=admin123
      - SECRET_KEY=hardcoded-secret
    privileged: true
    volumes:
      - /:/host
    restart: always

  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: appdb
    ports:
      - "3306:3306"
    volumes:
      - ./data:/var/lib/mysql

  redis:
    image: redis:latest
    ports:
      - "6379:6379"`,
};

const CONTENT_TYPES = [
  { value: "Dockerfile", label: "Dockerfile" },
  { value: "Kubernetes manifest", label: "K8s Manifest" },
  { value: "CI/CD pipeline", label: "CI/CD Pipeline" },
  { value: "Terraform configuration", label: "Terraform Config" },
  { value: "Docker Compose file", label: "Docker Compose" },
];

type Priority = "critical" | "high" | "medium" | "low";
type Status = "pass" | "warn" | "fail";

interface Category {
  name: string;
  score: number;
  status: Status;
  findings: string[];
}

interface Fix {
  priority: Priority;
  title: string;
  description: string;
  code?: string;
}

interface ScoreResult {
  overallScore: number;
  grade: string;
  categories: Category[];
  criticalIssues: string[];
  fixes: Fix[];
  summary: string;
}

const gradeColors: Record<string, string> = {
  A: "#18734c",
  B: "#0e6870",
  C: "#9a6810",
  D: "#b95316",
  F: "#b83b35",
};

const priorityClass: Record<Priority, string> = {
  critical: "risk-critical",
  high:     "risk-high",
  medium:   "risk-medium",
  low:      "risk-low",
};

const statusIcon = (s: Status) => {
  if (s === "pass")  return <CheckCircle size={14} style={{ color: "#18734c" }} />;
  if (s === "warn")  return <AlertTriangle size={14} style={{ color: "#9a6810" }} />;
  return <XCircle size={14} style={{ color: "#b83b35" }} />;
};

const LOADING_STEPS = [
  "Scanning configuration...",
  "Checking security policies...",
  "Identifying vulnerabilities...",
  "Calculating risk score...",
  "Generating fixes...",
];

export default function ScorePage() {
  const [content, setContent] = useState("");
  const [type, setType] = useState("Dockerfile");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState("");

  async function analyze() {
    if (!content.trim()) return;
    setLoading(true);
    setLoadingStep(0);
    setError("");
    setResult(null);
    const stepInterval = setInterval(() => setLoadingStep(s => Math.min(s + 1, LOADING_STEPS.length - 1)), 1800);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, type }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }
      if (res.headers.get("X-Cache") === "HIT") {
        setResult(await res.json());
      } else {
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");
        const decoder = new TextDecoder();
        let fullText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
        }
        const jsonMatch = fullText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Could not parse response");
        setResult(JSON.parse(jsonMatch[0]));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  }

  const scoreColor = result
    ? result.overallScore >= 90 ? "#18734c"
    : result.overallScore >= 70 ? "#0e6870"
    : result.overallScore >= 50 ? "#9a6810"
    : result.overallScore >= 30 ? "#b95316"
    : "#b83b35"
    : "var(--muted)";

  return (
    <div className="site-page flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 grid grid-cols-[minmax(0,1fr)_88px] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_220px] sm:gap-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "#eaf2ef", border: "1px solid var(--border)", color: "var(--accent-2)" }}>
              <Shield size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">DevSecOps Score</h1>
              <p className="text-sm" style={{ color: "var(--muted)" }}>Paste any DevOps config — get a security score with actionable fixes</p>
            </div>
          </div>
          <Image src="/illustrations/security-score.png" alt="Illustration of a security shield and assessment checklist" width={220} height={156} priority sizes="(max-width: 640px) 88px, 220px" className="h-auto w-[88px] sm:w-[220px]" />
        </motion.div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5 text-xs" style={{ background: "#eaf2ef", border: "1px solid var(--border)", color: "var(--muted)" }}>
          <ShieldCheck size={14} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
          <span>Your data is <strong className="text-white">never stored or logged</strong>. Content is sent directly to AI for real-time analysis and discarded immediately. Do not paste credentials or secrets. <a href="/terms" className="hover:text-white underline transition-colors">Terms of Use</a></span>
        </div>

        {/* Type selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex items-center gap-2 flex-wrap mb-4">
          {CONTENT_TYPES.map((t) => (
            <button key={t.value} onClick={() => setType(t.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: type === t.value ? "rgba(185,83,22,0.1)" : "#ffffff",
                border: `1px solid ${type === t.value ? "rgba(185,83,22,0.45)" : "var(--border)"}`,
                color: type === t.value ? "var(--text)" : "var(--muted)",
              }}>
              {t.label}
            </button>
          ))}
        </motion.div>

        {/* Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#eab308" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#22c55e" }} />
              <span className="ml-2 text-xs" style={{ color: "var(--muted)", fontFamily: "var(--font-geist-mono)" }}>{type}</span>
            </div>
            <button onClick={() => setContent(SAMPLES[type] || "")}
              className="text-xs px-2 py-1 rounded transition-all hover:text-[var(--accent)]"
              style={{ color: "var(--muted)", background: "#f3f7f5" }}>
              Load sample
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Paste your ${type} here...`}
            rows={12}
            className="code-editor w-full p-4 text-sm resize-none outline-none"
            style={{
              background: "transparent",
              color: "var(--text)",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "12px",
              lineHeight: "1.6",
            }}
          />
        </motion.div>

        <div className="flex items-center gap-3 mb-8">
          <button onClick={analyze} disabled={loading || !content.trim()}
            className="button-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <><Loader2 size={15} className="animate-spin" /> {LOADING_STEPS[loadingStep]}</> : <>Get Security Score <ArrowRight size={15} /></>}
          </button>
          {content && (
            <button onClick={() => { setContent(""); setResult(null); setError(""); }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm transition-all hover:text-[var(--accent)] glass"
              style={{ color: "var(--muted)" }}>
              <Trash2 size={13} /> Clear
            </button>
          )}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl mb-6 risk-critical">
              <XCircle size={16} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Score overview */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-start gap-6">
                  <div className="relative w-24 h-24 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border)" strokeWidth="2.5" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke={scoreColor} strokeWidth="2.5"
                        strokeDasharray={`${result.overallScore} 100`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">{result.overallScore}</span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>/ 100</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-bold text-white">Security Score</h2>
                      <span className="text-2xl font-bold" style={{ color: gradeColors[result.grade] || scoreColor }}>
                        {result.grade}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{result.summary}</p>
                  </div>
                </div>
              </div>

              {/* Critical issues */}
              {result.criticalIssues?.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <XCircle size={15} style={{ color: "#ef4444" }} /> Critical Issues
                  </h3>
                  <ul className="space-y-2">
                    {result.criticalIssues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm p-2.5 rounded-lg risk-critical">
                        <AlertTriangle size={13} className="mt-0.5 shrink-0" /> {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Categories */}
              {result.categories?.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-4">Category Breakdown</h3>
                  <div className="space-y-3">
                    {result.categories.map((cat, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 text-sm">
                            {statusIcon(cat.status)}
                            <span className="text-white font-medium">{cat.name}</span>
                          </div>
                          <span className="text-sm font-medium" style={{ color: cat.score >= 70 ? "#18734c" : cat.score >= 40 ? "#9a6810" : "#b83b35" }}>
                            {cat.score}/100
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                          <div className="h-full rounded-full transition-all"
                            style={{
                              width: `${cat.score}%`,
                              background: cat.score >= 70 ? "#18734c" : cat.score >= 40 ? "#9a6810" : "#b83b35",
                            }} />
                        </div>
                        {cat.findings?.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {cat.findings.map((f, j) => (
                              <li key={j} className="text-xs pl-2" style={{ color: "var(--muted)" }}>· {f}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fixes */}
              {result.fixes?.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Upload size={15} style={{ color: "var(--accent)" }} /> Recommended Fixes
                  </h3>
                  <div className="space-y-3">
                    {result.fixes.map((fix, i) => (
                      <div key={i} className="p-4 rounded-xl" style={{ background: "#f3f7f5", border: "1px solid var(--border)" }}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityClass[fix.priority]}`}>
                            {fix.priority}
                          </span>
                          <span className="text-sm font-medium text-white">{fix.title}</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{fix.description}</p>
                        {fix.code && (
                          <pre className="code-sample mt-2 p-2.5 rounded-lg text-xs overflow-x-auto"
                            style={{ fontFamily: "var(--font-geist-mono)" }}>
                            {fix.code}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
