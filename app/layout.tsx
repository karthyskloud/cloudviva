import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const GOOGLE_SITE_VERIFICATION = "NG3kojhNAeGCL7DYZ_O91_zKrVFXIP0ZaOqGY0z7GFE";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cloudviva.com.au"),
  title: {
    default: "CloudViva | AI DevSecOps Intelligence for Terraform & Cloud Security",
    template: "%s | CloudViva",
  },
  description:
    "CloudViva helps DevOps and security teams explain infrastructure changes in plain English and score cloud security posture across Terraform, Docker, Kubernetes, and CI/CD.",
  applicationName: "CloudViva",
  keywords: [
    "DevSecOps",
    "Terraform plan explainer",
    "Cloud security score",
    "Kubernetes security",
    "Docker security review",
    "CI/CD security audit",
    "Infrastructure as code analysis",
    "AI cloud security",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CloudViva | AI DevSecOps Intelligence",
    description:
      "Understand your infrastructure before it breaks you with AI-powered Terraform and DevSecOps analysis.",
    url: "https://www.cloudviva.com.au",
    siteName: "CloudViva",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudViva | AI DevSecOps Intelligence",
    description:
      "Explain Terraform plans and score your cloud security posture with AI-powered analysis.",
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
      </head>
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  );
}
