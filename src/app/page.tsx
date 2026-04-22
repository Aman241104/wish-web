"use client";

import { useEffect, useState } from "react";
import PasswordGate from "@/components/PasswordGate";
import MainContent from "@/components/MainContent";
import LoadingScreen from "@/components/layout/LoadingScreen";
import StartScreen from "@/components/layout/StartScreen";

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unlocked = localStorage.getItem("birthday_unlocked");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsUnlocked(unlocked === "true");
    }
  }, []);

  const handleSuccess = () => {
    setIsUnlocked(true);
    localStorage.setItem("birthday_unlocked", "true");
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isUnlocked === null) return null;

  return (
    <div className="min-h-screen bg-pink-light">
      {!hasStarted ? (
        <StartScreen onStart={() => setHasStarted(true)} />
      ) : isLoading ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : !isUnlocked ? (
        <PasswordGate onSuccess={handleSuccess} />
      ) : (
        <MainContent />
      )}
    </div>
  );
}
