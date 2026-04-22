"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSFX: (soundName: 'click' | 'pop' | 'confetti' | 'scratch') => void;
  startBackgroundMusic: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  
  // URLs for sound effects (using reliable public assets)
  const sounds = {
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    pop: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', 
    confetti: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
    scratch: 'https://assets.mixkit.co/active_storage/sfx/2592/2592-preview.mp3',
  };

  useEffect(() => {
    bgMusicRef.current = new Audio("https://www.bensound.com/bensound-music/bensound-love.mp3");
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.4;

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = !isMuted;
    }
  };

  const playSFX = (soundName: keyof typeof sounds) => {
    if (isMuted) return;
    const audio = new Audio(sounds[soundName]);
    audio.volume = 0.5;
    audio.play().catch(() => {}); // Ignore autoplay errors
  };

  const startBackgroundMusic = () => {
    if (bgMusicRef.current && !isMuted) {
      bgMusicRef.current.play().catch(e => console.log("Music play failed:", e));
    }
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playSFX, startBackgroundMusic }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSound must be used within a SoundProvider");
  return context;
};
