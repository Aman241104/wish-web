"use client";

import { useRef, useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Heart, Star, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TWIN_DATA } from "@/constants";

gsap.registerPlugin(ScrollTrigger);

interface Decoration {
  id: number;
  top: string;
  left: string;
  size: number;
  type: 'heart' | 'sparkle' | 'star';
  rotate: number;
}

interface ScratchCardProps {
  name: string;
  message: string;
  accentColor: string;
  lightColor: string;
}

const ScratchCard = ({ name, message, accentColor, lightColor }: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const updateCanvasSize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
        
        // Premium Scratch Layer (Silver/Pastel Mix)
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#E0E0E0");
        gradient.addColorStop(0.5, "#F5F5F5");
        gradient.addColorStop(1, "#E0E0E0");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add Texture
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        for (let i = 0; i < 150; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Overlay Text
        ctx.font = "black 24px Inter";
        ctx.fillStyle = "#888";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`SCRATCH ${name.toUpperCase()} ✨`, canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = "bold 10px Inter";
        ctx.fillText("SCRATCH TO REVEAL", canvas.width / 2, canvas.height / 2 + 20);
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();

      // Check reveal percentage
      if (Math.random() > 0.9) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;
        for (let i = 3; i < pixels.length; i += 4) {
          if (pixels[i] === 0) transparentPixels++;
        }
        
        const percentage = (transparentPixels / (pixels.length / 4)) * 100;
        if (percentage > 45 && !isRevealed) {
          setIsRevealed(true);
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#FFD1DC", "#E6E6FA", "#AEC6CF", "#FFD700"],
            ticks: 300
          });
        }
      }
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      setIsScratching(true);
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isScratching) return;
      if (e.cancelable) e.preventDefault();
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    };

    const handleEnd = () => setIsScratching(false);

    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("touchstart", handleStart, { passive: false });
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("touchstart", handleStart);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [name, isRevealed, isScratching]);

  return (
    <div 
      ref={containerRef}
      className="scratch-card-wrapper relative w-full max-w-sm aspect-[4/3] group perspective-1000"
    >
      {/* Revealed Layer (Message) */}
      <div className={cn(
        "absolute inset-0 flex flex-col items-center justify-center p-6 md:p-10 text-center rounded-[30px] md:rounded-[50px] shadow-[inset_10px_10px_30px_rgba(0,0,0,0.05)] border-8 border-dashed transition-all duration-700",
        lightColor,
        isRevealed ? "scale-100 opacity-100" : "scale-95 opacity-50"
      )}>
        <div className="bg-white/40 backdrop-blur-sm px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">Secret Wish</div>
        <p className={cn("text-lg md:text-2xl font-bold leading-relaxed italic drop-shadow-sm px-2", accentColor)}>
          &quot;{message}&quot;
        </p>
      </div>

      {/* Scratch Layer */}
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 z-10 cursor-none rounded-[30px] md:rounded-[50px] transition-all duration-700 shadow-[20px_20px_60px_#f0f0f0,-20px_-20px_60px_#ffffff] border-8 border-white",
          isRevealed ? "opacity-0 pointer-events-none scale-105" : "opacity-100 group-hover:-translate-y-2 group-hover:shadow-[25px_25px_75px_#e5e5e5]"
        )}
      />

      {/* Helper UI */}
      {!isRevealed && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
          <div className="flex items-center gap-2 text-foreground/20 font-black uppercase text-[10px] tracking-[0.4em]">
            <MousePointer2 size={14} className="animate-pulse" />
            <span>Scratch Here</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ScratchCardSection() {
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
    const newDecorations: Decoration[] = [...Array(12)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 15,
      rotate: Math.random() * 360,
      duration: Math.random() * 4 + 4,
      type: i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'sparkle' : 'star',
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

      tl.from(".scratch-badge", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .from(".scratch-title", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
      }, "-=0.4")
      .from(".scratch-subtitle", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.6")
      .from(".scratch-card-wrapper", {
        scale: 0.9,
        opacity: 0,
        y: 60,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.2)"
      }, "-=0.4");

      // Floating loop
      newDecorations.forEach((_, i) => {
        gsap.to(`.scratch-deco-${i}`, {
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

    return () => ctx.revert();
  }, [decorations.length]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-48 px-6 bg-[#FFFBFA] overflow-hidden flex flex-col items-center justify-center min-h-screen"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        {decorations.map((deco, i) => (
          <div
            key={deco.id}
            className={cn(`scratch-deco-${i} absolute opacity-[0.1] text-pink-300`)}
            style={{ top: deco.top, left: deco.left, transform: `rotate(${deco.rotate}deg)` }}
          >
            {deco.type === 'heart' && <Heart size={deco.size} fill="currentColor" />}
            {deco.type === 'sparkle' && <Sparkles size={deco.size} />}
            {deco.type === 'star' && <Star size={deco.size} fill="currentColor" />}
          </div>
        ))}
      </div>

      <div className="relative z-20 max-w-6xl w-full space-y-16 md:space-y-24">
        <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
          <div className="scratch-badge bg-pink-light/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-md border border-white inline-block">
            <span className="text-pink-600 text-[10px] font-black uppercase tracking-[0.5em]">Interactive Wishes</span>
          </div>

          <h2 className="scratch-title text-4xl md:text-8xl font-black text-[#333] tracking-tight leading-tight">
            Hidden Messages
          </h2>          
          <p className="scratch-subtitle text-lg md:text-2xl text-foreground/40 max-w-2xl font-medium italic leading-relaxed px-4">
            &quot;A little mystery before the reveal! Scratch the surface to see what I have in my heart for you.&quot;
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 justify-items-center">
          <ScratchCard 
            name={TWIN_DATA.diya.name}
            message={TWIN_DATA.diya.scratchMessage}
            accentColor="text-pink-600"
            lightColor="bg-pink-light/30 border-pink-100"
          />
          <ScratchCard 
            name={TWIN_DATA.drashti.name}
            message={TWIN_DATA.drashti.scratchMessage}
            accentColor="text-purple-600"
            lightColor="bg-blue-light/30 border-blue-100"
          />
        </div>
      </div>
    </section>
  );
}
