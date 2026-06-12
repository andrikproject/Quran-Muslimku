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
      title: "Kitab Thaharah (Bersuci)",
      icon: <Droplet className="w-5 h-5" />,
      color: "bg-blue-50 text-blue-700",
      content: [
        {
          title: "Macam-macam Air yang Boleh Untuk Bersuci",
          desc: "Air hujan, air laut, air sungai, air sumur, air mata air, air salju, dan air embun. Sesuai dengan pembagian air thohir muthohir (suci dan mensucikan).",
        },
        {
          title: "Hal yang Mewajibkan Mandi (Janabah)",
          desc: "Bertemunya dua khitan (bersetubuh), keluarnya mani, haid, nifas, melahirkan (wiladah), dan mati.",
        },
        {
          title: "Fardhu (Rukun) Wudhu Ada 6",
          desc: "1. Niat, 2. Membasuh muka, 3. Membasuh kedua tangan hingga siku, 4. Mengusap sebagian kepala, 5. Membasuh kedua kaki hingga mata kaki, 6. Tertib.",
        },
        {
          title: "Hal yang Membatalkan Wudhu",
          desc: "Keluarnya sesuatu dari Qubul/Dubur, hilangnya akal (tidur pulas/mabuk), bersentuhan kulit laki-laki dan perempuan bukan mahram tanpa penghalang, dan menyentuh kemaluan dengan telapak tangan.",
        },
        {
          title: "Syarat dan Rukun Tayammum",
          desc: "Syaratnya: Udzur karena safar/sakit, masuk waktu shalat, mencari air dahulu, ada debu yang suci. Rukunnya: Niat, mengusap wajah, mengusap kedua tangan sampai siku.",
        },
      ],
      reference: "Kitab Matan Abu Syuja' & Safinatun Naja",
    },
    {
      id: "sholat_wajib",
      title: "Kitab Shalat",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "bg-emerald-50 text-emerald-700",
      content: [
        {
          title: "Syarat Wajib & Sah Shalat",
          desc: "Syarat Wajib: Islam, baligh, berakal. Syarat Sah: Suci dari hadast dan najis, menutup aurat, berdiri di tempat suci, masuk waktu shalat, dan menghadap kiblat.",
        },
        {
          title: "Rukun Shalat (18 Rukun)",
          desc: "Niat, Takbiratul Ihram, Berdiri, Membaca Al-Fatihah, Ruku', Thuma'ninah ruku', I'tidal, Thuma'ninah I'tidal, Sujud 2 kali, Thuma'ninah sujud, Duduk antara 2 sujud, Thuma'ninah duduk, Tasyahud akhir, Duduk tasyahud akhir, Shalawat nabi, Salam pertama, Niat keluar shalat, Tertib.",
        },
        {
          title: "Hal yang Membatalkan Shalat",
          desc: "Berbicara dengan sengaja, bergerak berturut-turut (3 kali), berhadast, terkena najis, terbukanya aurat, berubah niat, membelakangi kiblat, makan, minum, tertawa, murtad.",
        },
        {
          title: "Sujud Sahwi",
          desc: "Disunnahkan apabila meninggalkan sunnah ab'adl (misal: qunut subuh, tasyahud awal) atau ragu dalam jumlah rakaat. Dilakukan sebelum salam.",
        },
      ],
      reference: "Kitab Matan Abu Syuja' & Safinatun Naja",
    },
    {
      id: "puasa",
      title: "Kitab Puasa",
      icon: <Star className="w-5 h-5" />,
      color: "bg-amber-50 text-amber-700",
      content: [
        {
          title: "Syarat Wajib Puasa Ramadhan",
          desc: "1. Islam, 2. Baligh, 3. Berakal, 4. Mampu berpuasa, 5. Sehat, 6. Mukim (bukan musafir).",
        },
        {
          title: "Syarat Sah & Rukun Puasa",
          desc: "Syarat Sah: Islam, berakal, suci dari haid/nifas, dan di waktu yang diperbolehkan puasa. Rukun: 1. Niat di malam hari (untuk puasa fardhu), 2. Menahan dari yang membatalkan puasa.",
        },
        {
          title: "Perkara yang Membatalkan Puasa",
          desc: "Memasukkan sesuatu ke rongga tubuh terbuka (mulut, hidung, telinga), muntah disengaja, jima' (bersetubuh) di siang hari, keluar mani dengan sengaja, haid, nifas, gila, murtad.",
        },
        {
          title: "Hari Diharamkannya Puasa",
          desc: "Hari raya Idul Fitri (1 Syawal), Idul Adha (10 Dzulhijjah), dan Hari-hari Tasyrik (11, 12, 13 Dzulhijjah). Serta puasa sunnah di hari Jumat tanpa diikuti hari sebelum/sesudahnya.",
        },
      ],
      reference: "Kitab Matan Abu Syuja', Fathul Qorib",
    },
    {
      id: "zakat",
      title: "Kitab Zakat",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "bg-indigo-50 text-indigo-700",
      content: [
        {
          title: "Zakat yang Wajib Dikeluarkan",
          desc: "Binatang ternak (unta, sapi, kambing), Emas dan Perak (juga emas batangan/uang), Harta perniagaan (tijarah), Hasil pertanian (zuru' wa tsimaar), dan Zakat Fitrah.",
        },
        {
          title: "Syarat Wajib Zakat Maal",
          desc: "Islam, merdeka, milik sempurna, mencapai satu nishab, dan telah berlalu satu tahun penuh (haul) kecuali pada tanaman/buah yang diwajibkan saat panen.",
        },
        {
          title: "Zakat Fitrah",
          desc: "Wajib di bulan Ramadhan bagi setiap jiwa muslim yang memiliki kelebihan makanan pokok pada malam Idul Fitri. Besarannya 1 sha' (± 2.5 - 2.7 kg makanan pokok).",
        },
        {
          title: "8 Asnaf (Penerima Zakat)",
          desc: "Fakir, Miskin, Amil, Muallaf, Riqab (memerdekakan budak), Gharim (yang terlilit hutang untuk maslahat), Fisabilillahi (Mujahid/kepentingan syi'ar Islam), Ibnu Sabil (Musafir kehabisan bekal).",
        },
      ],
      reference: "Kitab Matan Abu Syuja'",
    },
    {
      id: "jenazah",
      title: "Kitab Al-Janaiz",
      icon: <Droplet className="w-5 h-5" />,
      color: "bg-slate-50 text-slate-700",
      content: [
        {
          title: "Kewajiban Terhadap Jenazah Muslim",
          desc: "Hukumnya fardhu kifayah: Memandikan, Mengkafani, Menyolati, dan Menguburkan. Dikecualikan jenazah mati syahid yang gugur kewajiban mandi dan shalat.",
        },
        {
          title: "Memandikan Jenazah",
          desc: "Batas wajarnya minimal meratakan air ke seluruh badannya 1 kali. Kesempurnaannya membasuh tiga kali berturut-turut, diakhiri dengan campuran kapur barus.",
        },
        {
          title: "Mengkafani Jenazah",
          desc: "Laki-laki sunnah 3 lembar kain putih tanpa baju maupun sorban. Perempuan sunnah 5 lembar: kain basahan, baju kurung, khimar (kerudung), dan dua lembar kain bungkus.",
        },
        {
          title: "Shalat Jenazah",
          desc: "Rukunnya: Niat, berdiri, 4 kali takbir. Takbir 1: Al-Fatihah. Takbir 2: Shalawat Nabi. Takbir 3: Doa untuk mayit. Takbir 4: Doa penutup, lalu salam.",
        },
        {
          title: "Pemakaman Jenazah",
          desc: "Jenazah dimasukkan miring ke kanan dan wajah dihadapkan ke arah kiblat. Lubang kubur digali agar menahan bau keluarnya mayit dan mencegah digali binatang buas.",
        },
      ],
      reference: "Kitab Fathul Qorib",
    },
    {
      id: "haji_umrah",
      title: "Kitab Haji & Umrah",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "bg-teal-50 text-teal-700",
      content: [
        {
          title: "Syarat Wajib Haji & Umrah",
          desc: "1. Islam, 2. Baligh, 3. Berakal, 4. Merdeka, 5. Istitha'ah (mampu secara bekal, kendaraan, keamanan jalan, tubuh yang sehat).",
        },
        {
          title: "Rukun Haji (5 Rukun)",
          desc: "1. Ihram beserta niatnya, 2. Wukuf di padang Arafah (tanggal 9 Dzulhijjah), 3. Thawaf Ifadhah, 4. Sa'i antara Shafa dan Marwah, 5. Mencukur rambut.",
        },
        {
          title: "Wajib Haji",
          desc: "1. Ihram dari Miqat, 2. Mabit (bermalam) di Muzdalifah, 3. Mabit di Mina, 4. Melempar Jumrah (Aqabah, Ula, Wustha), 5. Menjauhi larangan ihram, 6. Thawaf Wada'.",
        },
        {
          title: "Rukun Umrah",
          desc: "Sama seperti haji tetapi tanpa Wukuf di Arafah. Rukun Umrah: Ihram, Thawaf, Sa'i, Bercukur, dan Tertib.",
        },
        {
          title: "Benda Larangan Saat Ihram",
          desc: "Laki-laki dilarang memakai pakaian berjahit dan tutup kepala. Perempuan dilarang menutup wajah dan sarung tangan. Semuanya dilarang memakai wangi-wangian, memotong rambut kuku, berburu, dan berjima'.",
        },
      ],
      reference: "Kitab Matan Abu Syuja'",
    },
    {
      id: "muamalah",
      title: "Kitab Al-Buyu' (Jual Beli)",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "bg-sky-50 text-sky-700",
      content: [
        {
          title: "Syarat Sah Jual Beli",
          desc: "Terdapat penjual dan pembeli (keduanya baligh & berakal), ada barang yang diperjualbelikan (suci, bermanfaat, bisa diserahterimakan, milik sah), ada ucapan Ijab & Qabul.",
        },
        {
          title: "Jual Beli yang Diharamkan",
          desc: "Jual beli najis (anjing, khamr), jual beli sperma hewan pejantan, jual beli anak hewan yang masih dalam janin, jual beli barang curian, dan transaksi yang mengandung Riba dan Gharar (ketidakpastian).",
        },
        {
          title: "Khiyar (Hak Memilih)",
          desc: "Penjual dan pembeli berhak memilih melanjutkan atau membatalkan akad. Jenis Khiyar: Khiyar Majlis (selama belum berpisah), Khiyar Syarat (maksimal 3 hari), Khiyar Aib (jika ada cacat yang disembunyikan).",
        },
      ],
      reference: "Kitab Fathul Mu'in & Matan Abu Syuja'",
    },
    {
      id: "munakahat",
      title: "Kitab Munakahat (Pernikahan)",
      icon: <Star className="w-5 h-5" />,
      color: "bg-pink-50 text-pink-700",
      content: [
        {
          title: "Rukun Nikah",
          desc: "1. Calon suami, 2. Calon istri, 3. Wali (dari pihak perempuan), 4. Dua orang saksi laki-laki yang adil, 5. Sighat Ijab & Qabul.",
        },
        {
          title: "Mahram (Orang yang Haram Dinikahi)",
          desc: "Nasab: Ibu, anak perempuan, saudara perempuan, keponakan, bibi. Persusuan: Ibu susu, dan saudara sepersusuan. Mushaharah (Pernikahan): Ibu mertua, anak tiri, menantu, istri bapak.",
        },
        {
          title: "Mahar (Mas Kawin)",
          desc: "Sesuatu yang wajib diberikan suami kepada istri dengan sebab akad nikah. Dianjurkan menyebutkan kadarnya saat akad, dan yang terbaik adalah yang tidak memberatkan.",
        },
        {
          title: "Talak & Iddah",
          desc: "Talak ada yang Raj'i (bisa rujuk) dan Ba'in (tidak bisa rujuk kecuali menikah baru atau ba'in kubra). Iddah wanita cerai (haid 3 quru'), wanita cerai mati (4 bulan 10 hari).",
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
