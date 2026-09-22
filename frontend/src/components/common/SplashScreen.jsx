// import React, { useEffect, useState } from 'react';
// import { Zap, ShieldCheck } from 'lucide-react';
// import { GiFruitBowl, GiTomato, GiMilkCarton } from 'react-icons/gi';
// import { FaShoppingCart } from 'react-icons/fa';

// const SplashScreen = ({ onComplete }) => {
//   const [progress, setProgress] = useState(0);
//   const [isFading, setIsFading] = useState(false);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(timer);
//           setIsFading(true);
//           setTimeout(() => {
//             if (onComplete) onComplete();
//           }, 600);
//           return 100;
//         }
//         return prev + 5;
//       });
//     }, 40);

//     return () => clearInterval(timer);
//   }, [onComplete]);

//   return (
//     <div
//       className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-700 ${
//         isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
//       }`}
//     >
//       {/* Floating Animated Background Accents with Spotify & Duolingo Greens */}
//       <div className="absolute top-1/4 left-1/6 text-[#1DB954]/30 animate-bounce text-4xl duration-1000">
//         <GiFruitBowl />
//       </div>
//       <div className="absolute bottom-1/4 right-1/6 text-[#58CC02]/30 animate-pulse text-5xl duration-1000">
//         <GiTomato />
//       </div>
//       <div className="absolute top-1/3 right-1/4 text-[#1DB954]/20 animate-spin text-3xl duration-1000">
//         <GiMilkCarton />
//       </div>
//       <div className="absolute bottom-1/3 left-1/4 text-[#58CC02]/20 animate-bounce text-3xl duration-700">
//         <FaShoppingCart />
//       </div>

//       {/* Main Animated Branding Emblem */}
//       <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-6 max-w-sm">
//         <div className="relative group">
//           {/* Pulsing Spotify / Duolingo Glow Backdrop */}
//           <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#1DB954] via-[#58CC02] to-emerald-400 opacity-75 blur-xl animate-pulse"></div>

//           <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900 border-2 border-[#1DB954] shadow-2xl">
//             <span className="text-5xl font-black bg-gradient-to-tr from-[#1DB954] via-[#58CC02] to-emerald-300 bg-clip-text text-transparent">
//               K
//             </span>
//           </div>
//         </div>

//         <div>
//           <h1 className="text-4xl font-black tracking-tighter text-white">
//             KRISHI <span className="text-[#1DB954]">AGRI</span>
//           </h1>
//           <p className="mt-2 text-xs font-extrabold tracking-widest text-[#58CC02] uppercase flex items-center justify-center gap-1">
//             <Zap className="h-3.5 w-3.5 fill-[#58CC02]" /> Seedhe Kisan Se, Seedhe Ghar Tak
//           </p>
//         </div>

//         {/* Dynamic Animated Progress Bar */}
//         <div className="w-full space-y-2">
//           <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 p-0.5 border border-slate-800">
//             <div
//               className="h-full rounded-full bg-gradient-to-r from-[#1DB954] to-[#58CC02] transition-all duration-100 ease-out"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//           <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
//             <span>Sourcing Direct Farm Network...</span>
//             <span className="font-mono text-[#1DB954]">{progress}%</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-1.5 text-[10px] font-extrabold text-slate-300 border border-slate-800 shadow-sm">
//           <ShieldCheck className="h-3.5 w-3.5 text-[#1DB954]" />
//           Verified DoCA Escrow & Cold-Chain Network
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SplashScreen;






