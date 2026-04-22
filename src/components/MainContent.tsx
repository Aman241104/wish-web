"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "@/components/sections/Hero";
import Apology from "@/components/sections/Apology";
import Twins from "@/components/sections/Twins";
import LateTimer from "@/components/sections/LateTimer";
import ScratchCardSection from "@/components/sections/ScratchCardSection";
import Scrapbook from "@/components/sections/Scrapbook";
import Closing from "@/components/sections/Closing";
import FloatingHearts from "@/components/ui/FloatingHearts";

gsap.registerPlugin(ScrollTrigger);

export default function MainContent() {
  useEffect(() => {
    // Aggressive refresh to ensure all GSAP triggers are correctly placed
    const refreshGSAP = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", refreshGSAP);
    const timer = setTimeout(refreshGSAP, 1500);

    return () => {
      window.removeEventListener("load", refreshGSAP);
      clearTimeout(timer);
    };
  }, []);

  return (
    <main className="relative bg-white w-full overflow-x-hidden">
      <FloatingHearts />
      <Hero />
      <Apology />
      <Twins />
      <LateTimer />
      <ScratchCardSection />
      <Scrapbook />
      <Closing />
    </main>
  );
}
