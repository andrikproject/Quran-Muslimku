import React, { useState, useEffect } from "react";
import { Compass, MapPin, AlertTriangle } from "lucide-react";

interface ArahKiblatViewProps {
  addToast: (title: string, body: string, type: "success" | "info" | "warning" | "notification") => void;
}

export const ArahKiblatView: React.FC<ArahKiblatViewProps> = ({ addToast }) => {
  const [heading, setHeading] = useState<number | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);

  useEffect(() => {
    // Basic coordinates of Kaaba
    const KAABA_LAT = 21.422487;
    const KAABA_LNG = 39.826206;

    const calculateQibla = (lat: number, lng: number) => {
      const phiK = (KAABA_LAT * Math.PI) / 180.0;
      const lambdaK = (KAABA_LNG * Math.PI) / 180.0;
      const phi = (lat * Math.PI) / 180.0;
      const lambda = (lng * Math.PI) / 180.0;

      const y = Math.sin(lambdaK - lambda);
      const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
      
      let qibla = (Math.atan2(y, x) * 180.0) / Math.PI;
      if (qibla < 0) qibla += 360;
      return qibla;
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let alpha = event.alpha;
      let webkitAlpha = (event as any).webkitCompassHeading;
      
      if (webkitAlpha !== undefined) {
         setHeading(webkitAlpha);
      } else if (alpha !== null) {
         // Android Chrome
         setHeading(360 - alpha);
      } else {
         setErrorStatus("Sensor tidak tersedia atau memerlukan izin Https.");
      }
    };

    // Attempt geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const qAngle = calculateQibla(pos.coords.latitude, pos.coords.longitude);
        setQiblaAngle(qAngle);
      }, () => {
        setErrorStatus("Izin lokasi dibatasi, sehingga Arah Kiblat tidak dapat ditentukan.");
      });
    }

    if (window.DeviceOrientationEvent) {
       // Request permission for iOS 13+ devices
       const doe = window.DeviceOrientationEvent as any;
       if (typeof doe.requestPermission === 'function') {
         // Needs to be triggered on a user interaction ideally
       } else {
         window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);
         // Fallback
         window.addEventListener('deviceorientation', handleOrientation, true);
       }
    } else {
       setErrorStatus("Device Anda tidak mendukung sensor kompas.");
    }

    return () => {
       window.removeEventListener('deviceorientationabsolute', handleOrientation as any, true);
       window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const requestIosCompassPermission = async () => {
     const doe = window.DeviceOrientationEvent as any;
     if (typeof doe.requestPermission === 'function') {
        try {
           const permissionState = await doe.requestPermission();
           if (permissionState === 'granted') {
             window.addEventListener('deviceorientation', (e: any) => {
                if (e.webkitCompassHeading !== undefined) {
                   setHeading(e.webkitCompassHeading);
                }
             });
             addToast("Izin Diberikan", "Kompas siap digunakan.", "success");
           } else {
             setErrorStatus("Izin kompas ditolak.");
           }
        } catch (e) {
             setErrorStatus("Sensor kompas hanya dapat diakses melalui HTTPS di perangkat keras asli.");
        }
     }
  };

  // The rotation to visually point to the Kaaba
  let compassRotation = 0;
  if (heading !== null && qiblaAngle !== null) {
     compassRotation = qiblaAngle - heading;
  }

  return (
    <div className="flex flex-col gap-6 items-center px-4 py-8 max-w-md mx-auto">
      <div className="flex flex-col items-center mb-2">
        <span className="text-[10px] font-extrabold text-slate-400 tracking-widest block uppercase mb-1">
          NAVIGASI
        </span>
        <h3 className="font-serif font-bold text-[#0F4C3A] text-2xl">Arah Kiblat</h3>
        <p className="text-xs text-slate-500 font-semibold mt-1 text-center">Petunjuk arah sholat</p>
      </div>

      <div className="bg-white border w-full border-slate-100 p-8 pt-10 rounded-[40px] shadow-sm flex flex-col items-center justify-center gap-8 relative overflow-hidden">
         {/* Compass visual element */}
         <div className="relative w-64 h-64 border-4 border-slate-100 rounded-full flex items-center justify-center bg-slate-50 shadow-inner">
            {/* North Indicator Fixed */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-red-500">U</div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">S</div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">B</div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">T</div>
            
            {/* Compass Base Ring (rotates to magnetic North) */}
            <div 
               className="absolute inset-2 border-[16px] border-emerald-50 rounded-full transition-transform duration-500" 
               style={{ transform: `rotate(${heading !== null ? -heading : 0}deg)` }}
            >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-400 rounded-full shadow-sm"></div>
            </div>

            {/* Qibla Pointer */}
            <div 
               className="w-10 h-32 absolute flex flex-col items-center transition-transform duration-500 ease-out origin-center"
               style={{ transform: `rotate(${compassRotation}deg)` }}
            >
               <div className="w-10 h-10 -ml-1 text-[#0F4C3A] rounded-full drop-shadow-md">
                   <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-12 h-12">
                     {/* Kaaba simple vector */}
                     <path d="M4 8l8-4 8 4v10l-8 4-8-4V8z" fill="#000000" />
                     <path d="M12 4L4 8v10l8 4v-18z" fill="#333333" />
                     <path d="M4 8l8 4 8-4-8-4-8 4z" fill="#111111" />
                     <path d="M8 7v4h8V7" fill="#EAAA00" stroke="#EAAA00" strokeWidth="0.5"/>
                   </svg>
               </div>
               <div className="w-1 h-32 bg-emerald-700 mt-1 opacity-80 rounded-full"></div>
            </div>

            {/* Center Pin */}
            <div className="absolute w-4 h-4 bg-white border-2 border-[#0F4C3A] rounded-full z-10 shadow"></div>
         </div>

         {errorStatus ? (
           <div className="text-center p-4 bg-amber-50 rounded-2xl flex flex-col items-center gap-2">
             <AlertTriangle className="w-5 h-5 text-amber-500" />
             <p className="text-xs font-bold text-amber-700">{errorStatus}</p>
             {typeof (window.DeviceOrientationEvent as any)?.requestPermission === 'function' && (
                <button onClick={requestIosCompassPermission} className="mt-2 text-xs bg-amber-200 text-amber-800 px-3 py-1.5 rounded-xl font-bold">
                  Beri Izin Sensor
                </button>
             )}
           </div>
         ) : qiblaAngle !== null && heading !== null ? (
           <div className="flex flex-col items-center">
             <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Sudut Kiblat: {Math.round(qiblaAngle)}°</span>
             </div>
           </div>
         ) : (
           <div className="text-xs font-bold text-slate-500 animate-pulse">
              Meminta izin akses sensor...
           </div>
         )}
      </div>

    </div>
  );
};
