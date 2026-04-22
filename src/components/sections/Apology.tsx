"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Sparkles, Star, Send, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Decoration {
  id: number;
  top: string;
  left: string;
  size: number;
  type: 'heart' | 'sparkle' | 'star' | 'plane';
  rotate: number;
}

export default function Apology() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [decorations, setDecorations] = useState<Decoration[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Generate stable decorative background elements
    const newDecorations: Decoration[] = [...Array(10)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 20,
      type: i % 4 === 0 ? 'heart' : i % 4 === 1 ? 'sparkle' : i % 4 === 2 ? 'star' : 'plane',
      rotate: Math.random() * 360,
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

      tl.from(cardRef.current, {
        y: 100,
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
        ease: "power4.out"
      })
      .from(".apology-icon", {
        scale: 0,
        rotate: -180,
        duration: 0.8,
        ease: "back.out(2)"
      }, "-=0.6")
      .from(".apology-title", {
        y: 20,
        opacity: 0,
        duration: 0.8
      }, "-=0.4")
      .from(".apology-subtitle", {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.6")
      .from(".apology-content-box", {
        y: 30,
        opacity: 0,
        duration: 0.8
      }, "-=0.4")
      .from(".apology-button", {
        y: 20,
        opacity: 0,
        duration: 0.8
      }, "-=0.4");

      // Floating loop for decorations
      newDecorations.forEach((_, i) => {
        gsap.to(`.apology-deco-${i}`, {
          y: "random(-30, 30)",
          x: "random(-30, 30)",
          rotation: "+=20",
          duration: "random(3, 5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });

      // Icon pulse
      gsap.to(".apology-icon", {
        y: -10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, [decorations.length]);

  const scrollToTwins = () => {
    const twinsSection = document.getElementById('twins-section');
    if (twinsSection) {
      twinsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative py-24 md:py-32 px-6 bg-[#FFFBFA] flex justify-center overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-100/30 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Decorative elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {decorations.map((deco, i) => (
          <div
            key={deco.id}
            className={cn(`apology-deco-${i} absolute opacity-20 text-pink-300`)}
            style={{ top: deco.top, left: deco.left, transform: `rotate(${deco.rotate}deg)` }}
          >
            {deco.type === 'heart' && <Heart size={deco.size} fill="currentColor" />}
            {deco.type === 'sparkle' && <Sparkles size={deco.size} />}
            {deco.type === 'star' && <Star size={deco.size} fill="currentColor" />}
            {deco.type === 'plane' && <Send size={deco.size} className="-rotate-45" />}
          </div>
        ))}
      </div>

      <div 
        ref={cardRef}
        className="relative z-10 max-w-3xl w-full glass p-6 md:p-16 rounded-[30px] md:rounded-[60px] shadow-[0_40px_100px_rgba(255,209,220,0.4)] border-4 md:border-[12px] border-white text-center space-y-8 md:space-y-10"
      >
        {/* Gradient Border Glow */}
        <div className="absolute inset-[-6px] rounded-[24px] md:rounded-[54px] border-2 border-transparent bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 opacity-30 pointer-events-none"></div>

        {/* Top Icon */}
        <div className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 apology-icon">
          <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-pink-50 overflow-hidden group">
            <div className="absolute inset-0 bg-pink-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-4xl md:text-5xl relative z-10">🤡</span>
            {/* Sparkles around icon */}
            <Sparkles className="absolute top-2 right-2 text-pink-300 animate-pulse" size={16} />
          </div>
        </div>

        <div className="space-y-4 md:space-y-6 pt-4">
          <h2 className="apology-title text-3xl md:text-6xl font-black tracking-tighter">
            <span className="text-foreground">Okay, </span>
            <span className="text-gradient">I messed up... 🤡</span>
          </h2>
          
          <div className="apology-subtitle relative inline-block">
            <p className="font-handwriting text-xl md:text-4xl text-pink-500 italic px-4">
              &quot;But I made this instead, so we&apos;re even, right?&quot;
            </p>
            {/* Scribble SVG */}
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-pink-200/60" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="apology-content-box bg-pink-light/30 backdrop-blur-sm p-6 md:p-12 rounded-[24px] md:rounded-[40px] border-4 border-white shadow-inner space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/canvas-paper.png')]"></div>
          
          <p className="text-base md:text-xl text-foreground/70 leading-relaxed font-bold">
            I could give you a million excuses about why this is late, but the truth is... <br />
            I&apos;m just <span className="text-pink-500">terrible at calendars</span>.
          </p>

          <div className="flex justify-center items-center gap-4 text-pink-200">
            <div className="h-[1px] w-12 bg-current"></div>
            <Heart size={16} fill="currentColor" />
            <div className="h-[1px] w-12 bg-current"></div>
          </div>

          <p className="text-base md:text-xl text-foreground/70 leading-relaxed font-bold">
            But hey, a birthday is just 24 hours—this website lasts until the <span className="text-purple-500">hosting bill</span> stops getting paid!
          </p>
          
          <p className="text-base md:text-xl text-foreground/70 leading-relaxed font-bold">
            You two make life way more fun than it should be, and you deserve a wish that&apos;s a bit <span className="text-pink-500">more than</span> just a WhatsApp text. ❤️
          </p>
        </div>

        <div className="pt-2 md:pt-4 space-y-6">
          <button
            onClick={scrollToTwins}
            className="apology-button group relative inline-flex items-center gap-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-black text-xl md:text-2xl px-8 py-4 md:px-12 md:py-6 rounded-full shadow-[0_20px_50px_rgba(255,105,180,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 border-4 border-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            <Heart size={28} className="fill-current group-hover:animate-ping" />
            <span>Let&apos;s make up for it</span>
          </button>
          
          <div className="flex flex-col items-center gap-2 text-foreground/30 font-black uppercase text-[10px] tracking-[0.4em] animate-pulse">
            <p>P.S. Get ready for some surprises! ✨</p>
            <MousePointer2 size={14} />
          </div>
        </div>
      </div>
    </section>
  );
}
