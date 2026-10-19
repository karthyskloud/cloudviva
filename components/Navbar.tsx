"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/training", label: "Training" },
    { href: "/services", label: "Services" },
    { href: "/terraform", label: "Plan explainer" },
    { href: "/score", label: "Security score" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="site-nav">
      <div className="site-container flex min-h-[68px] items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="CloudViva home">
          <Image src="/cloudviva.png" alt="" width={40} height={40} className="rounded-full object-cover" />
          <span className="font-semibold text-[var(--text)]">CloudViva</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="site-nav__link"
              aria-current={pathname === l.href ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link href="/training#cohorts" className="button-primary shrink-0 text-sm">
          <span className="hidden sm:inline">Explore batches</span>
          <span className="sm:hidden">Learn</span>
        </Link>
      </div>
      <div className="site-container site-nav__mobile-links pb-2 lg:hidden" aria-label="Main navigation">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="site-nav__link shrink-0" aria-current={pathname === l.href ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
