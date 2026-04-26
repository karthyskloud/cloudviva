import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t mt-24" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/cloudviva.png"
            alt="CloudViva"
            width={36}
            height={36}
            className="rounded-full object-cover"
            style={{
              border: "2px solid rgba(14, 165, 233, 0.5)",
              boxShadow: "0 0 10px rgba(14, 165, 233, 0.3)",
            }}
          />
          <span className="font-semibold text-white text-sm">CloudViva</span>
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
