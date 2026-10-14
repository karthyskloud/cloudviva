import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t mt-24" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/cloudviva.png"
              alt="CloudViva"
              width={36}
              height={36}
              className="rounded-full object-cover"
              style={{ border: "2px solid rgba(14, 165, 233, 0.5)", boxShadow: "0 0 10px rgba(14, 165, 233, 0.3)" }}
            />
            <span className="font-semibold text-white text-sm">CloudViva</span>
          </Link>

          <p className="text-xs text-center" style={{ color: "var(--muted)" }}>
            AI-generated results are for informational purposes only. Always verify before acting in production.
          </p>

          <div className="flex items-center gap-6 text-sm" style={{ color: "var(--muted)" }}>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/terraform" className="hover:text-white transition-colors">Terraform Explainer</Link>
            <Link href="/score" className="hover:text-white transition-colors">DevSecOps Score</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Privacy</Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          © {new Date().getFullYear()} CloudViva. All rights reserved. &nbsp;·&nbsp; cloudviva.com.au
        </div>
      </div>
    </footer>
  );
}
