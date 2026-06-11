/**
 * @author Habib Ismail Al Qadri
 * @app Quran Saku
 */
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Send, Bot, User, Trash, ArrowRight, HelpCircle, 
  BookOpen, ChevronRight, MessageSquareCode, Search, Terminal 
} from "lucide-react";
import { STATIC_SURAHS } from "../data";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

interface CariViewProps {
  onSelectSurah: (surahNo: number) => void;
  addToast: (title: string, body: string, type: "success" | "info" | "warning" | "notification") => void;
  geminiApiKey?: string;
}

export const CariView: React.FC<CariViewProps> = ({ onSelectSurah, addToast, geminiApiKey }) => {
  // Global search states
  const [globalQuery, setGlobalQuery] = useState("");
  const [matchedSurahs, setMatchedSurahs] = useState<typeof STATIC_SURAHS>([]);

  // AI Chat states
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Assalamu'alaikum! Saya adalah Asisten AI 'Tanya Al-Qur'an' di Quran Saku Anda. Silakan tanyakan apa saja tentang kandungan ayat, nasehat spiritual, tafsir makna, maupun petunjuk doa yang ingin Anda ketahui.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Recommendations list
  const suggestedPrompts = [
    "Makna ketenangan jiwa dalam surat Al-Ra'd",
    "Tafsir keutamaan membaca Surat Al-Kahfi di hari Jumat",
    "Ayat Quran tentang sabar menghadapi ujian hidup",
    "Rekomendasi doa untuk kelancaran mencari rezeki halal"
  ];

  // Global search filtering on input change
  useEffect(() => {
    if (!globalQuery.trim()) {
      setMatchedSurahs([]);
      return;
    }
    const matches = STATIC_SURAHS.filter(
      (s) =>
        s.namaLatin.toLowerCase().includes(globalQuery.toLowerCase()) ||
        s.arti.toLowerCase().includes(globalQuery.toLowerCase()) ||
        s.deskripsi.toLowerCase().includes(globalQuery.toLowerCase())
    );
    setMatchedSurahs(matches);
  }, [globalQuery]);

  // Scroll chat area when responses load
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  // Handle AI send submit
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || isSending) return;

    // Add user question
    const userMsg: ChatMessage = {
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsSending(true);

    try {
      let aiText = "";

      if (geminiApiKey && geminiApiKey.trim() !== "") {
        // Direct call to Gemini from client to support static Vercel deployments!
        const sysInstruct = "Anda adalah asisten AI 'Tanya Ustadz AI' di dalam aplikasi 'Quran Saku'. Anda adalah seorang Ulama Mufassir yang sangat berpengetahuan tentang Al-Qur'an, Tafsir, Asbabun Nuzul, dan hadits. Tugas Anda adalah memberikan jawaban dan bimbingan spiritual Islami secara komprehensif, akurat, dan merujuk *secara langsung* pada ayat-ayat Al-Qur'an. Wajib menyertakan teks Arab (jika relevan), terjemahan, serta referensi QS. Nama-Surah: Nomor-Ayat yang valid. Jika ditanya mengenai hukum atau nasihat, landaskan argumentasi selalu pada Al-Qur'an terlebih dahulu. Jangan pernah mengarang ayat Al-Qur'an.";
        
        const qp = `Pertanyaan Pengguna:\n${textToSend}\n\nBerikan tanggapan yang bijak, komprehensif, dan langsung menjawab pertanyaan pengguna berdasarkan referensi Al-Qur'an dan Sunnah yang shahih. Pastikan untuk mencantumkan nama Surah dan nomor ayat yang mendukung jawaban Anda. Tulislah dalam Bahasa Indonesia yang santun.`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey.trim()}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: sysInstruct }] },
            contents: [{ role: "user", parts: [{ text: qp }] }]
          })
        });

        if (!response.ok) throw new Error(`Google API: ${response.status} ${response.statusText}`);
        const payload = await response.json();
        
        aiText = payload.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, Ustadz AI tidak dapat menemukan jawaban referensi.";

      } else {
        // Standard full-stack backend approach
        const response = await fetch("/api/ask-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: textToSend })
        });
  
        const contentType = response.headers.get("content-type");
        if (!contentType || contentType.indexOf("application/json") === -1) {
          throw new Error("API backend Express tidak ditemukan (Ini wajar jika Anda mendeploy di Vercel Static, karena Vercel bukan server Express). Solusi: Cukup tambahkan Kunci API Gemini Anda di menu Pengaturan Profil untuk langsung menggunakan koneksi tanpa server (Serverless).");
        }
  
        const payload = await response.json();
        if (payload.status && payload.answer) {
          aiText = payload.answer;
        } else {
          throw new Error(payload.message || "Gagal berkomunikasi dengan asisten AI.");
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiText,
          timestamp: new Date()
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `**Maaf, saya mengalami kendala interaksi:** ${err.message}`,
          timestamp: new Date()
        }
      ]);
      addToast("AI Gagal Menjawab", "Harap periksa pengaturan Kunci API atau koneksi Anda.", "warning");
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: "ai",
        text: "Pesan obrolan tadabbur dibersihkan. Tanyakan petunjuk Al-Qur'an dan bimbingan rohani yang Anda butuhkan kembali.",
        timestamp: new Date()
      }
    ]);
    addToast("Obrolan Dihapus", "Riwayat dialog dibersihkan.", "info");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT COLUMN: Global Surah Search Index (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="font-serif font-bold text-[#0F4C3A] text-lg">Pencarian Surah & Arti</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Cari kata kunci terjemahan atau makna ringkas untuk melompat membaca surah Al-Qur'an.
            </p>
          </div>

          {/* Input field */}
          <div className="relative">
            <input
              type="text"
              value={globalQuery}
              onChange={(e) => setGlobalQuery(e.target.value)}
              placeholder="Cari lafadz atau arti (cth: sapi, gua, pembukaan)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/25"
            />
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Results array */}
          <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
            {globalQuery.trim() ? (
              matchedSurahs.length > 0 ? (
                matchedSurahs.map((surah) => (
                  <button
                    key={surah.nomor}
                    onClick={() => {
                      onSelectSurah(surah.nomor);
                      addToast("Membuka Surah", `Membuka halaman Surat ${surah.namaLatin}`, "success");
                    }}
                    className="w-full text-left p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/70 hover:border-emerald-200 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-emerald-100/60 font-serif font-bold text-xs text-emerald-800 flex items-center justify-center">
                        {surah.nomor}
                      </span>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-700 text-xs sm:text-sm group-hover:text-[#0F4C3A] transition-colors truncate block">
                          {surah.namaLatin}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider mt-0.5">
                          {surah.arti} • {surah.jumlahAyat} Ayah
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600 transition-transform group-hover:translate-x-1" />
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                  Tidak ada kecocokan arti kata kunci "{globalQuery}" dalam daftar surah Quran.
                </div>
              )
            ) : (
              <div className="text-center py-10 text-slate-400 border border-dashed border-slate-100 rounded-2xl p-4">
                <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                <p className="text-xs font-medium">Tuliskan kata kunci untuk memicu indeks pencari pintar surah.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: AI Dialogue Chatbox (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[520px]">
          {/* Header panel */}
          <div className="p-3 sm:p-4.5 bg-gradient-to-r from-[#0F4C3A] to-emerald-950 flex sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
              <div className="p-2 sm:p-2.5 bg-white/10 rounded-2xl shrink-0 mt-0.5 sm:mt-0">
                <Bot className="w-5 h-5 text-[#ECC17A]" />
              </div>
              <div className="min-w-0 flex-1 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mb-1 sm:mb-0.5">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-white leading-none">
                    Tanya Ustadz AI
                  </h3>
                  <span className="text-[8px] sm:text-[9px] bg-[#ECC17A] text-[#0F4C3A] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 leading-none">
                    PEMBELAJARAN
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-teal-100/90 font-medium leading-tight line-clamp-1">
                  Didukung model Gemini 2.5 Flash
                </p>
              </div>
            </div>
            
            {/* Clear btn */}
            <button
              onClick={handleClearChat}
              className="mt-1 sm:mt-0 shrink-0 text-[9px] sm:text-xs text-[#ECC17A] hover:text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              Hapus Obrolan
            </button>
          </div>

          {/* Scrolling messages feed */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-slate-50/40">
            {messages.map((msg, i) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={i}
                  className={`flex gap-3 max-w-[85%] ${isAi ? "self-start" : "self-end flex-row-reverse"}`}
                >
                  {/* Portrait icons */}
                  <div className={`p-2 rounded-xl h-9 w-9 flex items-center justify-center flex-shrink-0 ${
                    isAi ? "bg-emerald-50 border border-emerald-100 text-[#0F4C3A]" : "bg-slate-100 text-slate-700"
                  }`}>
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="flex flex-col gap-1">
                    {/* Speech bubble */}
                    <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text shadow-sm border ${
                      isAi 
                        ? "bg-white border-slate-100 text-slate-800" 
                        : "bg-[#0F4C3A] border-[#0F4C3A] text-white"
                    }`}>
                      {isAi ? (
                        <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-50 prose-a:text-[#0F4C3A]">
                          <ReactMarkdown>
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <span>{msg.text}</span>
                      )}
                    </div>
                    {/* Clock stamp */}
                    <span className="text-[9px] text-slate-400 font-bold tracking-wider self-end px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Waiting response loading card */}
            {isSending && (
              <div className="flex gap-3 self-start max-w-[80%] items-center text-slate-400">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <Bot className="w-4 h-4 animate-bounce text-[#0F4C3A]" />
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 text-xs font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C3A] animate-ping"></span>
                  Ustadz AI sedang memikirkan rujukan dalil terbaik untuk Anda...
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick recommendation tags */}
          {messages.length === 1 && (
            <div className="px-5 py-3 border-t border-slate-100 bg-white flex flex-col gap-2">
              <span className="text-[9px] font-bold text-slate-400 tracking-wider">SARAN PERTANYAAN:</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSendMessage(p)}
                    className="text-[10px] sm:text-xs font-bold text-left px-3 py-1.5 bg-slate-50 border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 text-[#0F4C3A] rounded-xl transition-all cursor-pointer"
                  >
                    {p} →
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input control rows */}
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2.5">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Tanyakan penafsiran ayat, tuntunan syariat, atau rujukan hikmah..."
              disabled={isSending}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/15"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isSending}
              className="px-5 py-3 bg-[#0F4C3A] hover:bg-emerald-950 text-[#ECC17A] rounded-2xl flex items-center justify-center shadow transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
