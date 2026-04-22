"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Heart } from "lucide-react";
import { useSound } from "@/hooks/useSound";

export default function FloatingHearts() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { playSFX } = useSound();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const hearts = gsap.utils.toArray<HTMLElement>(".floating-heart-bg");
      
      hearts.forEach((heart) => {
        gsap.set(heart, {
          x: gsap.utils.random(0, window.innerWidth),
          y: gsap.utils.random(0, window.innerHeight),
          scale: gsap.utils.random(0.5, 1.5),
          opacity: gsap.utils.random(0.1, 0.3),
        });

        gsap.to(heart, {
          y: "-=100",
          x: "+=50",
          rotation: "random(-45, 45)",
          duration: "random(10, 20)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleHeartClick = (e: React.MouseEvent<SVGElement>) => {
    playSFX('pop');
    const heart = e.currentTarget;
    
    gsap.to(heart, {
      scale: 2,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(heart, {
          scale: gsap.utils.random(0.5, 1.5),
          opacity: gsap.utils.random(0.1, 0.3),
          x: gsap.utils.random(0, window.innerWidth),
          y: gsap.utils.random(0, window.innerHeight),
        });
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {[...Array(20)].map((_, i) => (
        <Heart
          key={i}
          className="floating-heart-bg absolute text-pink-pastel cursor-pointer pointer-events-auto active:scale-150 transition-transform"
          fill="currentColor"
          size={24}
          onClick={handleHeartClick}
        />
      ))}
    </div>
  );
}
