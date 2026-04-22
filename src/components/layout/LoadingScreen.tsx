"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState("Preparing your surprise...");

  useEffect(() => {
    const messages = [
      "Preparing your surprise...",
      "Baking virtual cakes...",
      "Inflating digital balloons...",
      "Wrapping hidden wishes...",
      "Almost there! ✨"
    ];
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < messages.length) {
        setText(messages[currentIndex]);
      } else {
        clearInterval(interval);
      }
    }, 800);

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(".loading-screen", {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: onComplete
        });
      }
    });

    tl.from(".loading-content", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    })
    .to(".loading-bar-inner", {
      width: "100%",
      duration: 3,
      ease: "power1.inOut"
    }, "-=0.2")
    .to(".loading-content", {
      scale: 0.9,
      opacity: 0,
      duration: 0.4,
      ease: "power3.in"
    });

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="loading-screen fixed inset-0 z-[100] flex items-center justify-center bg-pink-light">
      <div className="loading-content flex flex-col items-center max-w-xs w-full px-6">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-pink-pastel/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-pink-pastel animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl animate-pulse">🎂</span>
          </div>
        </div>
        
        <p className="text-pink-600 font-bold text-lg mb-6 text-center h-8">
          {text}
        </p>
        
        <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
          <div className="loading-bar-inner w-0 h-full bg-pink-pastel shadow-[0_0_10px_rgba(255,209,220,0.8)]"></div>
        </div>
      </div>
    </div>
  );
}
