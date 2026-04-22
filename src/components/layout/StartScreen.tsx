"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Heart, MousePointer2, Sparkles, Star, Gift } from "lucide-react";
import confetti from "canvas-confetti";

interface Decoration {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  type: 'heart' | 'sparkle' | 'star';
}

export default function StartScreen({ onStart }: { onStart: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [decorations, setDecorations] = useState<Decoration[]>([]);

  useEffect(() => {
    // Generate stable decorative background elements
    const newDecorations: Decoration[] = [...Array(12)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 15,
      duration: Math.random() * 3 + 3,
      delay: Math.random() * 2,
      type: i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'sparkle' : 'star',
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDecorations(newDecorations);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Reset states for entry
      gsap.set(".start-title-word", { y: 40, opacity: 0 });
      gsap.set(".start-subtitle", { filter: "blur(10px)", opacity: 0, y: 10 });
      gsap.set(".start-heart-container", { scale: 0, opacity: 0 });
      gsap.set(".start-button-container", { y: 20, opacity: 0 });
      gsap.set(".start-footer-item", { opacity: 0, y: 10 });

      tl.to(".start-heart-container", {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "back.out(1.7)",
      })
      .to(".start-title-word", {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
      }, "-=0.8")
      .to(".start-subtitle", {
        filter: "blur(0px)",
        opacity: 1,
        y: 0,
        duration: 1.2,
      }, "-=0.5")
      .to(".start-button-container", {
        y: 0,
        opacity: 1,
        duration: 1,
      }, "-=0.8")
      .to(".start-footer-item", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
      }, "-=0.5");

      // Floating animations for decorations
      newDecorations.forEach((_, i) => {
        gsap.to(`.deco-item-${i}`, {
          y: "random(-40, 40)",
          x: "random(-40, 40)",
          rotation: "random(-20, 20)",
          duration: "random(4, 6)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Continuous pulse for the main heart
      gsap.to(heartRef.current, {
        scale: 1.1,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Cursor parallax movement
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5);
        const yPos = (clientY / window.innerHeight - 0.5);

        gsap.to(".start-parallax-deep", {
          x: xPos * 60,
          y: yPos * 60,
          duration: 2,
          ease: "power2.out",
        });
        
        gsap.to(".start-parallax-mid", {
          x: xPos * 30,
          y: yPos * 30,
          duration: 1.5,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, [decorations.length]);

  const handleStart = () => {
    // Visual feedback burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#FFD1DC', '#E6E6FA', '#AEC6CF']
    });

    const exitTl = gsap.timeline({
      onComplete: onStart
    });

    exitTl.to(buttonRef.current, {
      scale: 0.9,
      duration: 0.1,
      ease: "power2.in"
    })
    .to(".start-content-wrapper", {
      opacity: 0,
      scale: 0.95,
      y: -20,
      duration: 0.8,
      ease: "power3.inOut"
    })
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
    }, "-=0.3");
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-[#FFFAFB] overflow-hidden"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#FFE4E1] via-[#FFF0F5] to-[#E6E6FA] opacity-70"></div>
      
      {/* Dynamic Floating Decorations */}
      <div className="absolute inset-0 z-10 pointer-events-none start-parallax-deep">
        {decorations.map((deco, i) => (
          <div
            key={deco.id}
            className={`deco-item-${i} absolute opacity-40 text-pink-400`}
            style={{ top: deco.top, left: deco.left }}
          >
            {deco.type === 'heart' && <Heart size={deco.size} fill="currentColor" />}
            {deco.type === 'sparkle' && <Sparkles size={deco.size} />}
            {deco.type === 'star' && <Star size={deco.size} fill="currentColor" />}
          </div>
        ))}
      </div>

      {/* Cloud-like blurred blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none start-parallax-mid">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white blur-[120px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-200 blur-[120px] rounded-full opacity-40" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="start-content-wrapper relative z-20 text-center space-y-6 md:space-y-12 px-6 max-w-4xl w-full">
        {/* Main Heart Illustration */}
        <div className="start-heart-container relative inline-block">
          <div className="absolute inset-0 bg-pink-400 blur-3xl opacity-30 scale-150 rounded-full animate-pulse"></div>
          <div ref={heartRef} className="relative z-10 drop-shadow-[0_15px_35px_rgba(255,105,180,0.5)]">
            <Heart 
              className="text-pink-600 w-[120px] h-[120px] md:w-[160px] md:h-[160px]" 
              fill="url(#heartGradientStart)" 
            />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="heartGradientStart" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B8B" />
                  <stop offset="100%" stopColor="#FF9BAE" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute -top-4 -right-4 animate-bounce">
              <Sparkles className="text-pink-400" size={32} />
            </div>
          </div>
        </div>
        
        {/* Animated Greeting */}
        <div className="space-y-4">
          <p className="text-pink-600 font-handwriting text-2xl md:text-3xl font-black animate-pulse drop-shadow-sm">Hey Twins! 👋💕</p>
          <h1 className="text-5xl md:text-9xl font-black text-slate-900 tracking-tighter leading-none flex flex-wrap justify-center gap-x-4">
            <span className="start-title-word block">Hi</span>
            <span className="start-title-word block text-pink-600 drop-shadow-sm">Diya</span>
            <span className="start-title-word block">&</span>
            <span className="start-title-word block text-[#9370DB] drop-shadow-sm">Drashti!</span>
          </h1>
          <div className="start-subtitle space-y-2">
            <p className="text-2xl md:text-4xl text-slate-800 font-black italic tracking-tight drop-shadow-sm">
              Made a little something for you... ✨
            </p>
            <p className="text-lg md:text-xl text-slate-500 font-black uppercase tracking-[0.5em]">Ready for it?</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="start-button-container pt-4 md:pt-10 relative group">
          <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
          <button
            ref={buttonRef}
            onClick={handleStart}
            className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-pink-600 to-rose-400 text-white font-black text-2xl md:text-3xl px-14 py-7 rounded-full shadow-[0_20px_50px_rgba(225,29,72,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 border-4 border-white overflow-hidden uppercase tracking-widest"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            <span>Show Me! ✨</span>
            <Gift size={32} className="group-hover:rotate-12 transition-transform duration-300" />
          </button>
          
          <div className="mt-8 flex flex-col items-center gap-2 text-slate-400 font-black uppercase text-xs tracking-[0.4em] animate-bounce">
            <MousePointer2 size={20} />
            <span>Click to start the chaos</span>
          </div>
        </div>

        {/* Glassmorphism Info Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 md:pt-12 px-4 md:px-0">
          {[
            { icon: Heart, label: "Made by Me", val: "With Love" },
            { icon: Sparkles, label: "Just for", val: "The Twins" },
            { icon: Gift, label: "Get ready for", val: "High Vibes Only" },
          ].map((item, i) => (
            <div 
              key={i} 
              className="start-footer-item bg-white/95 p-6 rounded-[35px] flex flex-col items-center justify-center gap-4 border-4 border-pink-50 shadow-xl hover:border-pink-200 transition-all group"
            >
              <div className="bg-pink-50 p-3 rounded-full shadow-inner text-pink-600 group-hover:scale-110 transition-transform">
                <item.icon size={24} />
              </div>
              <div className="text-center">
                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-black mb-1">{item.label}</p>
                <p className="text-base font-black text-pink-700">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
