"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode2, AlertTriangle, CheckCircle, XCircle, Info, Loader2, ArrowRight, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SAMPLE = `Terraform used the selected providers to generate the following execution plan.

Plan: 3 to add, 2 to change, 1 to destroy.

# aws_s3_bucket.data will be destroyed
  - resource "aws_s3_bucket" "data" {
      - bucket = "company-prod-data-bucket"
      - id     = "company-prod-data-bucket"
    }

# aws_security_group.web will be updated in-place
  ~ resource "aws_security_group" "web" {
      ~ ingress = [
          + {
              + cidr_blocks = ["0.0.0.0/0"]
              + from_port   = 0
              + to_port     = 65535
            },
        ]
    }

# aws_instance.app will be created
  + resource "aws_instance" "app" {
      + ami           = "ami-0c55b159cbfafe1f0"
      + instance_type = "t3.medium"
    }`;

type RiskLevel = "critical" | "high" | "medium" | "low";

interface Change {
  action: string;
  resource: string;
  explanation: string;
  risk: RiskLevel;
}

interface Fix {
  priority: RiskLevel;
  title: string;
  description: string;
}

interface AnalysisResult {
  summary: string;
  riskScore: number;
  riskLevel: RiskLevel;
  changes: Change[];
  warnings: string[];
  recommendations: string[];
  safeToApply: boolean;
  fixes?: Fix[];
}

const riskColors: Record<RiskLevel, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
};

const actionIcons: Record<string, React.ReactNode> = {
  destroy: <XCircle size={14} style={{ color: "#ef4444" }} />,
  create:  <CheckCircle size={14} style={{ color: "#22c55e" }} />,
  update:  <Info size={14} style={{ color: "#0ea5e9" }} />,
  replace: <AlertTriangle size={14} style={{ color: "#f97316" }} />,
};

const LOADING_STEPS = [
  "Reading terraform plan...",
  "Identifying resource changes...",
  "Evaluating risk levels...",
  "Checking for destructive actions...",
  "Generating recommendations...",
];

export default function TerraformPage() {
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  async function analyze() {
    if (!plan.trim()) return;
    setLoading(true);
    setLoadingStep(0);
    setError("");
    setResult(null);
    const stepInterval = setInterval(() => setLoadingStep(s => Math.min(s + 1, LOADING_STEPS.length - 1)), 1800);
    try {
      const res = await fetch("/api/terraform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.3)", color: "var(--accent)" }}>
              <FileCode2 size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Terraform Plan Explainer</h1>
              <p className="text-sm" style={{ color: "var(--muted)" }}>Paste your plan output — AI explains every change in plain English</p>
            </div>
          </div>
        </motion.div>

        {/* Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#eab308" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#22c55e" }} />
              <span className="ml-2 text-xs" style={{ color: "var(--muted)", fontFamily: "var(--font-geist-mono)" }}>terraform plan output</span>
            </div>
            <button onClick={() => setPlan(SAMPLE)} className="text-xs px-2 py-1 rounded transition-all hover:text-white"
              style={{ color: "var(--muted)", background: "rgba(255,255,255,0.04)" }}>
              Load sample
            </button>
          </div>
          <textarea
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            placeholder="Paste your terraform plan output here..."
            rows={12}
            className="w-full p-4 text-sm resize-none outline-none"
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
          <button onClick={analyze} disabled={loading || !plan.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ background: "var(--accent)" }}>
            {loading ? <><Loader2 size={15} className="animate-spin" /> {LOADING_STEPS[loadingStep]}</> : <>Explain Plan <ArrowRight size={15} /></>}
          </button>
          {plan && (
            <button onClick={() => { setPlan(""); setResult(null); setError(""); }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm transition-all hover:text-white glass"
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-4">
              {/* Summary card */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="font-semibold text-white text-lg mb-1">Analysis Result</h2>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{result.summary}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="text-3xl font-bold" style={{ color: riskColors[result.riskLevel] }}>
                      {result.riskScore}<span className="text-lg">/10</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium risk-${result.riskLevel}`}>
                      {result.riskLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${result.safeToApply ? "risk-low" : "risk-critical"}`}>
                  {result.safeToApply
                    ? <><CheckCircle size={14} /> Safe to apply</>
                    : <><XCircle size={14} /> Review required before applying</>}
                </div>
              </div>

              {/* Changes */}
              {result.changes?.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-4">Resource Changes</h3>
                  <div className="space-y-3">
                    {result.changes.map((c, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                        {actionIcons[c.action] || <Info size={14} />}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-white"
                              style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px" }}>
                              {c.resource}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 rounded capitalize"
                              style={{ background: `${riskColors[c.risk]}15`, color: riskColors[c.risk], border: `1px solid ${riskColors[c.risk]}30` }}>
                              {c.action}
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>{c.explanation}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded shrink-0 risk-${c.risk}`}>{c.risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {result.warnings?.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-3">Warnings</h3>
                  <ul className="space-y-2">
                    {result.warnings.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle size={14} className="mt-0.5 shrink-0" style={{ color: "#eab308" }} />
                        <span style={{ color: "var(--muted)" }}>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations?.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                        <span style={{ color: "var(--muted)" }}>{r}</span>
                      </li>
                    ))}
                  </ul>
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
