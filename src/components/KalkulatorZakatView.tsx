import React, { useState } from "react";
import { ArrowLeft, Calculator, Coins, Info } from "lucide-react";
import { motion } from "motion/react";

interface KalkulatorZakatViewProps {
  onBack: () => void;
}

export const KalkulatorZakatView: React.FC<KalkulatorZakatViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<"profesi" | "maal">("profesi");
  
  // Zakat Profesi state
  const [pendapatan, setPendapatan] = useState("");
  const [bonus, setBonus] = useState("");

  // Zakat Maal state
  const [tabungan, setTabungan] = useState("");
  const [investasi, setInvestasi] = useState("");
  const [hutang, setHutang] = useState("");

  // Consts
  const HARGA_BERAS = 15000;
  const NISHAB_PROFESI = 85 * 1000000; // approximation
  const NISHAB_MAAL = 85 * 1000000;

  const hitungZakatProfesi = () => {
    const total = (Number(pendapatan) || 0) + (Number(bonus) || 0);
    // 2.5% per bulan
    return total * 0.025;
  };

  const hitungZakatMaal = () => {
    const total = (Number(tabungan) || 0) + (Number(investasi) || 0) - (Number(hutang) || 0);
    return Math.max(0, total * 0.025);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-slate-800">
      <div className="sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-slate-200/60 z-20 px-5 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 -ml-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-serif font-bold text-lg text-[#0F4C3A]">Kalkulator Zakat</h2>
      </div>

      <div className="p-5 max-w-2xl mx-auto w-full">
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
          <button
            onClick={() => setActiveTab("profesi")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition cursor-pointer ${
              activeTab === "profesi" ? "bg-white text-[#0F4C3A] shadow-sm" : "text-slate-500 hover:bg-slate-200"
            }`}
          >
            Zakat Profesi
          </button>
          <button
            onClick={() => setActiveTab("maal")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition cursor-pointer ${
              activeTab === "maal" ? "bg-white text-[#0F4C3A] shadow-sm" : "text-slate-500 hover:bg-slate-200"
            }`}
          >
            Zakat Maal
          </button>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
        >
          {activeTab === "profesi" ? (
            <div className="space-y-4">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl flex gap-3 text-sm mb-6">
                <Info className="w-5 h-5 flex-shrink-0" />
                <p>Nishab zakat profesi diasumsikan setara 85 gram emas per tahun. Jika penghasilan bulanan melebihinya, wajib dikeluarkan 2.5%.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Pendapatan Bulanan (Rutin)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                  <input
                    type="number"
                    value={pendapatan}
                    onChange={(e) => setPendapatan(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] transition font-mono"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Bonus / THP Tambahan (Opsional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                  <input
                    type="number"
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] transition font-mono"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-500 mb-2">Zakat yang harus dibayar (Per Bulan)</h4>
                <div className="text-3xl font-bold font-mono text-[#0F4C3A]">
                  {formatRupiah(hitungZakatProfesi())}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 text-amber-800 p-4 rounded-2xl flex gap-3 text-sm mb-6">
                <Info className="w-5 h-5 flex-shrink-0" />
                <p>Nishab zakat harta (maal) adalah 85 gram emas. Harta yang telah mengendap 1 tahun (haul) wajib dizakati 2.5%.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Tabungan / Uang Tunai</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                  <input
                    type="number"
                    value={tabungan}
                    onChange={(e) => setTabungan(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] transition font-mono"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Investasi / Emas (Estimasi Nilai)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                  <input
                    type="number"
                    value={investasi}
                    onChange={(e) => setInvestasi(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] transition font-mono"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Hutang Jatuh Tempo (Pengurang)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                  <input
                    type="number"
                    value={hutang}
                    onChange={(e) => setHutang(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition font-mono"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-500 mb-2">Zakat yang harus dibayar (Per Tahun)</h4>
                <div className="text-3xl font-bold font-mono text-[#0F4C3A]">
                  {formatRupiah(hitungZakatMaal())}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
