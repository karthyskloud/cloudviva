"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/terraform", label: "IaC Plan Explainer" },
    { href: "/score", label: "DevSecOps Score" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/cloudviva.png"
            alt="CloudViva"
            width={44}
            height={44}
            className="rounded-full object-cover"
            style={{
              border: "2px solid rgba(14, 165, 233, 0.5)",
              boxShadow: "0 0 12px rgba(14, 165, 233, 0.4)",
            }}
          />
          <span className="font-semibold text-white text-sm">CloudViva</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-md text-sm transition-all"
              style={{
                color: pathname === l.href ? "white" : "var(--muted)",
                background: pathname === l.href ? "rgba(14,165,233,0.15)" : "transparent",
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
