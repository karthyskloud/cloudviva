import Link from "next/link";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t mt-24" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "var(--accent)" }}>
            <Shield size={12} />
          </div>
          <span>CloudViva</span>
        </Link>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          DevSecOps Intelligence for modern teams.
        </p>
        <div className="flex items-center gap-6 text-sm" style={{ color: "var(--muted)" }}>
          <Link href="/terraform" className="hover:text-white transition-colors">Terraform Explainer</Link>
          <Link href="/score" className="hover:text-white transition-colors">DevSecOps Score</Link>
        </div>
      </div>
    </footer>
  );
}
