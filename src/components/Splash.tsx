import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface SplashProps {
  onFinish: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onFinish }) => {
  const [activeDot, setActiveDot] = useState(0);
  const [loadingText, setLoadingText] = useState("Menghubungkan ke server...");

  useEffect(() => {
    // Dot indicator animation
    const dotInterval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 4);
    }, 800);

    // Text transition phrases
    const phrases = [
      "Menghubungkan ke server...",
      "Menyiapkan mushaf Al-Qur'an...",
      "Mengunduh jadwal sholat terbaru...",
      "Selamat datang di Quran Saku!"
    ];

    let currentPhraseIdx = 0;
    const textInterval = setInterval(() => {
      currentPhraseIdx++;
      if (currentPhraseIdx < phrases.length) {
        setLoadingText(phrases[currentPhraseIdx]);
      } else {
        clearInterval(textInterval);
      }
    }, 1200);

    // Splash timeout of 4.5 seconds for premium feel, or skip button option
    const finishTimeout = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => {
      clearInterval(dotInterval);
      clearInterval(textInterval);
      clearTimeout(finishTimeout);
    };
  }, [onFinish]);

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] font-sans flex flex-col justify-between overflow-hidden">
      {/* Background Image provided by user */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/splashnya.png')` }}
      />
      
      {/* Gradient overlay to ensure text is readable at the bottom */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

      {/* Top bar indicators */}
      <div className="px-6 pt-5 flex justify-between items-center z-10 text-white drop-shadow-md">
        <span className="text-sm font-semibold tracking-tight">9:41</span>
        <div className="flex gap-1.5 items-center">
          <span className="w-4 h-3 bg-white/40 rounded-sm"></span>
          <span className="w-3 h-3 bg-white/40 rounded-full"></span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Loading bar, indicator dots and skip button */}
      <div className="px-6 pb-10 pt-12 flex flex-col items-center justify-center gap-4 z-10">
        <div className="flex gap-1.5 justify-center mb-1">
          {[0, 1, 2, 3].map((idx) => (
            <span
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeDot === idx ? "w-6 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Dynamic description of load */}
        <p className="text-xs font-semibold text-white/90 tracking-wide animate-pulse drop-shadow-md">
          {loadingText}
        </p>

        {/* Skip button for quicker entry */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFinish}
          className="mt-2 group px-5 py-2 rounded-full bg-white/20 backdrop-blur-md text-white font-medium text-xs flex items-center gap-1.5 shadow-lg border border-white/20 hover:bg-white/30 transition-colors"
        >
          Lewati Loading
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </motion.button>
      </div>
    </div>
  );
};
