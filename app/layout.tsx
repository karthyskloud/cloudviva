import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const GOOGLE_SITE_VERIFICATION = "NG3kojhNAeGCL7DYZ_O91_zKrVFXIP0ZaOqGY0z7GFE";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cloudviva.com.au"),
  title: {
    default: "CloudViva | Learn Cloud & DevOps by Building",
    template: "%s | CloudViva",
  },
  description:
    "Build practical cloud and DevOps skills with beginner-friendly learning paths, upcoming cohorts, infrastructure tools, and hands-on engineering support.",
  applicationName: "CloudViva",
  keywords: [
    "DevSecOps",
    "Terraform plan explainer",
    "Cloud and DevOps training",
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
    title: "CloudViva | Cloud & DevOps Learning",
    description:
      "Learn cloud foundations, infrastructure as code, CI/CD, and practical DevOps workflows with CloudViva.",
    url: "https://www.cloudviva.com.au",
    siteName: "CloudViva",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudViva | Cloud & DevOps Learning",
    description:
      "Practical cloud and DevOps learning for teams building their first reliable delivery workflows.",
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
