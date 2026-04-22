"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Camera, Sparkle, X, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MEMORIES } from "@/constants";

gsap.registerPlugin(ScrollTrigger);

interface Decoration {
  id: number;
  top: string;
  left: string;
  size: number;
  rotate: number;
  duration: number;
}

export default function Scrapbook() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCaption, setSelectedCaption] = useState<string | null>(null);
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
      gsap.from(".scrapbook-icon-box", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
        scale: 0,
        rotate: -180,
        duration: 1,
        ease: "back.out(1.7)",
      });

      gsap.from(".scrapbook-header-content > *", {
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

      // Polaroid Entrance
      gsap.from(".polaroid", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        opacity: 0,
        scale: 0.5,
        y: 100,
        rotation: "random(-20, 20)",
        stagger: 0.15,
        duration: 1.2,
        ease: "back.out(1.2)",
      });

      // Floating decorations loop
      newDecorations.forEach((_, i) => {
        gsap.to(`.scrapbook-deco-${i}`, {
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

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedImage]);

  const openLightbox = (image: string, caption: string) => {
    setSelectedImage(image);
    setSelectedCaption(caption);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setSelectedCaption(null);
  };

  return (
    <section 
      ref={containerRef}
      className="relative py-40 px-6 md:px-12 bg-[#FFFBFA] overflow-hidden flex flex-col items-center"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      <div className="absolute inset-0 z-10 pointer-events-none">
        {decorations.map((deco, i) => (
          <div
            key={deco.id}
            className={cn(`scrapbook-deco-${i} absolute opacity-[0.1] text-pink-300`)}
            style={{ top: deco.top, left: deco.left, transform: `rotate(${deco.rotate}deg)` }}
          >
            {i % 2 === 0 ? <Heart size={deco.size} fill="currentColor" /> : <Sparkles size={deco.size} />}
          </div>
        ))}
      </div>

      <div className="relative z-20 max-w-7xl w-full space-y-24">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="scrapbook-icon-box bg-white p-6 rounded-[30px] shadow-xl text-pink-pastel border-4 border-pink-50 relative">
            <Camera size={48} />
            <div className="absolute -top-2 -right-2 bg-pink-100 p-1.5 rounded-full text-pink-500 animate-pulse">
              <Sparkle size={16} fill="currentColor" />
            </div>
          </div>
          
          <div className="scrapbook-header-content space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-9xl font-black text-[#333] tracking-tighter leading-none drop-shadow-sm italic">
              Memories
            </h2>
            <p className="text-xl md:text-2xl text-foreground/40 max-w-2xl font-medium italic leading-relaxed px-4">
              &quot;Every picture tells a story, but ours is my favorite one.&quot;
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20 pt-16">
          {MEMORIES.map((memory, i) => (
            <div
              key={memory.id}
              onClick={() => openLightbox(memory.image, memory.caption)}
              className={cn(
                "polaroid group relative bg-white p-4 pb-16 md:p-6 md:pb-20 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-700 hover:z-30 hover:scale-110 hover:-translate-y-10 cursor-pointer border-x-4 md:border-x-[12px] border-t-4 md:border-t-[12px] border-white",
                "after:absolute after:inset-0 after:shadow-[0_0_30px_rgba(255,209,220,0.2)] after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:rounded-none"
              )}
              style={{ transform: `rotate(${i % 2 === 0 ? -4 - (i % 3) : 4 + (i % 3)}deg)` }}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-sm">
                <Image
                  src={memory.image}
                  alt={memory.caption}
                  fill
                  className="object-cover transition-all duration-1000 group-hover:scale-125 group-hover:rotate-2"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-pink-pastel/5 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="mt-10 text-center">
                <p className="font-handwriting text-2xl text-foreground/80 font-black tracking-tight group-hover:text-pink-500 transition-colors px-2 leading-tight">
                  {memory.caption}
                </p>
              </div>

              {/* Tape effect */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/40 backdrop-blur-md -rotate-3 shadow-sm flex items-center justify-center border border-white/40">
                <Sparkle size={14} className="text-pink-pastel/40" />
              </div>
              
              {/* Subtle paper texture overlay */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/canvas-paper.png')] opacity-5 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10"
          style={{ backgroundColor: "rgba(255, 251, 250, 0.95)", backdropFilter: "blur(10px)" }}
        >
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-4 bg-white rounded-full shadow-xl text-pink-500 hover:scale-110 active:scale-95 transition-transform z-10"
          >
            <X size={32} />
          </button>

          <div className="max-w-5xl w-full h-full flex flex-col items-center justify-center gap-8">
            <div className="relative w-full h-[70vh] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white bg-white">
              <Image
                src={selectedImage}
                alt="Memory Large"
                fill
                className="object-contain md:object-cover"
                priority
              />
            </div>
            {selectedCaption && (
              <p className="font-handwriting text-3xl md:text-5xl text-pink-600 font-black text-center drop-shadow-sm max-w-3xl">
                &quot;{selectedCaption}&quot;
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
