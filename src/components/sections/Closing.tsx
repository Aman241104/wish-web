"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Sparkles, Gift, Share2, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Decoration {
  id: number;
  top: string;
  left: string;
  size: number;
  rotate: number;
}

export default function Closing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showFinal, setShowFinal] = useState(false);
  const [decorations, setDecorations] = useState<Decoration[]>([]);

  useEffect(() => {
    // Generate stable decorative elements
    const newDecorations: Decoration[] = [...Array(10)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 20,
      rotate: Math.random() * 360,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDecorations(newDecorations);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      });

      tl.from(".closing-heading-line", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      })
      .from(".closing-subtitle", {
        filter: "blur(10px)",
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.6")
      .from(".closing-action-area", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.4")
      .from(".closing-bottom-text", {
        opacity: 0,
        duration: 1,
      }, "-=0.4");

      // Continuous floating for background elements
      newDecorations.forEach((_, i) => {
        gsap.to(`.closing-deco-${i}`, {
          y: "random(-40, 40)",
          x: "random(-30, 30)",
          rotation: "+=30",
          duration: "random(4, 7)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });

      // Subtle card floating animation
      gsap.to(".message-card", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [decorations.length]);

  const handleLastThing = () => {
    setShowFinal(true);
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.8 },
      colors: ["#FFD1DC", "#E6E6FA", "#AEC6CF", "#FFD700"]
    });

    gsap.fromTo(".final-message-box", 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" }
    );
  };

  const handleShare = () => {
    const text = "Check out this birthday surprise for Diya & Drashti! 💖";
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({ title: 'Birthday Surprise', text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert("Link copied to clipboard! 🎀");
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative py-24 md:py-48 px-6 bg-gradient-to-b from-white to-[#FFFBFA] overflow-hidden flex flex-col items-center min-h-[100dvh] text-center"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {decorations.map((deco, i) => (
          <div
            key={deco.id}
            className={cn(`closing-deco-${i} absolute opacity-[0.1] text-pink-300`)}
            style={{ top: deco.top, left: deco.left, transform: `rotate(${deco.rotate}deg)` }}
          >
            {i % 2 === 0 ? <Heart size={deco.size} fill="currentColor" /> : <Sparkles size={deco.size} />}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl w-full space-y-20 my-auto">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="closing-heading-line text-4xl sm:text-5xl md:text-9xl font-black text-[#333] tracking-tighter leading-none">
              That&apos;s all,
            </h2>
            <h2 className="closing-heading-line text-4xl sm:text-5xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 tracking-tighter leading-none py-2">
              folks!
            </h2>
          </div>
          
          <p className="closing-subtitle text-xl md:text-3xl text-foreground/30 font-medium italic tracking-tight">
            &quot;Better late than never... right? 😅&quot;
          </p>
          </div>

          {/* Message Card Area */}
          <div className="closing-action-area flex justify-center pt-8">
          {!showFinal ? (
            <button
              onClick={handleLastThing}
              className="group relative inline-flex items-center gap-4 bg-pink-pastel text-white font-black text-2xl px-12 py-6 rounded-full shadow-[0_20px_60px_rgba(255,209,220,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden border-4 border-white/30"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              <span>One last thing...</span>
              <Gift size={32} className="group-hover:rotate-12 transition-transform" />
            </button>
          ) : (
            <div
              ref={cardRef}
              className="final-message-box message-card relative bg-white/90 backdrop-blur-xl p-8 md:p-16 rounded-[40px] md:rounded-[60px] shadow-[30px_30px_80px_rgba(0,0,0,0.05),-10px_-10px_60px_rgba(255,255,255,0.8)] border-4 md:border-[12px] border-white inline-block max-w-2xl"
            >
              <div className="absolute -top-4 -left-4 text-pink-200 opacity-40 -rotate-12">
                <Sparkles size={48} />
              </div>

              <p className="text-3xl md:text-5xl font-black text-pink-500 leading-tight tracking-tight">
                You both are literally <br className="hidden md:block" /> my favorite part of everything.
              </p>

              <p className="mt-8 text-2xl md:text-3xl font-bold text-[#333] opacity-80">
                Happy Birthday, <br /> you <span className="text-purple-400">absolute legends!</span> 🎂✨
              </p>              
              <div className="mt-12 flex justify-center gap-6">
                <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-400 shadow-inner">
                  <Heart size={24} fill="currentColor" />
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-400 shadow-inner">
                  <PartyPopper size={24} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Area */}
        <div className="closing-bottom-text pt-24 space-y-12">
          <button 
            onClick={handleShare}
            className="group inline-flex items-center gap-3 text-pink-400 font-black uppercase text-xs tracking-[0.4em] hover:text-pink-600 transition-colors"
          >
            <Share2 size={16} className="group-hover:scale-125 transition-transform duration-300" />
            <span>Share the love</span>
          </button>

          <div className="text-[10px] font-black text-foreground/10 uppercase tracking-[0.8em]">
            Catch you later! 👋✨
          </div>
        </div>
      </div>
    </section>
  );
}
