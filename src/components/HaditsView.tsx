import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Book, Scroll, RefreshCw, AlertTriangle, BookOpenCheck } from "lucide-react";

interface HadithBook {
  id: string;
  name: string;
  available: number;
}

interface HadithDetail {
  number: number;
  arab: string;
  id: string;
}

interface HaditsViewProps {
  onBack?: () => void;
  addToast: (title: string, body: string, type: "success" | "info" | "warning" | "notification") => void;
}

export const HaditsView: React.FC<HaditsViewProps> = ({ onBack, addToast }) => {
  const [books, setBooks] = useState<HadithBook[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  
  const [selectedBook, setSelectedBook] = useState<HadithBook | null>(null);
  const [hadiths, setHadiths] = useState<HadithDetail[]>([]);
  const [isLoadingHadiths, setIsLoadingHadiths] = useState(false);
  
  // We fetch a simple range (1-50) for simplicity in demo
  const RANGE = "1-50";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("https://api.hadith.gading.dev/books");
        if (!res.ok) throw new Error();
        const payload = await res.json();
        
        if (payload.code === 200 && payload.data) {
          setBooks(payload.data);
        }
      } catch (err) {
        addToast("Gagal Memuat Kitab", "Periksa koneksi internet.", "warning");
      } finally {
        setIsLoadingBooks(false);
      }
    };
    fetchBooks();
  }, [addToast]);

  const handleSelectBook = async (book: HadithBook) => {
    setSelectedBook(book);
    setIsLoadingHadiths(true);
    setHadiths([]);
    
    try {
      const res = await fetch(`https://api.hadith.gading.dev/books/${book.id}?range=${RANGE}`);
      if (!res.ok) throw new Error();
      const payload = await res.json();
      
      if (payload.code === 200 && payload.data && payload.data.hadiths) {
        setHadiths(payload.data.hadiths);
      }
    } catch {
      addToast("Gagal Memuat Hadits", "Terjadi kesalahan koneksi.", "warning");
    } finally {
      setIsLoadingHadiths(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] relative max-w-2xl mx-auto w-full pb-20">
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-10 px-4 py-4 flex items-center gap-4">
        <button 
          onClick={() => {
            if (selectedBook) {
              setSelectedBook(null);
              setHadiths([]);
            } else if (onBack) {
              onBack();
            }
          }} 
          className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Kumpulan Hadits</h3>
          <p className="text-[11px] font-semibold text-slate-500">
            {selectedBook ? `Kitab ${selectedBook.name} (1-50)` : "Rujukan Sunnah Nabawiyyah"}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {!selectedBook ? (
            <motion.div
              key="books"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col items-center py-6 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center rotate-3 mb-4 border border-blue-100/50">
                  <Scroll className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-slate-800 text-xl">Kutubu Sittah</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">Perpustakaan kitab hadits Shahih & Sunan.</p>
              </div>

              {isLoadingBooks ? (
                <div className="flex justify-center p-10 text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
              ) : books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {books.map(book => (
                    <button
                      key={book.id}
                      onClick={() => handleSelectBook(book)}
                      className="bg-white border border-slate-100 p-4 rounded-[20px] text-left hover:border-blue-200 hover:shadow-sm transition-all focus:outline-none cursor-pointer flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                        <Book className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-700">{book.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-wider">{book.available.toLocaleString()} Hadits</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center p-10 text-slate-400 flex flex-col items-center">
                  <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm font-semibold">Gagal memuat daftar kitab.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="hadiths"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              {isLoadingHadiths ? (
                <div className="flex flex-col items-center justify-center py-20 text-blue-600">
                  <RefreshCw className="w-8 h-8 animate-spin opacity-50" />
                  <span className="text-xs font-bold mt-4 uppercase tracking-widest opacity-70">Menyusun Hadits...</span>
                </div>
              ) : hadiths.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {hadiths.map((h, i) => (
                    <div key={h.number} className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm">
                       <div className="flex items-center gap-2 mb-4">
                         <div className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-full border border-blue-100">
                           No. {h.number}
                         </div>
                       </div>
                       <p className="font-arabic text-2xl sm:text-3xl leading-loose text-right text-slate-800 mb-6 mt-2" dir="rtl">
                         {h.arab}
                       </p>
                       <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent my-4"></div>
                       <p className="text-sm text-slate-600 font-medium leading-relaxed">
                         "{h.id}"
                       </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-10 text-slate-400 flex flex-col items-center">
                   <p className="text-sm font-semibold hover:underline cursor-pointer" onClick={() => handleSelectBook(selectedBook)}>Gagal memuat/kosong. Coba lagi.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
