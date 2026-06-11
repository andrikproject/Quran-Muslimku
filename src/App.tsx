/**
 * @author Habib Ismail Al Qadri
 * @app Quran Saku
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, BookOpen, Search, Heart, User, Bell, ChevronRight, 
  BookMarked, HelpCircle, FileText, Calendar, Clock, Sparkles, 
  Share2, Play, Volume2, History, RotateCcw, PenTool, HandHeart,
  Compass
} from "lucide-react";

// Components
import { Splash } from "./components/Splash";
import { ToastContainer, ToastMessage } from "./components/Toast";
import { JadwalSholatWidget } from "./components/JadwalSholatWidget";
import { QuranReader } from "./components/QuranReader";
import { DoaHarianView } from "./components/DoaHarianView";
import { CariView } from "./components/CariView";
import { SettingsView } from "./components/SettingsView";
import { InstallPrompt } from "./components/InstallPrompt";
import { TasbihView } from "./components/TasbihView";
import { ArahKiblatView } from "./components/ArahKiblatView";
import { KalenderView } from "./components/KalenderView";

// Typings and Data
import { Bookmark, Note, TilawahProgress } from "./types";
import { App as CapacitorApp } from "@capacitor/app";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<"beranda" | "quran" | "cari" | "doa" | "profil" | "tasbih" | "kiblat" | "kalender">("beranda");

  // Handle Android Physical Back Button
  useEffect(() => {
    const handleBackButton = async () => {
      if (activeTab !== "beranda") {
        setActiveTab("beranda");
      } else {
        await CapacitorApp.exitApp();
      }
    };

    const backListener = CapacitorApp.addListener('backButton', handleBackButton);

    return () => {
      backListener.then(listener => listener.remove());
    };
  }, [activeTab]);

  // Notifications/Toasts System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (title: string, body: string, type: ToastMessage["type"]) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, body, type }]);
    
    // Auto remove toast in 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // State: Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  // State: Notes
  const [notes, setNotes] = useState<Note[]>([]);
  // State: Tilawah logs & progress tracker
  const [tilawahProgress, setTilawahProgress] = useState<TilawahProgress>({
    currentSurah: 2,
    currentSurahName: "Al-Baqarah",
    currentAyat: 183,
    totalAyat: 286,
    progressPercentage: 64
  });

  // Daily Reading Target
  const [dailyReadingTime, setDailyReadingTime] = useState(() => {
    return parseInt(localStorage.getItem("qs_daily_time") || "0");
  });
  
  const updateDailyReadingTime = (incrementMins: number) => {
    const newVal = Math.min(dailyReadingTime + incrementMins, 15);
    setDailyReadingTime(newVal);
    localStorage.setItem("qs_daily_time", newVal.toString());
    addToast("Waktu Berlalu", `Tercatat +${incrementMins} menit untuk target harian Anda.`, "success");
  };

  // State: User profile parameters
  const [userName, setUserName] = useState("Ahlan");
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15);

  // Jump from Home / search directly into Specific Surah details
  const [deepLinkSurah, setDeepLinkSurah] = useState<number | null>(null);

  // Load persistence from client localStorage
  useEffect(() => {
    const cachedBookmarks = localStorage.getItem("qs_bookmarks");
    if (cachedBookmarks) {
      try { setBookmarks(JSON.parse(cachedBookmarks)); } catch {}
    }

    const cachedNotes = localStorage.getItem("qs_notes");
    if (cachedNotes) {
      try { setNotes(JSON.parse(cachedNotes)); } catch {}
    }

    const cachedProgress = localStorage.getItem("qs_progress");
    if (cachedProgress) {
      try { setTilawahProgress(JSON.parse(cachedProgress)); } catch {}
    }

    const cachedName = localStorage.getItem("qs_username");
    if (cachedName) {
      setUserName(cachedName);
    }

    const cachedGoal = localStorage.getItem("qs_goal");
    if (cachedGoal) {
      setDailyGoalMinutes(Number(cachedGoal));
    }
  }, []);

  // Save persistence when states adjust
  const handleAddBookmark = (b: Bookmark) => {
    const updated = [...bookmarks, b];
    setBookmarks(updated);
    localStorage.setItem("qs_bookmarks", JSON.stringify(updated));
  };

  const handleRemoveBookmark = (surahNo: number, ayatNo: number) => {
    const updated = bookmarks.filter((b) => !(b.surahNo === surahNo && b.ayatNo === ayatNo));
    setBookmarks(updated);
    localStorage.setItem("qs_bookmarks", JSON.stringify(updated));
  };

  const handleAddNote = (surahNo: number, surahName: string, ayatNo: number, txt: string) => {
    const entry: Note = {
      id: Math.random().toString(36).substring(2, 9),
      surahNo,
      surahName,
      ayatNo,
      text: txt,
      timestamp: Date.now()
    };
    const updated = [entry, ...notes];
    setNotes(updated);
    localStorage.setItem("qs_notes", JSON.stringify(updated));
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    localStorage.setItem("qs_notes", JSON.stringify(updated));
  };

  const handleUpdateTilawahProgress = (surahNo: number, surahName: string, ayatNo: number, totalAyat: number) => {
    const percentage = Math.round((ayatNo / totalAyat) * 100);
    const updated: TilawahProgress = {
      currentSurah: surahNo,
      currentSurahName: surahName,
      currentAyat: ayatNo,
      totalAyat,
      progressPercentage: percentage
    };
    setTilawahProgress(updated);
    localStorage.setItem("qs_progress", JSON.stringify(updated));
  };

  const handleSetUserName = (n: string) => {
    setUserName(n);
    localStorage.setItem("qs_username", n);
  };

  const handleSetDailyGoalMinutes = (m: number) => {
    setDailyGoalMinutes(m);
    localStorage.setItem("qs_goal", m.toString());
  };

  // Jump page reader
  const handleJumpToSurah = (surahNo: number) => {
    setDeepLinkSurah(surahNo);
    setActiveTab("quran");
  };

  // Get localized Islamic greeting and greeting based on current local time
  const [greetingText, setGreetingText] = useState("Selamat datang!");
  const [timeOfDay, setTimeOfDay] = useState("malam");
  
  useEffect(() => {
    const hr = new Date().getHours();
    if (hr >= 4 && hr < 11) {
      setGreetingText("Selamat Pagi!");
      setTimeOfDay("pagi");
    } else if (hr >= 11 && hr < 15) {
      setGreetingText("Selamat Siang!");
      setTimeOfDay("siang");
    } else if (hr >= 15 && hr < 19) {
      setGreetingText("Selamat Sore!");
      setTimeOfDay("sore");
    } else {
      setGreetingText("Selamat Malam!");
      setTimeOfDay("malam");
    }
  }, []);

  // Verse of the day visual selection - QS Al-Kahf: 110 (as suggested under the aesthetic screen)
  const [ayatOfTheDay] = useState({
    surahId: 18,
    surahName: "Al-Kahf",
    verseId: 110,
    arab: "وَاصْبِرْ نَفْسَكَ مَعَ الَّذِينَ يَدْعُونَ رَبَّهُمْ بِالْغَدَاةِ وَالْعَشِيِّ يُرِيدُونَ وَجْهَهُ",
    indonesian: "“Dan bersabarlah engkau bersama orang-orang yang menyeru Tuhannya di pagi dan petang hari dengan mengharap keridhaan-Nya.”",
  });

  const shareAyatOfTheDay = () => {
    const text = `*Ayat Hari Ini (QS ${ayatOfTheDay.surahName}:${ayatOfTheDay.verseId})*\n\n${ayatOfTheDay.arab}\n\n"${ayatOfTheDay.indonesian}"\n\n- Dibagikan via Quran Saku App -`;
    navigator.clipboard.writeText(text);
    addToast("Teks Disalin", "Ayat hari ini disalin ke clipboard untuk Anda bagikan.", "success");
  };

  // Switcher rendering of tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case "beranda":
        return (
          <div className="flex flex-col gap-6 -mt-[125px] sm:-mt-[145px] relative z-20">
            {/* Ayat Hari Ini (Verse of the day card) */}
            <div className="bg-white/95 backdrop-blur-xl rounded-[28px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 flex flex-col gap-3 relative overflow-hidden select-none z-10 w-full mb-2 mx-auto max-w-2xl">
              {/* Corner label row */}
              <div className="flex justify-between items-center text-slate-500 text-[11px] font-semibold">
                <div className="flex items-center gap-1.5 text-amber-600">
                  <Sparkles className="w-4 h-4 fill-amber-100/55" />
                  <span className="font-extrabold text-slate-800 font-sans tracking-wide">Ayat Hari Ini</span>
                </div>
                <span className="font-sans tracking-wide text-slate-400 font-bold">
                  Al-Kahf · 18:24
                </span>
              </div>

              {/* Quran script */}
              <div className="py-2.5 text-center mt-1">
                <p className="font-serif text-2xl font-bold leading-relaxed text-slate-800 px-1" dir="rtl">
                  {ayatOfTheDay.arab}
                </p>
              </div>

              {/* Translation */}
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-sans font-medium text-left px-1 mt-1 border-t border-slate-50 pt-3">
                {ayatOfTheDay.indonesian}
              </p>

              {/* Tool row actions */}
              <div className="flex justify-between items-center pt-3 mt-1 border-t border-slate-50">
                {/* Square Share/Upload Button resembling the mockup */}
                <button
                  onClick={shareAyatOfTheDay}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100 rounded-xl transition cursor-pointer"
                  title="Bagikan Ayat"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleJumpToSurah(ayatOfTheDay.surahId)}
                  className="text-xs font-bold text-slate-800 hover:text-[#0F4C3A] flex items-center gap-1.5 cursor-pointer transition select-none pr-1"
                >
                  Baca Ayat <BookOpen className="w-3.5 h-3.5 text-slate-400" /> <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Main menu 8-grid grid listed under the screenshot */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
              <div className="grid grid-cols-4 gap-y-5 gap-x-4">
                {[
                  { tag: "Al-Qur'an", action: () => setActiveTab("quran"), bg: "bg-[#EDF4F1] text-[#0F4C3A]", icon: <BookOpen className="w-5.5 h-5.5" /> },
                  { tag: "Terakhir Baca", action: () => handleJumpToSurah(tilawahProgress.currentSurah), bg: "bg-[#FDF7E7] text-amber-700", icon: <Clock className="w-5.5 h-5.5" /> },
                  { tag: "Arah Kiblat", action: () => { setActiveTab("kiblat"); addToast("Arah Kiblat", "Membuka navigator kiblat.", "info"); }, bg: "bg-[#EDF6F5] text-teal-700", icon: <Compass className="w-5.5 h-5.5" /> },
                  { tag: "Kalender", action: () => { setActiveTab("kalender"); addToast("Kalender Hijriah", "Membuka penanggalan Islam.", "info"); }, bg: "bg-[#F7F2EC] text-amber-900", icon: <Calendar className="w-5.5 h-5.5" /> },
                  { tag: "Tafsir", action: () => setActiveTab("quran"), bg: "bg-[#F3EEF8] text-purple-700", icon: <FileText className="w-5.5 h-5.5" /> },
                  { tag: "Doa Harian", action: () => setActiveTab("doa"), bg: "bg-[#FDF2EB] text-orange-700", icon: <HandHeart className="w-5.5 h-5.5" /> },
                  { tag: "Jadwal Sholat", action: () => {
                    const el = document.getElementById("jadwal-sholat-widget-container");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "center" });
                      addToast("Jadwal Sholat", "Menampilkan panel jadwal sholat.", "info");
                    }
                  }, bg: "bg-[#EEF6FA] text-sky-700", icon: <Calendar className="w-5.5 h-5.5" /> },
                  { tag: "Tasbih", action: () => {
                    setActiveTab("tasbih");
                    addToast("Tasbih Digital", "Membuka fitur Tasbih Digital.", "info");
                  }, bg: "bg-[#EDF5F1] text-emerald-700", icon: <RotateCcw className="w-5.5 h-5.5" /> }
                ].map((itm, i) => (
                  <button
                    key={i}
                    onClick={itm.action}
                    className="flex flex-col items-center text-center gap-2 cursor-pointer focus:outline-none"
                  >
                    <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#FAF6EE] border border-[#F2ECE4]/60 shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                      <div className={`p-1 ${itm.bg.split(' ')[1]}`}>
                        {itm.icon}
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 leading-normal line-clamp-1 w-full mt-0.5">
                      {itm.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Membaca Harian */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">Target Harian</h4>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">{dailyReadingTime} dari 15 Menit hari ini</span>
                  </div>
                </div>
                <button 
                  onClick={() => updateDailyReadingTime(5)}
                  disabled={dailyReadingTime >= 15}
                  className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                    dailyReadingTime >= 15 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                      : "bg-[#0F4C3A]/10 text-[#0F4C3A] hover:bg-[#0F4C3A]/20 active:scale-95 cursor-pointer"
                  }`}
                >
                  {dailyReadingTime >= 15 ? "Selesai" : "+ 5 Menit"}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${Math.min((dailyReadingTime / 15) * 100, 100)}%` }} 
                    className="h-full bg-[#ECC17A] rounded-full transition-all duration-500 ease-out"
                  />
                </div>
                <span className="text-xs font-bold text-slate-700 font-mono">
                  {Math.round(Math.min((dailyReadingTime / 15) * 100, 100))}%
                </span>
              </div>
            </div>

            {/* Progress Tilawah */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center px-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-855 tracking-wide">Progress Tilawah</h4>
                <button
                  onClick={() => handleJumpToSurah(tilawahProgress.currentSurah)}
                  className="text-xs font-bold text-[#0F4C3A] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  Lihat Semua
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-[#EDF5F1] rounded-3xl p-5 sm:p-6 shadow-xs border border-emerald-100/40 flex items-center gap-5 justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-slate-850 truncate">
                    {tilawahProgress.currentSurahName} · {tilawahProgress.currentSurah}
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Ayat {tilawahProgress.currentAyat} dari {tilawahProgress.totalAyat}
                  </p>
                  
                  {/* Progress bar and 64% inline */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex-1 bg-emerald-800/10 h-2.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${tilawahProgress.progressPercentage}%` }}
                        className="h-full bg-[#0F4C3A] rounded-full transition-all duration-300"
                      ></div>
                    </div>
                    <span className="font-extrabold text-xs text-slate-600 font-mono">
                      {tilawahProgress.progressPercentage}%
                    </span>
                  </div>
                </div>

                {/* Big circular green badge on the right with a gold open book icon! */}
                <div className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-[#0F4C3A] flex items-center justify-center text-center flex-shrink-0 shadow shadow-emerald-950/30">
                  <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full border border-[#ECC17A]/30 flex items-center justify-center bg-emerald-900/40">
                    <BookOpen className="w-5.5 h-5.5 text-[#ECC17A]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Terakhir Dibaca directory list (from image) */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center px-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-855 tracking-wide">Terakhir Dibaca</h4>
                <button
                  onClick={() => setActiveTab("quran")}
                  className="text-xs font-bold text-[#0F4C3A] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  Lihat Semua
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex flex-col">
                {[
                  { name: "Al-Kahf", num: 18, details: "Halaman 293" },
                  { name: "Yasin", num: 36, details: "Halaman 440" },
                  { name: "Ar-Rahman", num: 55, details: "Halaman 531" }
                ].map((itm, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleJumpToSurah(itm.num)}
                    className={`w-full text-left py-3 hover:bg-slate-50/50 transition-all flex justify-between items-center group cursor-pointer ${
                      idx !== 2 ? "border-b border-slate-100/70" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Premium elegant rounded square widget with mosque dome ornament */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden ${
                        idx === 0 ? "bg-[#0F4C3A]/10 text-[#0F4C3A]" : idx === 1 ? "bg-amber-100/70 text-amber-800" : "bg-[#EDF5F1] text-emerald-800"
                      }`}>
                        <svg className="absolute inset-0 opacity-15" viewBox="0 0 40 40" fill="currentColor">
                          <path d="M 20 6 L 33 24 Q 20 18 7 24 Z" />
                          <circle cx="20" cy="29" r="3.5" />
                        </svg>
                        <span className="font-serif font-bold text-sm select-none z-10">📖</span>
                      </div>
                      <span className="font-bold text-slate-700 text-sm group-hover:text-[#0F4C3A] transition-colors">
                        {itm.name} · {itm.num}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 font-bold text-xs group-hover:text-[#0F4C3A] transition-colors">
                      {itm.details}
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Realtime prayer schedule display */}
            <div id="jadwal-sholat-widget-container">
              <JadwalSholatWidget addToast={addToast} />
            </div>
          </div>
        );

      case "quran":
        return (
          <QuranReader
            bookmarks={bookmarks}
            addBookmark={handleAddBookmark}
            removeBookmark={handleRemoveBookmark}
            notes={notes}
            addNote={handleAddNote}
            deleteNote={handleDeleteNote}
            updateTilawahProgress={handleUpdateTilawahProgress}
            addToast={addToast}
            initialSelectedSurah={deepLinkSurah}
            resetInitialSelectedSurah={() => setDeepLinkSurah(null)}
          />
        );

      case "doa":
        return <DoaHarianView addToast={addToast} />;

      case "cari":
        return <CariView onSelectSurah={handleJumpToSurah} addToast={addToast} />;

      case "tasbih":
        return <TasbihView addToast={addToast} />;

      case "kiblat":
        return <ArahKiblatView addToast={addToast} />;

      case "kalender":
        return <KalenderView addToast={addToast} />;

      case "profil":
        return (
          <SettingsView
            bookmarks={bookmarks}
            removeBookmark={handleRemoveBookmark}
            notes={notes}
            deleteNote={handleDeleteNote}
            onJumpToSurah={handleJumpToSurah}
            userName={userName}
            setUserName={handleSetUserName}
            dailyGoalMinutes={dailyGoalMinutes}
            setDailyGoalMinutes={handleSetDailyGoalMinutes}
            addToast={addToast}
          />
        );

      default:
        return null;
    }
  };

  // Skip visual splash screen instantly on completion loading
  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] text-slate-800 font-sans pb-28 flex flex-col justify-between overflow-x-hidden">
      {/* Toast container notification tray */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* 1. TOP COVER DECORATION & COHESIVE SYSTEM HEADERS */}
      {activeTab === "beranda" ? (
        <div className="relative w-full text-white">
          <div className="absolute top-0 inset-x-0 h-[50vh] sm:h-[55vh] min-h-[400px] z-0 pointer-events-none overflow-hidden bg-slate-800">
            <motion.div 
              animate={{ scale: [1, 1.08] }}
              transition={{ duration: 40, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
              className="w-full h-full opacity-90 origin-bottom"
              style={{
                backgroundImage: `url(/${timeOfDay}.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center bottom',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
          </div>

          <div className="relative z-10 pt-12 pb-[180px] sm:pb-[220px] px-5 max-w-7xl mx-auto w-full drop-shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex flex-col drop-shadow-md">
                <span className="text-sm font-medium tracking-wide">
                  Assalamualaikum 👋
                </span>
                <h1 className="font-serif font-bold text-white text-3xl sm:text-4xl mt-0.5 tracking-tight leading-tight">
                  Selamat datang!
                </h1>
                <p className="text-xs font-medium mt-1">
                  Semoga hari ini penuh berkah.
                </p>
              </div>

              {/* Notification bell button */}
              <div className="flex gap-2 flex-shrink-0 self-start mt-2">
                <button
                  onClick={() => {
                    setActiveTab("profil");
                    addToast("Setelan Pengingat", "Silakan atur preferences profil & alarm sholat Anda.", "info");
                  }}
                  className="w-11 h-11 bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 cursor-pointer shadow-sm relative focus:outline-none transition-transform active:scale-95"
                >
                  <Bell className="w-5.5 h-5.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <header className="relative z-15 px-5 pt-6 pb-2.5 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-slate-100 bg-white/60 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div
              onClick={() => setActiveTab("beranda")}
              className="w-10 h-10 bg-[#0F4C3A] rounded-2xl flex items-center justify-center border border-amber-300/10 shadow-sm p-2 cursor-pointer transition-transform hover:scale-105"
            >
              <span className="text-xs font-serif font-bold text-[#ECC17A]">قرآن</span>
            </div>
            <div>
              <span className="text-[9px] font-extrabold text-slate-400 tracking-widest block uppercase">
                MUSHAF SAKU
              </span>
              <h2 className="font-extrabold text-slate-700 text-sm leading-none mt-0.5">
                Al-Qur'an Premium
              </h2>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("beranda")}
            className="text-xs font-bold text-[#0F4C3A] hover:underline cursor-pointer"
          >
            Beranda
          </button>
        </header>
      )}

      {/* 2. DYNAMIC WORK SPACE */}
      <main className={`flex-1 w-full mx-auto relative z-10 ${activeTab === 'beranda' ? 'bg-[#FDFBF7] rounded-t-[40px] sm:rounded-t-[48px] pt-6 px-5 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]' : 'px-5 py-4 max-w-7xl'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <InstallPrompt />

      {/* 3. PREMIUM FLOATING BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-100 rounded-t-[32px] px-6 py-2 pb-6 flex justify-between items-end shadow-2xl shadow-slate-900/10 z-40 max-w-md mx-auto">
        {[
          { id: "beranda", label: "Beranda", icon: <Home className="w-[22px] h-[22px]" strokeWidth={1.5} /> },
          { id: "quran", label: "Al-Qur'an", icon: <BookOpen className="w-[22px] h-[22px]" strokeWidth={1.5} /> },
          { id: "cari", label: "Cari", icon: <Search className="w-5.5 h-5.5" strokeWidth={1.5} />, isCenter: true },
          { id: "doa", label: "Doa", icon: <HandHeart className="w-[22px] h-[22px]" strokeWidth={1.5} /> },
          { id: "profil", label: "Profil", icon: <User className="w-[22px] h-[22px]" strokeWidth={1.5} /> }
        ].map((item) => {
          const isAct = activeTab === item.id;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab("cari")}
                className="flex flex-col items-center justify-center flex-1 focus:outline-none cursor-pointer group pb-1"
              >
                <div className="relative -top-6 w-14 h-14 rounded-full bg-[#0F4C3A] text-white flex items-center justify-center shadow-lg shadow-emerald-950/30 transition-transform active:scale-95 hover:scale-105 border-4 border-white">
                  {item.icon}
                </div>
                <span className={`text-[10px] font-bold tracking-tight -mt-4 mb-0.5 transition-colors duration-300 ${
                  isAct ? "text-[#0F4C3A]" : "text-slate-400 group-hover:text-slate-700"
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className="flex flex-col items-center justify-center p-1.5 cursor-pointer focus:outline-none transition-colors group select-none flex-1 pb-1"
            >
              <div className={`transition-all duration-500 ease-out ${
                isAct 
                  ? "text-[#0F4C3A] scale-110 drop-shadow-md translate-y-[-2px]" 
                  : "text-slate-400 group-hover:text-slate-700 group-hover:-translate-y-1"
              }`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-bold tracking-tight mt-1 transition-colors duration-500 ${
                isAct 
                  ? "text-[#0F4C3A]" 
                  : "text-slate-400 group-hover:text-slate-700"
              }`}>
                {item.label}
              </span>
              
              {/* Micro active dot */}
              {isAct && (
                <span className="w-1 h-1 bg-[#0F4C3A] rounded-full mt-0.5"></span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
