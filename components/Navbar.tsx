"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/terraform", label: "Terraform Explainer" },
    { href: "/score", label: "DevSecOps Score" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
            <Shield size={14} />
          </div>
          <span>CloudViva</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-md text-sm transition-all"
              style={{
                color: pathname === l.href ? "white" : "var(--muted)",
                background: pathname === l.href ? "rgba(99,102,241,0.15)" : "transparent",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="/terraform"
          className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: "var(--accent)" }}
        >
          Try Free
        </Link>
      </div>
    </nav>
  );
}
