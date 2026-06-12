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
    <div className="flex flex-col h-full bg-white relative max-w-2xl mx-auto w-full pb-20">
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-10 px-4 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Fikih & Panduan</h3>
          <p className="text-[11px] font-semibold text-slate-500">Tuntunan Ibadah Dasar</p>
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
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-[24px]">
                 <h4 className="font-serif font-bold text-[#0F4C3A] text-lg">Tuntunan Beribadah</h4>
                 <p className="text-xs text-emerald-800/80 font-medium mt-1">Panduan praktis syarat syukur menjadi hamba-Nya.</p>
              </div>
              
              <div className="grid gap-3">
                {guides.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveCategory(g.id)}
                    className="flex items-center gap-4 p-4 border border-slate-100 rounded-[20px] bg-white shadow-sm hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer text-left"
                  >
                    <div className={`w-12 h-12 flex justify-center items-center rounded-[14px] ${g.color}`}>
                      {g.icon}
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-slate-800">{g.title}</h4>
                       <p className="text-[11px] font-medium text-slate-500">{g.content.length} Poin Panduan</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
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
                className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold mb-4 ml-1 cursor-pointer hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali
              </button>
              
              {guides.filter(g => g.id === activeCategory).map(guide => (
                <div key={guide.id} className="flex flex-col gap-5">
                  <div className={`p-6 border rounded-[28px] ${guide.color} border-current/10`}>
                    <div className="flex items-center gap-3 mb-2">
                       {guide.icon}
                       <h3 className="font-bold text-lg">{guide.title}</h3>
                    </div>
                    <p className="text-[12px] opacity-80 font-medium">Langkah demi langkah menuju kesempurnaan beribadah.</p>
                  </div>

                  <div className="flex flex-col gap-3">
                     {guide.content.map((item, id) => (
                        <div key={item.title} className="bg-white border border-slate-100 rounded-[20px] p-4 flex gap-4">
                           <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                             {id + 1}
                           </span>
                           <div>
                              <h4 className="font-bold text-sm text-slate-800 mb-0.5">{item.title}</h4>
                              <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.desc}</p>
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
