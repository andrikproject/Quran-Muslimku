import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, Bookmark, Shield, Trash, Bell, Check, 
  HelpCircle, Sparkles, BookOpen, AlertTriangle, ArrowRight 
} from "lucide-react";
import { Bookmark as BookmarkType, Note } from "../types";

interface SettingsViewProps {
  bookmarks: BookmarkType[];
  removeBookmark: (surahNo: number, ayatNo: number) => void;
  notes: Note[];
  deleteNote: (id: string) => void;
  onJumpToSurah: (surahNo: number) => void;
  userName: string;
  setUserName: (n: string) => void;
  dailyGoalMinutes: number;
  setDailyGoalMinutes: (m: number) => void;
  addToast: (title: string, body: string, type: "success" | "info" | "warning" | "notification") => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  bookmarks,
  removeBookmark,
  notes,
  deleteNote,
  onJumpToSurah,
  userName,
  setUserName,
  dailyGoalMinutes,
  setDailyGoalMinutes,
  addToast
}) => {
  const [activeMenu, setActiveMenu] = useState<"profil" | "bookmarks" | "notes">("profil");
  const [editingName, setEditingName] = useState(userName);

  const saveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(editingName);
    addToast("Profil Disimpan", `Nama panggilan Anda diperbarui menjadi: ${editingName}`, "success");
  };

  const clearAllAppletState = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua data penanda buku, catatan tadabbur, dan info tilawah di dalam Quran Saku?")) {
      localStorage.clear();
      addToast("Data Direset!", "Semua data penyimpanan lokal dibersihkan. Memuat ulang...", "warning");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const triggerTestSoundAlert = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // High C
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
      addToast("Uji Coba Berhasil 🔊", "Getaran audio pengingat adzan disimulasikan.", "success");
    } catch {
      addToast("Uji Coba Gagal 🔇", "Aktifkan audio untuk mendengar simulasi.", "warning");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* SIDEBAR NAVIGATION (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-2 bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
        <div className="p-3 text-center pb-5 border-b border-slate-50 flex flex-col items-center select-none">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0F4C3A] font-serif font-extrabold text-2xl flex items-center justify-center border border-emerald-100 shadow-sm mb-3">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <h4 className="font-bold text-slate-800 text-sm">{userName || "Hamba Allah"}</h4>
          <span className="text-[10px] text-slate-400 font-bold tracking-wider mt-1 block bg-slate-50 px-3 py-1 rounded-full uppercase">
            TARGET: {dailyGoalMinutes} MENIT/HARI
          </span>
        </div>

        {[
          { id: "profil", label: "Profil & Target Harian", icon: <User className="w-4.5 h-4.5" /> },
          { id: "bookmarks", label: `Markah Bacaan (${bookmarks.length})`, icon: <Bookmark className="w-4.5 h-4.5" /> },
          { id: "notes", label: `Catatan Tadabbur (${notes.length})`, icon: <Shield className="w-4.5 h-4.5" /> }
        ].map((item) => {
          const isAct = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id as any)}
              className={`w-full text-left p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 transition-all cursor-pointer ${
                isAct
                  ? "bg-[#0F4C3A] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* CONTENT REGION (8 cols) */}
      <div className="lg:col-span-8 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-5 min-h-[400px]">
        
        {/* VIEW 1: PROFILE MANAGEMENT */}
        {activeMenu === "profil" && (
          <form onSubmit={saveProfileSettings} className="flex flex-col gap-5">
            <div>
              <h3 className="font-serif font-bold text-[#0F4C3A] text-lg">Profil Pengguna & Simulasi</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Modifikasi data identitas diri untuk menyapa khidmat di halaman utama.
              </p>
            </div>

            {/* Editing Name field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500">NAMA PANGGILAN</label>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Contoh: Ahlan, Muhammad..."
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 font-medium"
              />
            </div>

            {/* Goal selecting minutes slider */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span className="uppercase">TARGET TILAWAH AL-QUR'AN</span>
                <span className="text-[#0F4C3A]">{dailyGoalMinutes} MENIT / HARI</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0F4C3A]"
              />
              <span className="text-[10px] text-slate-400 font-semibold block leading-normal italic">
                Sistem tilawah secara berkala memotivasi Anda menyelesaikan tadabbur berdasar durasi ini.
              </span>
            </div>

            {/* Test alert sound mock notification */}
            <div className="border border-slate-100 p-4.5 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50">
              <div className="text-center sm:text-left">
                <h4 className="text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-center sm:justify-start gap-1">
                  <Bell className="w-4.5 h-4.5 text-emerald-800" />
                  Uji Coba Alarm Adzan
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Tes apakah audio pengingat di gawai Anda berbunyi semestinya.
                </p>
              </div>
              <button
                type="button"
                onClick={triggerTestSoundAlert}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-950 text-[#ECC17A] text-xs font-bold rounded-xl shadow cursor-pointer transition-colors"
              >
                Tes Getar Alarm 🔊
              </button>
            </div>

            <div className="h-4"></div>

            {/* Actions array */}
            <div className="flex justify-between items-center border-t border-slate-50 pt-5">
              <button
                type="button"
                onClick={clearAllAppletState}
                className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-xs font-bold border border-red-100 transition-colors cursor-pointer"
              >
                Reset Semua Data
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0F4C3A] hover:bg-emerald-950 text-white rounded-xl text-xs font-bold shadow transition-colors cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}

        {/* VIEW 2: BOOKMARK DIRECTORY LIST */}
        {activeMenu === "bookmarks" && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-serif font-bold text-[#0F4C3A] text-lg">Markah Bacaan Quran</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Daftar lengkap ayat-ayat yang Anda tandai demi memudahkan muraja'ah.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto">
              {bookmarks.length > 0 ? (
                bookmarks.map((b) => (
                  <div
                    key={`${b.surahNo}_${b.ayatNo}`}
                    className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between shadow-sm hover:border-emerald-200 transition-all gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F4C3A] font-serif font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {b.surahNo}:{b.ayatNo}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                          Surat {b.surahName}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold tracking-wide mt-0.5">
                          AYAT KE-{b.ayatNo} • DITANDAI PADA {new Date(b.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end mt-2 sm:mt-0">
                      <button
                        onClick={() => {
                          removeBookmark(b.surahNo, b.ayatNo);
                          addToast("Bookmark Dihapus", "Ayat dibuang dari markah.", "info");
                        }}
                        className="px-3 py-1.5 border border-red-100 text-red-500 hover:bg-red-50 rounded-xl text-[10px] font-bold cursor-pointer transition"
                      >
                        Hapus
                      </button>
                      <button
                        onClick={() => onJumpToSurah(b.surahNo)}
                        className="px-3.5 py-1.5 bg-[#0F4C3A] hover:bg-emerald-950 text-[#ECC17A] rounded-xl text-[10px] font-bold cursor-pointer flex items-center gap-1 transition"
                      >
                        Buka
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-slate-400 border border-dashed border-slate-100 rounded-3xl">
                  <Bookmark className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5] mb-2" />
                  <p className="text-xs font-semibold">Belum ada ayat yang ditandai bookmark.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: SPUR OF MOMENT NOTES/REFLECTION DIRECTORY */}
        {activeMenu === "notes" && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-serif font-bold text-[#0F4C3A] text-lg">Catatan & Tadabbur</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Kompilasi pemikiran dan buah tadabbur pribadi yang dicatat dalam mushaf.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 max-h-[460px] overflow-y-auto">
              {notes.length > 0 ? (
                notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-4.5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-3 shadow-sm hover:border-emerald-200 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ECC17A]"></span>
                        <h4 className="font-bold text-slate-700 text-xs sm:text-sm">
                          QS {n.surahName} • Ayat {n.ayatNo}
                        </h4>
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold tracking-wider">
                        {new Date(n.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Content text */}
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium bg-white p-3 rounded-xl border border-slate-100 select-all">
                      "{n.text}"
                    </p>

                    {/* Actions control */}
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          deleteNote(n.id);
                          addToast("Catatan Dihapus", "Catatan tadabbur berhasil dihapus.", "info");
                        }}
                        className="px-3.5 py-1.5 border border-red-100 text-red-500 hover:bg-red-50 text-[10px] font-bold rounded-xl transition cursor-pointer"
                      >
                        Hapus Catatan
                      </button>
                      <button
                        onClick={() => onJumpToSurah(n.surahNo)}
                        className="px-4 py-1.5 bg-[#0F4C3A] hover:bg-emerald-950 text-[#ECC17A] text-[10px] font-bold rounded-xl flex items-center gap-1 transition cursor-pointer"
                      >
                        Jelajahi Ayat
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-slate-400 border border-dashed border-slate-100 rounded-3xl">
                  <Shield className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5] mb-2" />
                  <p className="text-xs font-semibold">Belum adat catatan tadabbur yang ditulis.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
