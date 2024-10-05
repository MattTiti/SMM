import { Suspense } from "react";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import FeaturesAccordion from "@/components/landing/FeaturesAccordion";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import WithWithout from "@/components/landing/WithWithout";
export default function Home() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="bg-white text-black">
        <Hero />
        <Problem />
        <FeaturesAccordion />
        <WithWithout />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
