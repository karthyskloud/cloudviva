import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="site-footer mt-16">
      <div className="site-container py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <Link href="/" className="flex items-center gap-2 text-[var(--text)]">
            <Image src="/cloudviva.png" alt="" width={36} height={36} className="rounded-full object-cover" />
            <span className="font-semibold text-sm">CloudViva</span>
          </Link>

          <p className="max-w-sm text-sm leading-relaxed">
            Learn cloud and DevOps by building. Use the free tools to make infrastructure changes easier to understand.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <Link href="/training" className="hover:text-[var(--accent)]">Training</Link>
            <Link href="/services" className="hover:text-[var(--accent)] transition-colors">Services</Link>
            <Link href="/contact" className="hover:text-[var(--accent)] transition-colors">Contact</Link>
            <Link href="/terraform" className="hover:text-[var(--accent)]">Plan explainer</Link>
            <Link href="/score" className="hover:text-[var(--accent)]">Security score</Link>
            <Link href="/terms" className="hover:text-[var(--accent)]">Terms & Privacy</Link>
          </div>
        </div>

        <div className="mt-8 border-t pt-5 text-xs" style={{ borderColor: "var(--border)" }}>
          © {new Date().getFullYear()} CloudViva · cloudviva.com.au
        </div>
      </div>
    </footer>
  );
}
