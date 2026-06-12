import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, CheckCircle2, ChevronRight, Droplet, Star } from "lucide-react";

interface FikihViewProps {
  onBack?: () => void;
}

export const FikihView: React.FC<FikihViewProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const guides = [
    {
      id: "wudhu",
      title: "Tata Cara Wudhu",
      icon: <Droplet className="w-5 h-5" />,
      color: "bg-blue-50 text-blue-700",
      content: [
        { title: "Niat Dalam Hati", desc: "Membaca Bismillah dan berniat wudhu." },
        { title: "Mencuci Telapak Tangan", desc: "Membasuh kedua telapak tangan 3 kali." },
        { title: "Berkumur", desc: "Berkumur-kumur 3 kali." },
        { title: "Istinsyaq", desc: "Memasukkan air ke hidung lalu mengeluarkannya 3 kali." },
        { title: "Membasuh Wajah", desc: "Membasuh seluruh wajah secara merata 3 kali." },
        { title: "Membasuh Tangan", desc: "Membasuh kedua tangan hingga siku 3 kali." },
        { title: "Mengusap Kepala", desc: "Mengusap sebagian atau seluruh kepala 1 kali." },
        { title: "Mengusap Telinga", desc: "Mengusap kedua telinga bagian luar dan dalam 1 kali." },
        { title: "Membasuh Kaki", desc: "Membasuh kedua belah kaki hingga mata kaki 3 kali." },
        { title: "Tertib", desc: "Melakukan rangkaian di atas secara berurutan tanpa jeda panjang." },
        { title: "Doa Setelah Wudhu", desc: "Membaca syahadatain dan doa memohon kesucian." },
      ]
    },
    {
      id: "sholat_wajib",
      title: "Rukun Sholat",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "bg-emerald-50 text-emerald-700",
      content: [
        { title: "Berdiri", desc: "Berdiri tegak menghadap kiblat (bagi yang mampu)." },
        { title: "Niat", desc: "Niat diletakkan di dalam hati bertepatan dengan takbiratul ihram." },
        { title: "Takbiratul Ihram", desc: "Mengucapkan 'Allahu Akbar'." },
        { title: "Membaca Al-Fatihah", desc: "Membaca surah Al-Fatihah di setiap rakaat." },
        { title: "Ruku' dan Tuma'ninah", desc: "Membungkuk hingga punggung sejajar." },
        { title: "I'tidal", desc: "Berdiri tegak kembali setelah ruku'." },
        { title: "Sujud dan Tuma'ninah", desc: "Sujud dengan 7 bagian inti tubuh menyentuh lantai (jidat, dua telapak tangan, dua lutut, dua ujung kaki)." },
        { title: "Duduk Diantara Dua Sujud", desc: "Bangkit dari sujud pertama menuju posisi duduk iftirasy." },
        { title: "Duduk Tasyahud Akhir", desc: "Duduk pada rakaat terakhir (tawarruk)." },
        { title: "Membaca Tasyahud Akhir", desc: "Membaca bacaan tasyahud/tahiyat." },
        { title: "Shalawat", desc: "Membaca shalawat atas Nabi SAW pada saat tahiyat akhir." },
        { title: "Salam", desc: "Menoleh ke kanan mengucapkan: 'Assalamu 'alaikum wa rahmatullah'." },
        { title: "Tertib", desc: "Mengerjakan semua rukun secara berurutan dan tenang (tuma'ninah) dalam setiap transisi gerakan." }
      ]
    },
    {
      id: "sholat_sunnah",
      title: "Sholat Sunnah Pilihan",
      icon: <Star className="w-5 h-5" />,
      color: "bg-amber-50 text-amber-700",
      content: [
        { title: "Tahajud", desc: "Dikerjakan di sepertiga malam terakhir, minimal 2 rakaat. Sangat diutamakan untuk bermunajat dan memohon doa." },
        { title: "Dhuha", desc: "Dikerjakan pada pagi hari setelah matahari terbit (setinggi tombak) hingga menjelang waktu dzuhur, 2 sampai 12 rakaat. Berfungsi sebagai sedekah persendian tubuh dan pembuka rezeki." },
        { title: "Rawatib", desc: "Sholat sunnah yang menyertai sholat fardhu (sebelum/qobliyah dan sesudah/ba'diyah)." },
        { title: "Witir", desc: "Sebagai penutup ibadah malam, rakaat ganjil (1, 3, dst)." },
        { title: "Istikharah", desc: "2 rakaat ketika dihadapkan pada pilihan sulit. Doa khusus dibaca setelah salam." }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#FDFBF7] relative max-w-2xl mx-auto w-full pb-20">
      <div className="sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-slate-200/60 z-20 px-5 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white border border-slate-200 hover:bg-slate-50 hover:scale-105 rounded-full cursor-pointer transition-all shadow-sm">
          <ArrowLeft className="w-5 h-5 text-[#0F4C3A]" />
        </button>
        <div>
          <h3 className="font-bold text-[#0F4C3A] text-lg leading-tight">Fikih & Panduan</h3>
          <p className="text-[11px] font-bold text-emerald-700/70 uppercase tracking-widest mt-0.5">Tuntunan Ibadah Dasar</p>
        </div>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {!activeCategory ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="bg-gradient-to-br from-[#0F4C3A] to-emerald-900 border border-emerald-800 p-6 rounded-[28px] relative overflow-hidden shadow-md">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                 <h4 className="font-serif font-bold text-[#ECC17A] text-xl relative z-10">Tuntunan Beribadah</h4>
                 <p className="text-xs text-emerald-100/80 font-medium mt-1.5 relative z-10 leading-relaxed max-w-[85%]">
                   Panduan praktis syarat syukur menjadi hamba-Nya. Pahami rukun dan tata cara ibadah harian.
                 </p>
              </div>
              
              <div className="grid gap-3.5 mt-2">
                {guides.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveCategory(g.id)}
                    className="flex items-center gap-4 p-4 border border-slate-200/60 rounded-[24px] bg-white shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer text-left group"
                  >
                    <div className={`w-14 h-14 flex justify-center items-center rounded-2xl ${g.color} group-hover:scale-105 transition-transform`}>
                      {g.icon}
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-slate-800 text-[15px] group-hover:text-[#0F4C3A] transition-colors">{g.title}</h4>
                       <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{g.content.length} POIN PANDUAN</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#0F4C3A] transition-colors">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#ECC17A] transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              <button 
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-1.5 text-slate-500 hover:text-[#0F4C3A] bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold mb-5 cursor-pointer max-w-max shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali
              </button>
              
              {guides.filter(g => g.id === activeCategory).map(guide => (
                <div key={guide.id} className="flex flex-col gap-6">
                  <div className={`p-6 border rounded-[28px] ${guide.color} border-current/10 relative overflow-hidden`}>
                    <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
                      {React.cloneElement(guide.icon as React.ReactElement, { className: "w-32 h-32" })}
                    </div>
                    <div className="flex items-center gap-3 mb-3 relative z-10">
                       <div className="p-2 bg-white/40 backdrop-blur-sm rounded-xl">
                         {guide.icon}
                       </div>
                       <h3 className="font-bold text-xl">{guide.title}</h3>
                    </div>
                    <p className="text-[13px] opacity-90 font-medium relative z-10 leading-relaxed">
                      Langkah demi langkah menuju kesempurnaan beribadah sesuai syariat.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3.5">
                     {guide.content.map((item, id) => (
                        <div key={item.title} className="bg-white border border-slate-200/60 rounded-[24px] p-5 flex gap-4 shadow-sm hover:shadow-md transition-shadow group">
                           <span className="w-8 h-8 rounded-xl bg-[#FDFBF7] text-[#0F4C3A] border border-slate-200 font-bold text-sm flex items-center justify-center shrink-0 group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors">
                             {id + 1}
                           </span>
                           <div>
                              <h4 className="font-bold text-[15px] text-slate-800 mb-1.5 leading-tight">{item.title}</h4>
                              <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
