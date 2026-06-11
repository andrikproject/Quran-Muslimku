/**
 * @author Habib Ismail Al Qadri
 * @app Quran Saku
 */
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, Map, Clock, Bell, BellOff, Volume2, VolumeX, Check, ChevronRight } from "lucide-react";
import { SholatCity, PrayerSchedule } from "../types";
import { DEFAULT_CITIES } from "../data";

interface SholatWidgetProps {
  addToast: (title: string, body: string, type: "success" | "info" | "warning" | "notification") => void;
}

export const JadwalSholatWidget: React.FC<SholatWidgetProps> = ({ addToast }) => {
  // Cities selection
  const [selectedCity, setSelectedCity] = useState<SholatCity>(() => {
    try {
      const saved = localStorage.getItem("qd_selectedCity");
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return { id: "1301", lokasi: "KOTA JAKARTA" };
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SholatCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("qd_selectedCity", JSON.stringify(selectedCity));
  }, [selectedCity]);

  // Prayer schedules
  const [schedule, setSchedule] = useState<PrayerSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Notifications toggles
  const [notifiedPrayers, setNotifiedPrayers] = useState<{ [key: string]: boolean }>({
    subuh: true,
    dzuhur: true,
    ashar: true,
    maghrib: true,
    isya: true
  });

  // Countdown timers
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextSholat, setNextSholat] = useState<{ name: string; time: string; remaining: string } | null>(null);

  // Resolving IDs mapping for MyQuran API v2 to v3
  const resolveCityId = (id: string): string => {
    const V2_TO_V3_MAP: Record<string, string> = {
      "1301": "58a2fc6ed39fd083f55d4182bf88826d", // KOTA JAKARTA
      "1210": "c1f71dfbc62b7ff017f7872f0dbb2247", // KOTA BANDUNG
      "1638": "4734ba6f3de83d861c3176a6273cac6d", // KOTA SURABAYA
      "1430": "577ef1154f3240ad5b9b413aa7346a1e", // KOTA YOGYAKARTA
      "0115": "2838023a778dfaecdc212708f721b788", // KOTA MEDAN
      "2212": "b7b16ecf8ca53723593894116071700c", // KOTA MAKASSAR
      "1708": "6a9aeddfc689c1d0e3b9ccc3ab651bc5", // KOTA DENPASAR
      "1505": "e96ed478dab8595a7dbda4cbcbee168f", // KAB. SEMARANG
      "0814": "1afa34a7f984eeabdbb0a7d494132ee5", // KOTA PALEMBANG
      "1810": "00411460f7c92d2124a67ea0f4cb5f85", // KOTA BALIKPAPAN
      "2115": "550a141f12de6341fba65b0ad0433500"  // KOTA MANADO
    };
    return V2_TO_V3_MAP[id] || ( /^\d+$/.test(id) ? "58a2fc6ed39fd083f55d4182bf88826d" : id );
  };

  // Fetch sholat schedule
  const fetchSchedule = async (cityId: string) => {
    setIsLoading(true);
    try {
      const now = new Date();
      const yr = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, "0");
      const dy = String(now.getDate()).padStart(2, "0");
      const dateKey = `${yr}-${mo}-${dy}`;

      const resolvedId = resolveCityId(cityId);
      const response = await fetch(`https://api.myquran.com/v3/sholat/jadwal/${resolvedId}/${dateKey}`);
      if (!response.ok) throw new Error("Gagal mengunduh jadwal");
      
      const payload = await response.json();
      if (payload.status && payload.data?.jadwal) {
        // v3 wrapper returns objects by date key inside jadwal
        setSchedule(payload.data.jadwal[dateKey] || Object.values(payload.data.jadwal)[0]);
      } else {
        // Fallback mocked schedule in case API is down for some reason
        const mock: PrayerSchedule = {
          tanggal: `${dy}/${mo}/${yr}`,
          imsak: "04:31",
          subuh: "04:41",
          terbit: "05:58",
          dhuha: "06:26",
          dzuhur: "11:58",
          ashar: "15:19",
          maghrib: "17:51",
          isya: "19:05",
          date: `${yr}-${mo}-${dy}`
        };
        setSchedule(mock);
      }
    } catch (err) {
      console.error(err);
      // fallback
      const now = new Date();
      const mock: PrayerSchedule = {
        tanggal: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`,
        imsak: "04:31",
        subuh: "04:41",
        terbit: "05:58",
        dhuha: "06:26",
        dzuhur: "11:58",
        ashar: "15:19",
        maghrib: "17:51",
        isya: "19:05",
        date: "2026-06-11"
      };
      setSchedule(mock);
    } finally {
      setIsLoading(false);
    }
  };

  // Run on city change
  useEffect(() => {
    fetchSchedule(selectedCity.id);
  }, [selectedCity]);

  // Handle live clock & next sholat countdown calculation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Recalculate next prayer when clock or schedule updates
  useEffect(() => {
    if (!schedule) {
      setNextSholat(null);
      return;
    }

    const prayerTimes = [
      { name: "Imsak", time: schedule.imsak },
      { name: "Subuh", time: schedule.subuh },
      { name: "Terbit", time: schedule.terbit },
      { name: "Dhuha", time: schedule.dhuha },
      { name: "Dzuhur", time: schedule.dzuhur },
      { name: "Ashar", time: schedule.ashar },
      { name: "Maghrib", time: schedule.maghrib },
      { name: "Isya", time: schedule.isya }
    ];

    const now = new Date();
    const currentHrs = now.getHours();
    const currentMins = now.getMinutes();
    const currentSecs = now.getSeconds();
    const currentTotalSecs = currentHrs * 3600 + currentMins * 60 + currentSecs;

    let targetSholat = null;

    // Find the next sholat today
    for (const p of prayerTimes) {
      if (!p.time) continue;
      const [shours, sminutes] = p.time.split(":").map(Number);
      const targetTotalSecs = shours * 3600 + sminutes * 60;

      if (targetTotalSecs > currentTotalSecs) {
        const diff = targetTotalSecs - currentTotalSecs;
        const hr = Math.floor(diff / 3600);
        const mn = Math.floor((diff % 3600) / 60);
        const sc = diff % 60;
        
        targetSholat = {
          name: p.name,
          time: p.time,
          remaining: `${String(hr).padStart(2, "0")}:${String(mn).padStart(2, "0")}:${String(sc).padStart(2, "0")}`
        };
        break;
      }
    }

    // If none found, next is tomorrow's Imsak/Subuh
    if (!targetSholat) {
      const [shours, sminutes] = schedule.subuh.split(":").map(Number);
      const targetTotalSecs = shours * 3600 + sminutes * 60 + 24 * 3600; // Tomorrow
      const diff = targetTotalSecs - currentTotalSecs;
      const hr = Math.floor(diff / 3600);
      const mn = Math.floor((diff % 3600) / 60);
      const sc = diff % 60;

      targetSholat = {
        name: "Subuh (Esok Hari)",
        time: schedule.subuh,
        remaining: `${String(hr).padStart(2, "0")}:${String(mn).padStart(2, "0")}:${String(sc).padStart(2, "0")}`
      };
    }

    setNextSholat(targetSholat);

    // Dynamic notification trigger on precise target sholat
    // Check if remaining says "00:00:01"
    if (targetSholat.remaining === "00:00:01" || targetSholat.remaining === "00:00:00") {
      const canonicalName = targetSholat.name.toLowerCase();
      if (notifiedPrayers[canonicalName]) {
        // Trigger push-like adhan
        addToast(
          `⏱️ Waktu Sholat Tiba!`,
          `Saatnya menunaikan ibadah Sholat ${targetSholat.name} untuk wilayah ${selectedCity.lokasi}. Mari bersiap menghadap-Nya.`,
          "notification"
        );
        // Play sweet notification tone (synthesized or direct audiotone)
        playAdhanTone();
      }
    }
  }, [currentTime, schedule, notifiedPrayers, selectedCity]);

  // Audio synthe-tone generator for adhan notification (safe without remote URLs)
  const playAdhanTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const tones = [261.63, 329.63, 392.00, 523.25]; // C E G C chord
      tones.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0 + idx * 0.5);
        osc.start(ctx.currentTime + idx * 0.3);
        osc.stop(ctx.currentTime + 3.0 + idx * 0.5);
      });
    } catch (e) {
      console.warn("Audio Context blocked", e);
    }
  };

  // Searching cities
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://api.myquran.com/v3/sholat/kota/cari/${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error();
      const payload = await response.json();
      if (payload.status && Array.isArray(payload.data)) {
        // Adapt v3 format to our expected data array
        const normalizedData = payload.data.map((c: any) => ({
          id: c.id,
          lokasi: c.lokasi || c.kabko // v3 sometimes uses kabko or lokasi
        }));
        setSearchResults(normalizedData);
      } else {
        setSearchResults([]);
        addToast("Kota Tidak Ditemukan", "Coba gunakan kata kunci kota lain di Indonesia.", "warning");
      }
    } catch {
      setSearchResults([]);
      addToast("Gangguan Pencarian", "Gagal memproses pencarian kota dari server.", "warning");
    } finally {
      setIsSearching(false);
    }
  };

  const selectCityHandler = (city: SholatCity) => {
    setSelectedCity(city);
    localStorage.setItem("qd_has_located", "1");
    setShowSearchModal(false);
    setSearchQuery("");
    setSearchResults([]);
    addToast("Kota Diperbarui", `Menampilkan jadwal sholat untuk ${city.lokasi}`, "success");
  };

  const getGPSLocation = (silent: boolean = false) => {
    if (!navigator.geolocation) {
      if (!silent) addToast("Tidak Didukung", "Fitur GPS tidak didukung browser Anda.", "warning");
      return;
    }

    if (!silent) addToast("Mencari Lokasi GPS...", "Mengakses koordinat satelit peranti Anda...", "info");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // fetch accurate locality/city from bigdatacloud open api
          const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=id`);
          if (!r.ok) throw new Error();
          const data = await r.json();
          let cityName = data.city || data.locality || data.principalSubdivision || "Jakarta";
          
          cityName = cityName.replace(/Kabupaten|Kota|Kab\./gi, "").trim();

          // Search MyQuran API with that string
          const s = await fetch(`https://api.myquran.com/v3/sholat/kota/cari/${encodeURIComponent(cityName)}`);
          if (!s.ok) throw new Error();
          const sData = await s.json();
          
          if (sData.status && Array.isArray(sData.data) && sData.data.length > 0) {
            const result = sData.data[0];
            setSelectedCity({
              id: result.id,
              lokasi: result.lokasi || result.kabko
            });
            localStorage.setItem("qd_has_located", "1");
            if (!silent) addToast("GPS Terkunci!", `Berhasil menemukan wilayah GPS: ${result.lokasi || result.kabko}.`, "success");
          } else {
             // Fallback
             setSelectedCity({ id: "1301", lokasi: "KOTA JAKARTA (GPS)" });
             localStorage.setItem("qd_has_located", "1");
             if (!silent) addToast("Lokasi Default", "Kota spesifik tidak ditemukan di database jadwal sholat, menggunakan Jakarta.", "info");
          }
        } catch (err) {
          if (!silent) addToast("GPS Terkunci", "Menggunakan koordinat tapi gagal menentukan kota, fallback ke Jakarta.", "success");
          setSelectedCity({ id: "1301", lokasi: "KOTA JAKARTA (GPS)" });
          localStorage.setItem("qd_has_located", "1");
        }
      },
      (err) => {
        if (!silent) addToast("GPS Gagal", "Harap izinkan hak akses peta atau tulis kota secara manual.", "warning");
      }
    );
  };

  const getIPLocation = async () => {
    try {
      const r = await fetch("https://api.bigdatacloud.net/data/reverse-geocode-client");
      if (!r.ok) return;
      const data = await r.json();
      
      const keywords = [];
      if (data.city) keywords.push(data.city.replace(/Kabupaten|Kota|Kab\./gi, "").trim());
      if (data.locality) keywords.push(data.locality.replace(/Kabupaten|Kota|Kab\./gi, "").trim());
      
      let foundCity = null;

      for (const kw of keywords) {
        if (!kw) continue;
        const s = await fetch(`https://api.myquran.com/v3/sholat/kota/cari/${encodeURIComponent(kw)}`);
        if (!s.ok) continue;
        const sData = await s.json();
        if (sData.status && Array.isArray(sData.data) && sData.data.length > 0) {
          foundCity = sData.data[0];
          break;
        }
      }

      if (foundCity) {
        setSelectedCity({
          id: foundCity.id,
          lokasi: foundCity.lokasi || foundCity.kabko
        });
        localStorage.setItem("qd_has_located", "1");
        addToast("Lokasi Terdeteksi", `Menggunakan lokasi perkiraan: ${foundCity.lokasi || foundCity.kabko}`, "info");
      }
    } catch (e) {
      // fail silently
    }
  };

  useEffect(() => {
    // Attempt Auto-Locate if permitted, but ONLY if we haven't already located
    // or if the user hasn't explicitly selected a city yet.
    const hasLocated = localStorage.getItem("qd_has_located");
    if (hasLocated === "1") return;

    if (navigator.permissions && navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted') {
          getGPSLocation(true);
        } else {
          getIPLocation();
        }
      }).catch(() => {
        getIPLocation();
      });
    } else {
      getIPLocation();
    }
  }, []);

  const togglePrayerNotification = (prayer: string) => {
    setNotifiedPrayers((prev) => {
      const updated = { ...prev, [prayer]: !prev[prayer] };
      addToast(
        updated[prayer] ? "Alarm Aktif" : "Alarm Dimatikan",
        `Pengingat adzan Sholat ${prayer.toUpperCase()} sekarang ${updated[prayer] ? "aktif" : "nonaktif"}.`,
        "info"
      );
      return updated;
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col gap-6">
      {/* Header section: Selected Location, Live countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-800">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5/2">
              <span className="text-xs font-bold text-slate-400 tracking-wider">WILAYAH</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1">
              {selectedCity.lokasi}
              <button
                onClick={() => setShowSearchModal(true)}
                className="text-xs text-emerald-600 hover:text-emerald-800 underline font-medium ml-2 cursor-pointer focus:outline-none"
              >
                Ganti Kota
              </button>
            </h3>
          </div>
        </div>

        {/* Live timer / countdown badge */}
        {nextSholat && (
          <div className="bg-[#0F4C3A] text-white rounded-2xl p-4 flex items-center gap-4 shadow-lg shadow-emerald-950/10">
            <div className="p-2 bg-white/10 rounded-xl">
              <Clock className="w-5 h-5 text-[#ECC17A]" />
            </div>
            <div>
              <p className="text-[10px] text-teal-100 font-bold tracking-wider">
                BERIKUTNYA: SHOLAT {nextSholat.name.toUpperCase()}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-mono font-bold tracking-tight text-[#ECC17A]">
                  {nextSholat.remaining}
                </span>
                <span className="text-xs text-white/70 italic">({nextSholat.time})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid of prayer schedule items */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400 select-none">
          <Clock className="w-10 h-10 animate-spin text-emerald-800" />
          <p className="text-sm font-medium">Memuat jadwal waktu sholat kota...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { tag: "Imsak", time: schedule?.imsak, canon: "imsak" },
            { tag: "Subuh", time: schedule?.subuh, canon: "subuh" },
            { tag: "Terbit", time: schedule?.terbit, canon: "terbit" },
            { tag: "Dhuha", time: schedule?.dhuha, canon: "dhuha" },
            { tag: "Dzuhur", time: schedule?.dzuhur, canon: "dzuhur" },
            { tag: "Ashar", time: schedule?.ashar, canon: "ashar" },
            { tag: "Maghrib", time: schedule?.maghrib, canon: "maghrib" },
            { tag: "Isya", time: schedule?.isya, canon: "isya" }
          ].map((item) => {
            const isNext = nextSholat && nextSholat.name === item.tag;
            const hasNotify = notifiedPrayers[item.canon];

            return (
              <motion.div
                key={item.tag}
                whileHover={{ y: -3 }}
                className={`relative px-3.5 py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center justify-between ${
                  isNext
                    ? "bg-emerald-50/70 border-emerald-500 shadow-sm"
                    : "bg-slate-50/50 border-slate-100"
                }`}
              >
                {/* Active Next Indicator Badge */}
                {isNext && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[8px] font-bold tracking-wide shadow-sm">
                    AKTIF
                  </span>
                )}

                <span className="text-xs font-semibold text-slate-500">{item.tag}</span>
                <span className={`text-lg font-bold font-mono my-2 ${isNext ? "text-[#0F4C3A]" : "text-slate-800"}`}>
                  {item.time || "--:--"}
                </span>

                {/* Alarm notification toggle icon button */}
                {["subuh", "dzuhur", "ashar", "maghrib", "isya"].includes(item.canon) ? (
                  <button
                    onClick={() => togglePrayerNotification(item.canon)}
                    className={`mt-1 p-1.5 rounded-full transition-colors cursor-pointer ${
                      hasNotify
                        ? "bg-emerald-100 text-[#0F4C3A] hover:bg-emerald-200"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    {hasNotify ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                  </button>
                ) : (
                  <span className="h-6.5 text-[8px] text-slate-300 flex items-center">-</span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Action panel */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-4 rounded-2xl">
        <div className="flex-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-slate-700">Notifikasi Otomatis Pengingat Adzan</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Aplikasi melalukan hit mingguan jadwal sholat dan memicu notifikasi adzan di latar belakang.
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto justify-center">
          <button
            onClick={getGPSLocation}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer rounded-xl text-slate-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors w-full xs:w-auto"
          >
            <Map className="w-4 h-4 text-emerald-700" />
            Gunakan GPS Anda
          </button>
          <button
            onClick={() => setShowSearchModal(true)}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-950 text-white cursor-pointer rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow w-full xs:w-auto"
          >
            <Search className="w-4 h-4" />
            Cari Kota
          </button>
        </div>
      </div>

      {/* Elegant Modal: Change City Search */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showSearchModal && (
            <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 z-[90]">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-lg font-serif font-bold text-[#0F4C3A]">Pilih Kota & Waktu</h3>
                  <button
                    onClick={() => {
                      setShowSearchModal(false);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="text-slate-400 hover:text-slate-600 font-bold p-1 hover:bg-slate-50 rounded-lg text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* Form Search */}
                <form onSubmit={handleSearch} className="p-6 pb-4 flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Contoh: Jakarta, Surabaya, Bandung..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-4 py-2.5 bg-[#0F4C3A] hover:bg-emerald-900 transition-colors text-white rounded-xl text-sm font-bold flex items-center"
                  >
                    {isSearching ? "Cari..." : "Cari"}
                  </button>
                </form>

                {/* Scrollable listing of cities */}
                <div className="flex-1 overflow-y-auto p-6 pt-0 flex flex-col gap-2">
                  {searchResults.length > 0 ? (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 tracking-wider mb-2">HASIL PENCARIAN</h4>
                      <div className="flex flex-col gap-1.5/2">
                        {searchResults.map((city) => (
                          <button
                            key={city.id}
                            onClick={() => selectCityHandler(city)}
                            className="w-full text-left px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 text-slate-700 text-sm font-medium transition-all flex items-center justify-between"
                          >
                            <span>{city.lokasi}</span>
                            <ChevronRight className="w-4 h-4 text-emerald-800" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 tracking-wider mb-2.5">KOTA TERPOPULER</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {DEFAULT_CITIES.map((city) => {
                          const isCurrent = city.id === selectedCity.id;
                          return (
                            <button
                              key={city.id}
                              onClick={() => selectCityHandler(city)}
                              className={`text-left p-3 rounded-xl border transition-all text-xs font-bold flex items-center justify-between ${
                                isCurrent
                                  ? "bg-emerald-100/60 border-emerald-300 text-[#0F4C3A]"
                                  : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-600"
                              }`}
                            >
                              <span className="truncate">{city.lokasi.replace("KOTA ", "")}</span>
                              {isCurrent && <Check className="w-3.5 h-3.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
