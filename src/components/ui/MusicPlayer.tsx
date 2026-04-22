"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/hooks/useSound";

export default function MusicPlayer() {
  const { isMuted, toggleMute } = useSound();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleMute}
        className="bg-white/80 backdrop-blur-md p-4 rounded-full shadow-2xl border-4 border-white text-pink-pastel hover:scale-110 transition-transform active:scale-95 group"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {!isMuted ? (
          <div className="relative">
            <Volume2 size={24} />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
            </span>
          </div>
        ) : (
          <VolumeX size={24} />
        )}
      </button>
    </div>
  );
}
