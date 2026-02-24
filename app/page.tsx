import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Steps from "@/components/landing/Steps";
import Pricing from "@/components/landing/Pricing";
import WaitingList from "@/components/landing/WaitingList";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import { siteConfig } from "@/lib/config";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Steps />
      {siteConfig.waitingList.enabled ? <WaitingList /> : <Pricing />}
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
