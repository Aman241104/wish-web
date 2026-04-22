"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Sparkle, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { FUTURE_ADVENTURES } from "@/constants";

gsap.registerPlugin(ScrollTrigger);

interface Decoration {
  id: number;
  top: string;
  left: string;
  size: number;
  rotate: number;
  duration: number;
}

export default function Adventures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [decorations, setDecorations] = useState<Decoration[]>([]);

  useEffect(() => {
    // Generate stable decorative elements
    const newDecorations: Decoration[] = [...Array(12)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 15,
      rotate: Math.random() * 360,
      duration: Math.random() * 4 + 4,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDecorations(newDecorations);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const ctx = gsap.context(() => {
      // Header Entrance
      gsap.from(".adventure-icon-box", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
        scale: 0,
        rotate: -180,
        duration: 1,
        ease: "back.out(1.7)",
      });

      gsap.from(".adventure-header-content > *", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Card Entrance
      gsap.from(".adventure-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        opacity: 0,
        scale: 0.9,
        y: 60,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
      });

      // Floating decorations loop
      newDecorations.forEach((_, i) => {
        gsap.to(`.adventure-deco-${i}`, {
          y: "random(-40, 40)",
          x: "random(-30, 30)",
          rotation: "+=45",
          duration: "random(4, 7)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
    }, containerRef);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [decorations.length]);

  return (
    <section 
      ref={containerRef}
      className="relative py-40 px-6 md:px-12 bg-[#FFFBFA] overflow-hidden flex flex-col items-center min-h-screen justify-center"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      <div className="absolute inset-0 z-10 pointer-events-none">
        {decorations.map((deco, i) => (
          <div
            key={deco.id}
            className={cn(`adventure-deco-${i} absolute opacity-[0.1] text-pink-300`)}
            style={{ top: deco.top, left: deco.left, transform: `rotate(${deco.rotate}deg)` }}
          >
            {i % 2 === 0 ? <Heart size={deco.size} fill="currentColor" /> : <Sparkles size={deco.size} />}
          </div>
        ))}
      </div>

      <div className="relative z-20 max-w-7xl w-full space-y-24">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="adventure-icon-box bg-white p-6 rounded-[30px] shadow-xl text-pink-pastel border-4 border-pink-50 relative">
            <Compass size={48} />
            <div className="absolute -top-2 -right-2 bg-pink-100 p-1.5 rounded-full text-pink-500 animate-pulse">
              <Sparkle size={16} fill="currentColor" />
            </div>
          </div>
          
          <div className="adventure-header-content space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-9xl font-black text-[#333] tracking-tighter leading-none drop-shadow-sm italic">
              Adventures
            </h2>
            <p className="text-xl md:text-2xl text-foreground/40 max-w-2xl font-medium italic leading-relaxed px-4">
              &quot;The best parts of our story are the ones we haven&apos;t written yet.&quot;
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 pt-16">
          {FUTURE_ADVENTURES.map((adventure) => (
            <div
              key={adventure.id}
              className="adventure-card group relative bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-[40px] shadow-[20px_20px_60px_rgba(0,0,0,0.02)] border-4 border-white transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:bg-white"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-2xl font-black text-[#333] tracking-tight group-hover:text-pink-500 transition-colors">
                  {adventure.title}
                </h3>
                <p className="text-foreground/50 font-medium leading-relaxed italic">
                  {adventure.description}
                </p>
              </div>
              <div className="absolute -bottom-1 left-12 right-12 h-1.5 bg-pink-200 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
