var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new import_genai.GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}
var V2_TO_V3_MAP = {
  "1301": "58a2fc6ed39fd083f55d4182bf88826d",
  // KOTA JAKARTA
  "1210": "c1f71dfbc62b7ff017f7872f0dbb2247",
  // KOTA BANDUNG
  "1638": "4734ba6f3de83d861c3176a6273cac6d",
  // KOTA SURABAYA
  "1430": "577ef1154f3240ad5b9b413aa7346a1e",
  // KOTA YOGYAKARTA
  "0115": "2838023a778dfaecdc212708f721b788",
  // KOTA MEDAN
  "2212": "b7b16ecf8ca53723593894116071700c",
  // KOTA MAKASSAR
  "1708": "6a9aeddfc689c1d0e3b9ccc3ab651bc5",
  // KOTA DENPASAR
  "1505": "e96ed478dab8595a7dbda4cbcbee168f",
  // KAB. SEMARANG
  "0814": "1afa34a7f984eeabdbb0a7d494132ee5",
  // KOTA PALEMBANG
  "1810": "00411460f7c92d2124a67ea0f4cb5f85",
  // KOTA BALIKPAPAN
  "2115": "550a141f12de6341fba65b0ad0433500"
  // KOTA MANADO
};
function resolveCityId(id) {
  if (V2_TO_V3_MAP[id]) {
    return V2_TO_V3_MAP[id];
  }
  if (/^\d+$/.test(id)) {
    return "58a2fc6ed39fd083f55d4182bf88826d";
  }
  return id;
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/sholat/kota/semua", async (req, res) => {
    try {
      const response = await fetch("https://api.myquran.com/v3/sholat/kota/semua");
      if (!response.ok) throw new Error("Gagal mengambil data kota");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  });
  app.get("/api/sholat/kota/cari/:query", async (req, res) => {
    try {
      const { query } = req.params;
      const response = await fetch(`https://api.myquran.com/v3/sholat/kota/cari/${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Gagal mencari kota");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  });
  app.get("/api/sholat/jadwal/:id_kota/:tahun/:bulan/:tanggal", async (req, res) => {
    try {
      const { id_kota, tahun, bulan, tanggal } = req.params;
      const resolvedId = resolveCityId(id_kota);
      const dateKey = `${tahun}-${bulan}-${tanggal}`;
      const response = await fetch(`https://api.myquran.com/v3/sholat/jadwal/${resolvedId}/${dateKey}`);
      if (!response.ok) throw new Error("Gagal mengambil jadwal sholat");
      const v3Data = await response.json();
      if (v3Data.status && v3Data.data?.jadwal) {
        const singleJadwal = v3Data.data.jadwal[dateKey];
        if (singleJadwal) {
          singleJadwal.date = dateKey;
          return res.json({
            status: true,
            message: "success",
            data: {
              id: v3Data.data.id,
              lokasi: v3Data.data.kabko,
              daerah: v3Data.data.prov,
              jadwal: singleJadwal
            }
          });
        }
      }
      throw new Error("Jadwal sholat tanggal tersebut tidak ditemukan");
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  });
  app.get("/api/sholat/jadwal/:id_kota/:tahun/:bulan", async (req, res) => {
    try {
      const { id_kota, tahun, bulan } = req.params;
      const resolvedId = resolveCityId(id_kota);
      const monthKey = `${tahun}-${bulan}`;
      const response = await fetch(`https://api.myquran.com/v3/sholat/jadwal/${resolvedId}/${monthKey}`);
      if (!response.ok) throw new Error("Gagal mengambil jadwal sholat bulanan");
      const v3Data = await response.json();
      if (v3Data.status && v3Data.data?.jadwal) {
        const list = Object.entries(v3Data.data.jadwal).map(([date, item]) => {
          return {
            ...item,
            date
          };
        });
        return res.json({
          status: true,
          message: "success",
          data: {
            id: v3Data.data.id,
            lokasi: v3Data.data.kabko,
            daerah: v3Data.data.prov,
            jadwal: list
          }
        });
      }
      throw new Error("Jadwal sholat bulanan tidak ditemukan");
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  });
  app.get("/api/quran/surah", async (req, res) => {
    try {
      const response = await fetch("https://api.quran.gading.dev/surah");
      if (!response.ok) throw new Error("Gagal mengambil daftar surah");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  });
  app.get("/api/quran/surah/:nomor", async (req, res) => {
    try {
      const { nomor } = req.params;
      const response = await fetch(`https://api.quran.gading.dev/surah/${nomor}`);
      if (!response.ok) throw new Error(`Gagal mengambil detail surah nomor ${nomor}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  });
  app.get("/api/quran/tafsir/:nomor", async (req, res) => {
    try {
      const { nomor } = req.params;
      const response = await fetch(`https://api.quran.gading.dev/surah/${nomor}`);
      if (!response.ok) throw new Error(`Gagal mengambil tafsir surah nomor ${nomor}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  });
  app.post("/api/ask-ai", async (req, res) => {
    try {
      const { prompt, verseText, context } = req.body;
      const client = getGeminiClient();
      if (!client) {
        return res.status(403).json({
          status: false,
          message: "Gemini API Key belum ditentukan. Harap tambahkan API Key di tab Secrets pada AI Studio.",
          isConfigured: false
        });
      }
      const queryPrompt = `
Konteks: ${context || "Tanya Umum tentang Al-Qur'an"}
${verseText ? `Ayat Al-Qur'an Yang Sedang Dibahas:
"${verseText}"` : ""}

Pertanyaan Pengguna:
${prompt}

Berikan tanggapan yang bijak, mendalam, dan membimbing dalam format Bahasa Indonesia yang indah.
Sebutkan referensi ayat jika relevan, gunakan kutipan yang bermakna, dan tulislah secara sopan, penuh kebaikan dan hikmah spiritual.
`;
      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: queryPrompt,
        config: {
          systemInstruction: "Anda adalah asisten AI 'Tanya Al-Qur'an' di dalam aplikasi 'Quran Saku' yang bijaksana, santun, ramah, dan berpengetahuan luas tentang Al-Qur'an, Tafsir, Doa, dan kehidupan spiritual Islami. Bantu pengguna menemukan ketenangan batin, hikmah ayat-ayat suci, dan penjelasan yang mendalam."
        }
      });
      res.json({
        status: true,
        answer: response.text,
        isConfigured: true
      });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Quran Saku] Fullstack server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
