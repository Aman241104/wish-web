"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Heart, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { PASSWORD } from "@/constants";

import confetti from "canvas-confetti";

interface PasswordGateProps {
  onSuccess: () => void;
}

interface HeartInfo {
  id: number;
  size: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
}

export default function PasswordGate({ onSuccess }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hearts, setHearts] = useState<HeartInfo[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setIsUnlocked(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD1DC', '#E6E6FA', '#AEC6CF']
      });

      const tl = gsap.timeline({
        onComplete: onSuccess,
      });

      tl.to(".lock-icon", {
        scale: 0,
        rotate: 90,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(2)",
      })
      .fromTo(".unlock-icon", {
        scale: 0,
        rotate: -90,
        opacity: 0,
      }, {
        scale: 1,
        rotate: 0,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(2)",
      })
      .to(cardRef.current, {
        y: -20,
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        delay: 0.2,
        ease: "power3.inOut",
      })
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
      }, "-=0.3");
    } else {
      setError(true);
      const tl = gsap.timeline();
      tl.to(cardRef.current, {
        x: -10,
        duration: 0.1,
      })
      .to(cardRef.current, {
        x: 10,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
      })
      .to(cardRef.current, {
        x: 0,
        duration: 0.1,
        onComplete: () => setError(false),
      });
      setPassword("");
    }
  };

  useEffect(() => {
    const newHearts = [...Array(12)].map((_, i) => ({
      id: i,
      size: Math.random() * 40 + 20,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 4 + 4,
      delay: Math.random() * 5,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHearts(newHearts);

    gsap.from(".gate-content", {
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 h-[100dvh] z-50 bg-[#FFF5F7] overflow-y-auto"
    >
      {/* Background soft blobs for better contrast */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-200/50 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/40 blur-[120px] rounded-full"></div>
      </div>

      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {hearts.map((heart) => (
          <Heart
            key={heart.id}
            className="absolute text-pink-400/30"
            size={heart.size}
            style={{
              top: heart.top,
              left: heart.left,
              animation: `float ${heart.duration}s ease-in-out infinite`,
              animationDelay: `${heart.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative min-h-full flex items-center justify-center py-10 px-4 z-10">
        <div 
          ref={cardRef}
          className="gate-content bg-white p-8 md:p-14 rounded-[50px] shadow-[0_40px_100px_rgba(255,182,193,0.6)] max-w-sm w-full text-center relative border-8 border-white"
        >
          <div className="bg-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner relative overflow-hidden border-4 border-white">
            {!isUnlocked ? (
              <Lock className="lock-icon text-pink-700 drop-shadow-sm" size={40} />
            ) : (
              <Unlock className="unlock-icon text-green-600 drop-shadow-sm" size={40} />
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Special Access</h1>
          <p className="text-slate-600 font-bold mb-12 italic text-lg leading-tight">Hint: Your birthday (DDMM)</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative group">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className={cn(
                  "w-full px-6 py-6 rounded-[30px] bg-slate-100 border-4 border-slate-200 text-center text-4xl md:text-5xl font-black tracking-[0.5em] transition-all focus:outline-none focus:ring-8 focus:ring-pink-300 focus:border-pink-400 placeholder:text-slate-300 text-slate-900",
                  error ? "border-red-400 text-red-600 bg-red-50" : ""
                )}
              />
            </div>
            <button
              type="submit"
              disabled={isUnlocked}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 disabled:from-slate-300 disabled:to-slate-400 text-white font-black text-2xl py-6 rounded-[30px] shadow-[0_15px_40px_rgba(225,29,72,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer uppercase tracking-widest border-4 border-white/20"
            >
              {isUnlocked ? "Unlocking..." : "Enter ✨"}
            </button>
          </form>

          {error && (
            <div className="mt-8 p-4 bg-red-50 rounded-2xl border-2 border-red-200">
              <p className="text-red-600 font-black animate-bounce uppercase text-sm tracking-tight">
                Oops! That&apos;s not it. Try again! 🌸
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
