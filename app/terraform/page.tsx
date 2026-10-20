"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode2, AlertTriangle, CheckCircle, XCircle, Info, Loader2, ArrowRight, Trash2, ShieldCheck, Terminal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TOOLS = [
  {
    id: "terraform",
    label: "Terraform",
    command: `# Generate and display the plan
terraform init
terraform plan -out=tfplan

# Or paste directly from:
terraform plan`,
    sample: `Terraform used the selected providers to generate the following execution plan.

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
    }`,
  },
  {
    id: "cloudformation",
    label: "CloudFormation",
    command: `# Step 1: Create a change set
aws cloudformation create-change-set \\
  --stack-name my-stack \\
  --template-body file://template.yaml \\
  --change-set-name my-changes

# Step 2: Describe and paste the output
aws cloudformation describe-change-set \\
  --stack-name my-stack \\
  --change-set-name my-changes`,
    sample: `{
  "StackName": "production-stack",
  "ChangeSetName": "update-rds-instance",
  "ExecutionStatus": "AVAILABLE",
  "Changes": [
    {
      "Type": "Resource",
      "ResourceChange": {
        "Action": "Modify",
        "LogicalResourceId": "RDSInstance",
        "ResourceType": "AWS::RDS::DBInstance",
        "Replacement": "True",
        "Details": [
          {
            "Target": { "Attribute": "Properties", "Name": "DBInstanceClass" },
            "Evaluation": "Static",
            "ChangeSource": "DirectModification"
          }
        ]
      }
    },
    {
      "Type": "Resource",
      "ResourceChange": {
        "Action": "Add",
        "LogicalResourceId": "NewS3Bucket",
        "ResourceType": "AWS::S3::Bucket"
      }
    },
    {
      "Type": "Resource",
      "ResourceChange": {
        "Action": "Remove",
        "LogicalResourceId": "OldLambdaFunction",
        "ResourceType": "AWS::Lambda::Function"
      }
    }
  ]
}`,
  },
  {
    id: "arm",
    label: "Azure ARM / Bicep",
    command: `# For ARM template
az deployment group what-if \\
  --resource-group myResourceGroup \\
  --template-file azuredeploy.json \\
  --parameters @parameters.json

# For Bicep
az deployment group what-if \\
  --resource-group myResourceGroup \\
  --template-file main.bicep`,
    sample: `Resource and property changes are indicated with these symbols:
  + Create
  ~ Modify
  - Delete
  x Ignore
  = Nochange
  * Deploy

The deployment will update the following scope:

Scope: /subscriptions/xxxxx/resourceGroups/myResourceGroup

  ~ Microsoft.Compute/virtualMachines/myVM [2023-07-01]
    ~ properties.hardwareProfile.vmSize: "Standard_D2s_v3" => "Standard_D4s_v3"
    ~ properties.storageProfile.osDisk.diskSizeGB: 128 => 256

  + Microsoft.Network/networkSecurityGroups/newNSG [2023-07-01]
    + location: "australiaeast"
    + properties.securityRules: [
        + {
            + name: "allow-all-inbound"
            + properties.access: "Allow"
            + properties.protocol: "*"
            + properties.sourceAddressPrefix: "*"
            + properties.destinationPortRange: "*"
          }
      ]

  - Microsoft.Storage/storageAccounts/oldStorage [2023-07-01]`,
  },
  {
    id: "pulumi",
    label: "Pulumi",
    command: `# Preview changes before deploying
pulumi preview

# For more detail
pulumi preview --diff

# Save output and paste below
pulumi preview 2>&1`,
    sample: `Previewing update (production):

     Type                          Name                    Plan
     pulumi:pulumi:Stack           my-app-production
 +   ├─ aws:ec2:SecurityGroup      web-sg                  create
 ~   ├─ aws:rds:Instance           main-db                 update
 -   ├─ aws:s3:Bucket              old-assets              delete
 ~   └─ aws:ecs:Service            app-service             update

Resources:
    + 1 to create
    ~ 2 to update
    - 1 to delete
    4 changes. 12 unchanged

Do you want to perform this update?
> yes
  no
  details`,
  },
  {
    id: "ansible",
    label: "Ansible",
    command: `# Dry run — shows what WOULD change without making changes
ansible-playbook site.yml --check --diff

# Against specific hosts
ansible-playbook site.yml --check --diff \\
  --limit production-servers

# Paste the full output below`,
    sample: `PLAY [Configure web servers] ***************************************************

TASK [Gathering Facts] *********************************************************
ok: [web01.prod]
ok: [web02.prod]

TASK [Install nginx] ***********************************************************
changed: [web01.prod]
changed: [web02.prod]

TASK [Update nginx config] *****************************************************
--- before: /etc/nginx/nginx.conf
+++ after: /etc/nginx/nginx.conf
@@ -1,5 +1,5 @@
 worker_processes auto;
-worker_connections 1024;
+worker_connections 4096;
+gzip on;

changed: [web01.prod]
changed: [web02.prod]

TASK [Ensure firewall allows HTTP] *********************************************
ok: [web01.prod]
changed: [web02.prod]

PLAY RECAP *********************************************************************
web01.prod  : ok=4  changed=2  unreachable=0  failed=0
web02.prod  : ok=4  changed=3  unreachable=0  failed=0`,
  },
];

const LOADING_STEPS = [
  "Reading plan output...",
  "Identifying resource changes...",
  "Evaluating risk levels...",
  "Checking for destructive actions...",
  "Generating recommendations...",
];

type RiskLevel = "critical" | "high" | "medium" | "low";

interface Change {
  action: string;
  resource: string;
  explanation: string;
  risk: RiskLevel;
}

interface AnalysisResult {
  summary: string;
  riskScore: number;
  riskLevel: RiskLevel;
  changes: Change[];
  warnings: string[];
  recommendations: string[];
  safeToApply: boolean;
}

