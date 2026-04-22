"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Sparkles, Heart, Star, ChevronDown } from "lucide-react";

interface FloatingElement {
  id: number;
  top: string;
  left: string;
  size: number;
  type: 'heart' | 'star' | 'sparkle';
  rotate: number;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Generate stable floating elements once on mount
    const elements: FloatingElement[] = [...Array(12)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 90 + 5}%`,
      left: `${Math.random() * 90 + 5}%`,
      size: Math.random() * 20 + 15,
      type: i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'star' : 'sparkle',
      rotate: Math.random() * 360,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFloatingElements(elements);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Immediate visual states to prevent flash of unstyled content
      gsap.set(".hero-subtitle", { filter: "blur(10px)", opacity: 0, y: 20 });
      gsap.set(".hero-names", { scale: 0.8, opacity: 0 });

      tl.from(".hero-text-line", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
      })
      .to(".hero-names", {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
      }, "-=0.6")
      .to(".hero-subtitle", {
        filter: "blur(0px)",
        opacity: 1,
        y: 0,
        duration: 1,
      }, "-=1")
      .from(".hero-decoration-main", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(2)",
      }, "-=0.5")
      .from(".scroll-indicator", {
        y: -20,
        opacity: 0,
        duration: 0.8,
      }, "-=0.2");

      // Mobile-friendly parallax effect
      const handleMouseMove = (e: MouseEvent) => {
        const xPos = (e.clientX / window.innerWidth - 0.5);
        const yPos = (e.clientY / window.innerHeight - 0.5);

        gsap.to(".parallax-bg", {
          x: xPos * 40,
          y: yPos * 40,
          duration: 1.5,
          ease: "power2.out",
        });

        gsap.to(".parallax-mid", {
          x: xPos * 20,
          y: yPos * 20,
          duration: 1,
          ease: "power2.out",
        });
      };

      if (window.innerWidth > 768) {
        window.addEventListener("mousemove", handleMouseMove);
      }

      // Continuous floating loops
      elements.forEach((_, i) => {
        gsap.to(`.float-item-${i}`, {
          y: "random(-30, 30)",
          x: "random(-20, 20)",
          rotation: "+=45",
          duration: "random(3, 5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [floatingElements.length === 0]); // Only re-run if elements haven't been generated

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center py-20 px-6 overflow-hidden bg-[#FFFBFA]"
    >
      {/* Background Layer: Animated Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="parallax-bg absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-pink-100/40 blur-[100px] rounded-full animate-pulse"></div>
        <div className="parallax-bg absolute bottom-[-5%] right-[-5%] w-[60%] h-[60%] bg-blue-100/40 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Mid Layer: Floating Icons */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {floatingElements.map((el, i) => (
          <div
            key={el.id}
            className={`float-item-${i} absolute opacity-[0.15] text-pink-300`}
            style={{ top: el.top, left: el.left }}
          >
            {el.type === 'heart' && <Heart size={el.size} fill="currentColor" />}
            {el.type === 'star' && <Star size={el.size} fill="currentColor" />}
            {el.type === 'sparkle' && <Sparkles size={el.size} />}
          </div>
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-20 space-y-8 max-w-4xl w-full">
        <div className="space-y-2">
          <h1 ref={titleRef} className="text-5xl sm:text-7xl md:text-9xl font-black text-foreground tracking-tighter leading-tight md:leading-none flex flex-col items-center">
            <span className="hero-text-line block drop-shadow-sm">Happy</span>
            <span className="hero-text-line block drop-shadow-sm">Birthday</span>
            <span className="hero-text-line hero-names block text-gradient py-2 md:py-4 scale-105">
              Diya & Drashti!
            </span>
          </h1>
        </div>
        
        <div className="parallax-mid">
          <p className="hero-subtitle text-xl md:text-4xl font-bold text-foreground/40 italic tracking-tight px-4 drop-shadow-sm leading-tight">
            &quot;I may be late... but this is worth it 💖&quot;
          </p>
        </div>

        <div className="hero-decoration-main flex justify-center gap-8 md:gap-12 mt-10 parallax-mid">
          <Heart className="text-pink-300 animate-bounce w-8 h-8 md:w-12 md:h-12" fill="currentColor" />
          <Heart className="text-lavender animate-pulse w-10 h-10 md:w-16 md:h-16" fill="currentColor" />
          <Heart className="text-blue-200 animate-bounce w-8 h-8 md:w-12 md:h-12" fill="currentColor" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>

      {/* Footer Layer: Scroll Indicator */}
      <div className="scroll-indicator absolute bottom-8 flex flex-col items-center gap-4 pointer-events-none">
        <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.6em]">Scroll for Magic</p>
        <div className="relative w-8 h-12 border-2 border-foreground/10 rounded-full flex justify-center p-2 overflow-hidden">
          <div className="w-1 h-3 bg-pink-200 rounded-full animate-bounce"></div>
          <ChevronDown className="absolute bottom-0 text-pink-200/50 animate-pulse" size={14} />
        </div>
      </div>
    </section>
  );
}
