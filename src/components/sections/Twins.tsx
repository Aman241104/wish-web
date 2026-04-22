"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { TWIN_DATA } from "@/constants";

gsap.registerPlugin(ScrollTrigger);

interface Decoration {
  id: number;
  top: string;
  left: string;
  size: number;
  rotate: number;
  duration: number;
}

interface TwinData {
  name: string;
  nickname: string;
  traits: string[];
  personality: string;
  color: string;
  lightColor: string;
  accent: string;
  message: string;
}

const TwinCard = ({ data }: { data: TwinData }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      card.addEventListener("mouseenter", () => {
        gsap.to(".twin-name-text", { x: 10, duration: 0.4, ease: "back.out(2)" });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(".twin-name-text", { x: 0, duration: 0.4, ease: "power2.inOut" });
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={cardRef}
      className={cn(
        "twin-card relative p-12 md:p-24 rounded-[40px] md:rounded-[80px] shadow-[0_30px_80px_rgba(0,0,0,0.05)] transition-all duration-700 hover:-translate-y-4 border-4 md:border-[12px] border-white overflow-hidden flex flex-col items-center justify-center text-center",
        data.lightColor
      )}
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] pointer-events-none"></div>
      
      <div className="relative z-10 space-y-8 md:space-y-12">
        <div className="space-y-1">
          <h3 className={cn("twin-name-text text-5xl md:text-9xl font-black italic tracking-tighter leading-none", data.accent)}>
            {data.name}
          </h3>
        </div>

        <p className="text-xl md:text-3xl leading-relaxed text-foreground/70 font-bold italic max-w-2xl mx-auto">
          &quot;{data.message}&quot;
        </p>
      </div>
    </div>
  );
};

export default function Twins() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [decorations, setDecorations] = useState<Decoration[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Generate stable decorative elements
    const newDecorations: Decoration[] = [...Array(10)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 20,
      rotate: Math.random() * 360,
      duration: Math.random() * 3 + 3,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDecorations(newDecorations);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      });

      // Header Entrance
      tl.from(".twins-tag", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .from(".twins-title", {
        y: 40,
        opacity: 0,
        letterSpacing: "0.2em",
        duration: 1.2,
        ease: "power4.out"
      }, "-=0.4")
      .from(".twins-subtitle", {
        filter: "blur(10px)",
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.6")
      .from(".twin-cards-container", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.4");

      // Floating animations
      newDecorations.forEach((_, i) => {
        gsap.to(`.twins-deco-${i}`, {
          y: "random(-40, 40)",
          x: "random(-30, 30)",
          rotation: "+=45",
          duration: "random(4, 6)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });

      // Mouse parallax for background
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5);
        const yPos = (clientY / window.innerHeight - 0.5);

        gsap.to(".twins-parallax", {
          x: xPos * 40,
          y: yPos * 40,
          duration: 1.5,
          ease: "power2.out",
          stagger: 0.02
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, [decorations.length]);

  return (
    <section 
      id="twins-section"
      ref={containerRef}
      className="relative min-h-[100dvh] py-20 md:py-40 px-6 md:px-12 bg-gradient-to-b from-[#FFFBFA] to-white overflow-hidden flex flex-col items-center"
    >
      {/* Background Layer: Dotted Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
      
      {/* Background Layer: Soft Radial Glows */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-100/40 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10 pointer-events-none twins-parallax">
        {decorations.map((deco, i) => (
          <div
            key={deco.id}
            className={`twins-deco-${i} absolute opacity-[0.15] text-pink-300`}
            style={{ top: deco.top, left: deco.left, transform: `rotate(${deco.rotate}deg)` }}
          >
            {i % 2 === 0 ? <Heart size={deco.size} fill="currentColor" /> : <Sparkles size={deco.size} />}
          </div>
        ))}
      </div>

      <div className="relative z-20 max-w-7xl w-full space-y-16 md:space-y-32">
        <div className="twins-header flex flex-col items-center text-center space-y-6 md:space-y-8">
          <div className="twins-tag bg-pink-light/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm border border-white inline-block">
            <span className="text-pink-600 text-[10px] font-black uppercase tracking-[0.5em]">Beautiful Duo</span>
          </div>
          
          <h2 className="twins-title text-5xl md:text-9xl font-black text-[#333] tracking-tighter leading-none drop-shadow-sm">
            The Twins
          </h2>
          
          <p className="twins-subtitle text-lg md:text-3xl text-foreground/40 max-w-3xl font-medium italic leading-snug px-4">
            &quot;Double the giggles, double the grins, <br className="hidden md:block" /> and double the trouble when you have twins!&quot;
          </p>
        </div>

        <div className="twin-cards-container grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          <TwinCard data={TWIN_DATA.diya as TwinData} />
          <TwinCard data={TWIN_DATA.drashti as TwinData} />
        </div>
      </div>
      
      {/* Extra bottom decoration */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-50/30 blur-[120px] rounded-full pointer-events-none"></div>
    </section>
  );
}