const riskColors: Record<RiskLevel, string> = {
  critical: "#b83b35",
  high: "#b95316",
  medium: "#9a6810",
  low: "#18734c",
};

const actionIcons: Record<string, React.ReactNode> = {
  destroy: <XCircle size={14} style={{ color: "#ef4444" }} />,
  delete:  <XCircle size={14} style={{ color: "#ef4444" }} />,
  remove:  <XCircle size={14} style={{ color: "#ef4444" }} />,
  create:  <CheckCircle size={14} style={{ color: "#22c55e" }} />,
  add:     <CheckCircle size={14} style={{ color: "#22c55e" }} />,
  update:  <Info size={14} style={{ color: "#0e6870" }} />,
  modify:  <Info size={14} style={{ color: "#0e6870" }} />,
  replace: <AlertTriangle size={14} style={{ color: "#f97316" }} />,
};

export default function TerraformPage() {
  const [selectedTool, setSelectedTool] = useState(TOOLS[0]);
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [showCommand, setShowCommand] = useState(false);

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
        body: JSON.stringify({ plan, toolType: selectedTool.id }),
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

  return (
    <div className="site-page flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-28 pb-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 grid grid-cols-[minmax(0,1fr)_88px] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_220px] sm:gap-6">
          <div className="flex min-w-0 items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "#eaf2ef", border: "1px solid var(--border)", color: "var(--accent-2)" }}>
              <FileCode2 size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Infrastructure plan explainer</h1>
              <p className="text-sm" style={{ color: "var(--muted)" }}>AI explains your infrastructure changes in plain English — for every IaC tool</p>
            </div>
          </div>
          <Image src="/illustrations/terraform-plans.png" alt="Illustration of an infrastructure plan connected to cloud resources" width={220} height={156} priority sizes="(max-width: 640px) 88px, 220px" className="h-auto w-[88px] sm:w-[220px]" />
        </motion.div>

        {/* Tool selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex items-center gap-2 flex-wrap mb-4">
          {TOOLS.map((t) => (
            <button key={t.id} onClick={() => { setSelectedTool(t); setPlan(""); setResult(null); setError(""); setShowCommand(false); }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: selectedTool.id === t.id ? "rgba(185,83,22,0.1)" : "#ffffff",
                border: `1px solid ${selectedTool.id === t.id ? "rgba(185,83,22,0.45)" : "var(--border)"}`,
                color: selectedTool.id === t.id ? "var(--text)" : "var(--muted)",
              }}>
              {t.label}
            </button>
          ))}
        </motion.div>

        {/* How to get the output */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-4">
          <button onClick={() => setShowCommand(!showCommand)}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all hover:text-[var(--text)] w-full text-left"
            style={{ background: "#ffffff", border: "1px solid var(--border)", color: "var(--muted)" }}>
            <Terminal size={13} style={{ color: "var(--accent)" }} />
            <span>How to get {selectedTool.label} plan output</span>
            <span className="ml-auto">{showCommand ? "▲" : "▼"}</span>
          </button>
          <AnimatePresence>
            {showCommand && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden">
                <pre className="code-sample mt-1 p-4 rounded-b-xl text-xs overflow-x-auto"
                  style={{ fontFamily: "var(--font-geist-mono)", border: "1px solid var(--border)", borderTop: "none" }}>
                  {selectedTool.command}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5 text-xs"
          style={{ background: "#eaf2ef", border: "1px solid var(--border)", color: "var(--muted)" }}>
          <ShieldCheck size={14} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
          <span>Your data is <strong className="text-white">never stored or logged</strong>. Content is sent directly to AI for real-time analysis and discarded immediately. Do not paste credentials or secrets. <a href="/terms" className="hover:text-white underline transition-colors">Terms of Use</a></span>
        </div>

        {/* Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass rounded-2xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#eab308" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#22c55e" }} />
              <span className="ml-2 text-xs" style={{ color: "var(--muted)", fontFamily: "var(--font-geist-mono)" }}>{selectedTool.label} plan output</span>
            </div>
            <button onClick={() => setPlan(selectedTool.sample)}
              className="text-xs px-2 py-1 rounded transition-all hover:text-[var(--accent)]"
              style={{ color: "var(--muted)", background: "#f3f7f5" }}>
              Load sample
            </button>
          </div>
          <textarea
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            placeholder={`Paste your ${selectedTool.label} plan output here...`}
            rows={12}
            className="code-editor w-full p-4 text-sm resize-none outline-none"
            style={{ background: "transparent", color: "var(--text)", fontFamily: "var(--font-geist-mono)", fontSize: "12px", lineHeight: "1.6" }}
          />
        </motion.div>

        <div className="flex items-center gap-3 mb-8">
          <button onClick={analyze} disabled={loading || !plan.trim()}
            className="button-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <><Loader2 size={15} className="animate-spin" /> {LOADING_STEPS[loadingStep]}</> : <>Explain Plan <ArrowRight size={15} /></>}
          </button>
          {plan && (
            <button onClick={() => { setPlan(""); setResult(null); setError(""); }}
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Summary */}
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
                  {result.safeToApply ? <><CheckCircle size={14} /> Safe to apply</> : <><XCircle size={14} /> Review required before applying</>}
                </div>
              </div>

              {/* Changes */}
              {result.changes?.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-4">Resource Changes</h3>
                  <div className="space-y-3">
                    {result.changes.map((c, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "#f3f7f5" }}>
                        {actionIcons[c.action.toLowerCase()] || <Info size={14} />}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-white" style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px" }}>{c.resource}</span>
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
                        <AlertTriangle size={14} className="mt-0.5 shrink-0" style={{ color: "var(--yellow)" }} />
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
