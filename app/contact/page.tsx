import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { trainingTracks } from "@/lib/training";

export const metadata: Metadata = {
  title: "Contact CloudViva",
  description: "Ask about CloudViva cloud and DevOps training cohorts, tools, or engineering support.",
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { service, course } = await searchParams;
  const initialService = Array.isArray(service) ? service[0] : service;
  const selectedCourse = Array.isArray(course) ? course[0] : course;
  const initialCourse = trainingTracks.find((track) => track.id === selectedCourse)?.title;

  return (
    <div className="site-page flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 pt-32 pb-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>Project enquiry</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-[var(--text)]">Tell us what you want to learn or build.</h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed" style={{ color: "var(--muted)" }}>
              Ask about a training cohort, a cloud learning path, or hands-on support. We’ll reply with the relevant next steps.
            </p>
            <div className="page-illustration page-illustration--wide mt-8">
              <Image src="/illustrations/contact-cloudviva.png" alt="Illustration of a message connected to CloudViva" fill priority sizes="(max-width: 1024px) 100vw, 38vw" />
            </div>
            <div className="mt-10 border-t pt-5" style={{ borderColor: "var(--border)" }}>
              <p className="max-w-md text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                Don’t include credentials, API keys, Terraform state, or confidential configuration in this form.
              </p>
            </div>
          </div>
          <ContactForm initialService={initialService} initialCourse={initialCourse} />
        </div>
      </main>
      <Footer />
    </div>
  );
}