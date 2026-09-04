import React, { useEffect, useState } from 'react';
import { Zap, Sparkles, ShieldCheck, Leaf } from 'lucide-react';
import { GiFruitBowl, GiTomato, GiMilkCarton } from 'react-icons/gi';
import { FaShoppingCart } from 'react-icons/fa';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsFading(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-700 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Floating Animated Background Accents with Spotify & Duolingo Greens */}
      <div className="absolute top-1/4 left-1/6 text-[#1DB954]/30 animate-bounce text-4xl duration-1000">
        <GiFruitBowl />
      </div>
      <div className="absolute bottom-1/4 right-1/6 text-[#58CC02]/30 animate-pulse text-5xl duration-1000">
        <GiTomato />
      </div>
      <div className="absolute top-1/3 right-1/4 text-[#1DB954]/20 animate-spin text-3xl duration-1000">
        <GiMilkCarton />
      </div>
      <div className="absolute bottom-1/3 left-1/4 text-[#58CC02]/20 animate-bounce text-3xl duration-700">
        <FaShoppingCart />
      </div>

      {/* Main Animated Branding Emblem */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-6 max-w-sm">
        <div className="relative group">
          {/* Pulsing Spotify / Duolingo Glow Backdrop */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#1DB954] via-[#58CC02] to-emerald-400 opacity-75 blur-xl animate-pulse"></div>

          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900 border-2 border-[#1DB954] shadow-2xl">
            <span className="text-5xl font-black bg-gradient-to-tr from-[#1DB954] via-[#58CC02] to-emerald-300 bg-clip-text text-transparent">
              K
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white">
            KRISHI <span className="text-[#1DB954]">AGRI</span>
          </h1>
          <p className="mt-2 text-xs font-extrabold tracking-widest text-[#58CC02] uppercase flex items-center justify-center gap-1">
            <Zap className="h-3.5 w-3.5 fill-[#58CC02]" /> Seedhe Kisan Se, Seedhe Ghar Tak
          </p>
        </div>

        {/* Dynamic Animated Progress Bar */}
        <div className="w-full space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1DB954] to-[#58CC02] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
            <span>Sourcing Direct Farm Network...</span>
            <span className="font-mono text-[#1DB954]">{progress}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-1.5 text-[10px] font-extrabold text-slate-300 border border-slate-800 shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5 text-[#1DB954]" />
          Verified DoCA Escrow & Cold-Chain Network
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
