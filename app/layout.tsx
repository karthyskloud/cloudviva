import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CloudViva — DevSecOps Intelligence",
  description: "AI-powered Terraform Plan Explainer and DevSecOps Score. Understand your infrastructure before it breaks you.",
  keywords: ["DevSecOps", "Terraform", "Kubernetes", "Security", "DevOps", "AI"],
  openGraph: {
    title: "CloudViva — DevSecOps Intelligence",
    description: "AI-powered tools for DevOps engineers. Explain Terraform plans. Score your repo's security posture.",
    url: "https://cloudviva.com.au",
    siteName: "CloudViva",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  );
}
