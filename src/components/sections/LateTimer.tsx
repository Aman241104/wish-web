"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Clock } from "lucide-react";
import { useTimer } from "@/hooks/useTimer";
import { BIRTHDAY_DATE } from "@/constants";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Decoration {
  id: number;
  top: string;
  left: string;
  size: number;
  rotate: number;
}

const TimerCard = ({ label, value }: { label: string; value: number }) => {
  const valueRef = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== prevValue.current && valueRef.current) {
      gsap.fromTo(valueRef.current, 
        { scale: 0.8, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" }
      );
      prevValue.current = value;
    }
  }, [value]);

  return (
    <div className="timer-card group relative bg-white p-6 md:p-12 rounded-[24px] md:rounded-[40px] shadow-[20px_20px_60px_#f0f0f0,-20px_-20px_60px_#ffffff] border-2 border-white flex flex-col items-center justify-center space-y-2 md:space-y-4 transition-all duration-500 hover:-translate-y-3 hover:shadow-[25px_25px_75px_#e5e5e5]">
      <div className="absolute inset-0 rounded-[24px] md:rounded-[40px] bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      <span 
        ref={valueRef}
        className="text-4xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-purple-600 tabular-nums drop-shadow-sm"
      >
        {String(value).padStart(2, '0')}
      </span>
      
      <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-pink-500 transition-colors">
        {label}
      </span>
      
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-pink-200 rounded-full scale-x-0 group-hover:scale-x-150 transition-transform duration-500"></div>
    </div>
  );
};

export default function LateTimer() {
  const timeLeft = useTimer(BIRTHDAY_DATE);
  const containerRef = useRef<HTMLDivElement>(null);
  const [decorations, setDecorations] = useState<Decoration[]>([]);

  useEffect(() => {
    // Generate stable decorative hearts
    const newDecorations: Decoration[] = [...Array(12)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 15 + 15,
      rotate: Math.random() * 360,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDecorations(newDecorations);

    const ctx = gsap.context(() => {
      // Force immediate visibility then animate to avoid "staying at opacity 0"
      gsap.set([".timer-badge", ".timer-heading-line", ".timer-subtitle", ".timer-card", ".timer-footer"], { opacity: 0, y: 30 });

      ScrollTrigger.batch([".timer-badge", ".timer-heading-line", ".timer-subtitle", ".timer-card", ".timer-footer"], {
        onEnter: (elements) => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
            overwrite: true
          });
        },
        start: "top 90%",
      });

      // Floating hearts loop
      newDecorations.forEach((_, i) => {
        gsap.to(`.timer-deco-${i}`, {
          y: "random(-30, 30)",
          x: "random(-20, 20)",
          rotation: "+=20",
          duration: "random(4, 7)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
    }, containerRef);

    // Frequent refreshes to catch dynamic layout changes
    const interval = setInterval(() => ScrollTrigger.refresh(), 2000);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, [decorations.length]);

  return (
    <section 
      ref={containerRef}
      className="relative py-32 md:py-64 px-6 bg-[#FFFAFB] overflow-hidden flex flex-col items-center justify-center min-h-screen"
    >
      {/* Background Texture & Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Soft Glow Behind Content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-100/50 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {decorations.map((deco, i) => (
          <div
            key={deco.id}
            className={cn(`timer-deco-${i} absolute opacity-[0.2] text-pink-400`)}
            style={{ top: deco.top, left: deco.left, transform: `rotate(${deco.rotate}deg)` }}
          >
            <Heart size={deco.size} fill="currentColor" />
          </div>
        ))}
      </div>

      <div className="relative z-20 max-w-6xl w-full space-y-16 md:space-y-32">
        <div className="flex flex-col items-center text-center space-y-8 md:space-y-10">
          {/* Top Badge */}
          <div className="timer-badge bg-white px-6 py-2 rounded-full shadow-lg border-2 border-pink-100 inline-block">
            <span className="text-pink-600 text-[11px] font-black uppercase tracking-[0.6em]">Late But Sincere</span>
          </div>
          
          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="timer-heading-line text-5xl md:text-9xl font-black text-slate-800 tracking-tighter leading-none drop-shadow-sm">
              Tick-Tock...
            </h2>
            <h2 className="timer-heading-line text-5xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 tracking-tighter leading-none py-2 drop-shadow-md">
              Guilty Me!
            </h2>
          </div>
          
          {/* Subtitle */}
          <p className="timer-subtitle text-lg md:text-3xl text-slate-500 max-w-3xl font-bold italic leading-relaxed px-6 drop-shadow-sm">
            &quot;This is exactly how late I am to wish you properly... <br className="hidden md:block" />
            every second is a reminder of how much you deserve this! 💖&quot;
          </p>
        </div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-16 px-4">
          <TimerCard label="Days" value={timeLeft.days} />
          <TimerCard label="Hours" value={timeLeft.hours} />
          <TimerCard label="Minutes" value={timeLeft.minutes} />
          <TimerCard label="Seconds" value={timeLeft.seconds} />
        </div>

        {/* Footer Note */}
        <div className="timer-footer flex flex-col items-center gap-3 pt-12">
          <div className="flex items-center gap-3 text-slate-400 font-black uppercase text-xs tracking-[0.6em] animate-pulse">
            <Clock size={16} />
            <span>Counting since April 15th</span>
          </div>
        </div>
      </div>
    </section>
  );
}
