import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Droplet,
  Star,
} from "lucide-react";

interface FikihViewProps {
  onBack?: () => void;
}

export const FikihView: React.FC<FikihViewProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const guides = [
    {
      id: "wudhu",
      title: "Thaharah (Bersuci)",
      icon: <Droplet className="w-5 h-5" />,
      color: "bg-blue-50 text-blue-700",
      content: [
        {
          title: "Definisi Thaharah",
          desc: "Bersuci dari hadats (kecil dan besar) serta dari najis. Syarat mutlak sahnya sholat.",
        },
        {
          title: "Niat Wudhu",
          desc: "Membaca Bismillah dan berniat wudhu di dalam hati bersamaan dengan membasuh wajah.",
        },
        {
          title: "Rukun Wudhu",
          desc: "1. Niat, 2. Membasuh muka, 3. Membasuh kedua tangan hingga siku, 4. Mengusap sebagian kepala, 5. Membasuh kedua kaki hingga mata kaki, 6. Tertib (berurutan).",
        },
        {
          title: "Sunnah Wudhu",
          desc: "Membasuh telapak tangan, berkumur, istinsyaq (memasukkan air ke hidung), mengusap seluruh kepala, dan telinga.",
        },
        {
          title: "Mandi Wajib (Janabah)",
          desc: "1. Niat mandi wajib, 2. Meratakan air ke seluruh tubuh (kulit dan rambut) tanpa terkecuali.",
        },
        {
          title: "Tayammum",
          desc: "Bersuci menggunakan debu yang suci jika tidak ada air atau sakit. Rukunnya: Niat, mengusap wajah, dan mengusap kedua tangan hingga siku.",
        },
      ],
      reference: "Kitab Safinatun Naja & Fathul Qorib",
    },
    {
      id: "sholat_wajib",
      title: "Rukun & Syarat Sholat",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "bg-emerald-50 text-emerald-700",
      content: [
        {
          title: "Syarat Sah Sholat",
          desc: "1. Suci dari hadats dan najis, 2. Menutup aurat, 3. Masuk waktu sholat, 4. Menghadap Kiblat.",
        },
        {
          title: "Rukun Sholat",
          desc: "Berdiri (bagi yang mampu), Niat, Takbiratul Ihram, Membaca Al-Fatihah, Ruku', I'tidal, Sujud, Duduk di antara dua sujud, Tasyahud Akhir, Shalawat, Salam pertama, Tertib.",
        },
        {
          title: "Hal yang Membatalkan",
          desc: "Berbicara dengan sengaja, makan/minum, bergerak berturut-turut 3 kali (menurut mazhab Syafi'i), terkena najis, terbuka aurat secara sengaja, membelakangi kiblat.",
        },
        {
          title: "Sholat Jamaah",
          desc: "Sangat dianjurkan (Sunnah Muakkad/Fardhu Kifayah) dengan keutamaan 27 derajat dibanding sholat sendirian.",
        },
      ],
      reference: "Kitab Safinatun Naja & Al-Fiqh Al-Manhaji",
    },
    {
      id: "puasa",
      title: "Puasa (Shaum)",
      icon: <Star className="w-5 h-5" />,
      color: "bg-amber-50 text-amber-700",
      content: [
        {
          title: "Syarat Wajib",
          desc: "Islam, Baligh, Berakal, Mampu, Mukim (tidak musafir), Suci dari haid/nifas bagi wanita.",
        },
        {
          title: "Rukun Puasa",
          desc: "1. Niat (di malam hari untuk puasa wajib), 2. Menahan diri dari hal-hal yang membatalkan puasa mulai dari terbit fajar (shubuh) hingga terbenam matahari (maghrib).",
        },
        {
          title: "Yang Membatalkan",
          desc: "Makan/minum dengan sengaja, muntah disengaja, berhubungan suami istri di siang hari, keluarnya mani dengan sengaja, haid/nifas, gila, murtad.",
        },
        {
          title: "Hari Diharamkan Puasa",
          desc: "Hari Raya Idul Fitri (1 Syawal), Idul Adha (10 Dzulhijjah), dan Hari Tasyrik (11, 12, 13 Dzulhijjah).",
        },
      ],
      reference: "Kitab Fathul Qorib & Bulughul Maram",
    },
    {
      id: "zakat",
      title: "Zakat & Sedekah",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "bg-indigo-50 text-indigo-700",
      content: [
        {
          title: "Zakat Fitrah",
          desc: "Wajib bagi setiap Muslim sebelum sholat Idul Fitri. Besaran: 1 sha' (sekitar 2.5 - 2.7 kg) makanan pokok/beras.",
        },
        {
          title: "Zakat Maal",
          desc: "Zakat harta berupa emas, perak, uang, hewan ternak, hasil pertanian, dan perniagaan. Wajib jika mencapai Nishab dan Haul (1 tahun Qamariyah).",
        },
        {
          title: "Golongan Penerima (Asnaf)",
          desc: "Fakir, Miskin, Amil, Muallaf, Riqab (Hamba sahaya), Gharim (Orang berhutang), Fisabilillah, Ibnu Sabil (Musafir dalam ketaatan).",
        },
      ],
      reference: "Kitab Minhajut Thalibin",
    },
    {
      id: "jenazah",
      title: "Pengurusan Jenazah",
      icon: <Droplet className="w-5 h-5" />,
      color: "bg-slate-50 text-slate-700",
      content: [
        {
          title: "Hukum",
          desc: "Fardhu Kifayah. Gugur kewajibannya jika sebagian Muslim telah melaksanakannya.",
        },
        {
          title: "Memandikan Jenazah",
          desc: "Syarat: Jenazah seorang muslim, ada tubuhnya (sekalipun sedikit), bukan mati syahid. Diutamakan mencampurkan kapur barus/daun bidara.",
        },
        {
          title: "Mengkafani",
          desc: "Bagi laki-laki disunnahkan 3 lapis kain putih, bagi perempuan 5 lapis (kain basahan, baju kurung, kerudung, dan 2 lapis kain panjang).",
        },
        {
          title: "Sholat Jenazah",
          desc: "4 kali Takbir. Takbir 1: Al-Fatihah, Takbir 2: Shalawat Nabi, Takbir 3: Doa jenazah, Takbir 4: Doa penutup khusus, lalu Salam.",
        },
        {
          title: "Memakamkan",
          desc: "Wajib dikuburkan di kedalaman yang mencegah bau tercium dan aman dari binatang buas. Kepala jenazah diletakkan di utara menghadap kiblat.",
        },
      ],
      reference: "Kitab Fathul Mu'in",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FDFBF7] relative max-w-2xl mx-auto w-full pb-20">
      <div className="sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-slate-200/60 z-20 px-5 py-4 flex items-center gap-4">
        <button
          onClick={() => {
            if (activeCategory) {
              setActiveCategory(null);
            } else if (onBack) {
              onBack();
            }
          }}
          className="p-2 bg-white border border-slate-200 hover:bg-slate-50 hover:scale-105 rounded-full cursor-pointer transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-[#0F4C3A]" />
        </button>
        <div>
          <h3 className="font-bold text-[#0F4C3A] text-lg leading-tight">
            Fikih & Panduan
          </h3>
          <p className="text-[11px] font-bold text-emerald-700/70 uppercase tracking-widest mt-0.5">
            {activeCategory
              ? guides.find((g) => g.id === activeCategory)?.title
              : "Tuntunan Ibadah Dasar"}
          </p>
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
                <h4 className="font-serif font-bold text-[#ECC17A] text-xl relative z-10">
                  Tuntunan Beribadah
                </h4>
                <p className="text-xs text-emerald-100/80 font-medium mt-1.5 relative z-10 leading-relaxed max-w-[85%]">
                  Panduan praktis syarat syukur menjadi hamba-Nya. Pahami rukun
                  dan tata cara ibadah harian.
                </p>
              </div>

              <div className="grid gap-3.5 mt-2">
                {guides.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveCategory(g.id)}
                    className="flex items-center gap-4 p-4 border border-slate-200/60 rounded-[24px] bg-white shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer text-left group"
                  >
                    <div
                      className={`w-14 h-14 flex justify-center items-center rounded-2xl ${g.color} group-hover:scale-105 transition-transform`}
                    >
                      {g.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-[15px] group-hover:text-[#0F4C3A] transition-colors">
                        {g.title}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                        {g.content.length} POIN PANDUAN
                      </p>
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
              {guides
                .filter((g) => g.id === activeCategory)
                .map((guide) => (
                  <div key={guide.id} className="flex flex-col gap-6">
                    <div
                      className={`p-6 border rounded-[28px] ${guide.color} border-current/10 relative overflow-hidden`}
                    >
                      <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
                        {React.cloneElement(guide.icon as React.ReactElement<any>, {
                          className: "w-32 h-32",
                        })}
                      </div>
                      <div className="flex items-center gap-3 mb-3 relative z-10">
                        <div className="p-2 bg-white/40 backdrop-blur-sm rounded-xl">
                          {guide.icon}
                        </div>
                        <h3 className="font-bold text-xl">{guide.title}</h3>
                      </div>
                      <p className="text-[13px] opacity-90 font-medium relative z-10 leading-relaxed">
                        Langkah demi langkah menuju kesempurnaan beribadah
                        sesuai syariat.
                      </p>
                      {guide.reference && (
                        <div className="mt-4 pt-4 border-t border-current/10 relative z-10">
                          <p className="text-[11px] font-bold uppercase tracking-wider opacity-90 flex items-start sm:items-center gap-2">
                            <span className="shrink-0">📚 Referensi:</span>
                            <span className="opacity-100 flex-1 leading-snug break-words">
                              {guide.reference}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3.5">
                      {guide.content.map((item, id) => (
                        <div
                          key={item.title}
                          className="bg-white border border-slate-200/60 rounded-[24px] p-5 flex gap-4 shadow-sm hover:shadow-md transition-shadow group"
                        >
                          <span className="w-8 h-8 rounded-xl bg-[#FDFBF7] text-[#0F4C3A] border border-slate-200 font-bold text-sm flex items-center justify-center shrink-0 group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors">
                            {id + 1}
                          </span>
                          <div>
                            <h4 className="font-bold text-[15px] text-slate-800 mb-1.5 leading-tight">
                              {item.title}
                            </h4>
                            <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                              {item.desc}
                            </p>
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