import React, { useEffect, useState } from 'react';
import { Sprout, ShieldCheck } from 'lucide-react';
import { GiWheat, GiTomato, GiMilkCarton } from 'react-icons/gi';
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
      className={`ka-root fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@500;600;700;800&display=swap');

        .ka-root {
          background: radial-gradient(120% 90% at 50% 12%, #FBF6E9 0%, #F5EED9 45%, #EEE3C4 100%);
          background-color: #F5EED9;
        }
        .ka-furrows {
          position: absolute;
          inset: 0;
          opacity: 0.5;
          background-image: repeating-linear-gradient(
            115deg,
            rgba(62, 43, 31, 0.05) 0px,
            rgba(62, 43, 31, 0.05) 1px,
            transparent 1px,
            transparent 34px
          );
        }
        .ka-serif { font-family: 'Fraunces', serif; }
        .ka-sans { font-family: 'Manrope', sans-serif; }

        .ka-drift { animation: ka-drift 7s ease-in-out infinite; }
        .ka-drift-slow { animation: ka-drift 9s ease-in-out infinite; }
        @keyframes ka-drift {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }

        .ka-glow { animation: ka-glow 3.2s ease-in-out infinite; }
        @keyframes ka-glow {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.06); }
        }

        .ka-emblem-in { animation: ka-emblem-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes ka-emblem-in {
          from { opacity: 0; transform: scale(0.75) rotate(-6deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        .ka-rise { animation: ka-rise 0.6s ease-out both; }
        @keyframes ka-rise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ka-tabular { font-variant-numeric: tabular-nums; }
      `}</style>

      <div className="ka-furrows" />

      {/* Quiet, subtly drifting field motifs — one motion type, low opacity */}
      <div className="ka-drift absolute top-[18%] left-[14%] text-[#8A6A2F]/20 text-4xl">
        <GiWheat />
      </div>
      <div className="ka-drift-slow absolute bottom-[22%] right-[16%] text-[#C1502E]/20 text-4xl">
        <GiTomato />
      </div>
      <div className="ka-drift absolute top-[30%] right-[20%] text-[#3F6B3D]/15 text-3xl">
        <GiMilkCarton />
      </div>
      <div className="ka-drift-slow absolute bottom-[30%] left-[18%] text-[#8A6A2F]/15 text-3xl">
        <FaShoppingCart />
      </div>

      {/* Core mark */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm">
        <div className="relative mb-6">
          <div className="ka-glow absolute -inset-6 rounded-full bg-[#E3A527]/50 blur-2xl" />
          <div
            className="ka-emblem-in relative flex h-24 w-24 items-center justify-center rounded-full shadow-lg"
            style={{
              background: 'radial-gradient(circle at 32% 28%, #F3C55C 0%, #E3A527 55%, #C1502E 100%)',
            }}
          >
            <Sprout className="h-11 w-11 text-[#2E4A2C]" strokeWidth={2.25} />
          </div>
        </div>

        <h1
          className="ka-serif ka-rise text-[2.6rem] leading-none tracking-tight text-[#3E2B1F]"
          style={{ animationDelay: '0.15s' }}
        >
          Krishi <span className="text-[#C1502E]">Agri</span>
        </h1>

        <p
          className="ka-sans ka-rise mt-3 text-sm font-semibold text-[#3F6B3D]"
          style={{ animationDelay: '0.3s' }}
        >
          Seedhe Kisan Se, Seedhe Ghar Tak
        </p>

        {/* Progress */}
        <div className="ka-rise w-full mt-9" style={{ animationDelay: '0.45s' }}>
          <div className="relative h-1.5 w-full rounded-full bg-[#3E2B1F]/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #3F6B3D 0%, #E3A527 100%)',
              }}
            />
          </div>
          <div className="ka-sans mt-2.5 flex items-center justify-between text-[11px] font-medium text-[#3E2B1F]/60">
            <span>Sourcing your farm network</span>
            <span className="ka-tabular font-bold text-[#3F6B3D]">{progress}%</span>
          </div>
        </div>

        <div
          className="ka-sans ka-rise mt-7 flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-[11px] font-semibold text-[#3E2B1F]/75 border border-[#3E2B1F]/10 backdrop-blur-sm"
          style={{ animationDelay: '0.6s' }}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-[#3F6B3D]" />
          Verified DoCA escrow & cold-chain network
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;




