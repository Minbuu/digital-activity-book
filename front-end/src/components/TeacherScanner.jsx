import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import Navbar from './navbar/navbar';

export default function TeacherScanner() {
  const [modal, setModal] = useState({ show: false, message: '', type: 'success' });
  const scannerRef = useRef(null);

  const triggerModal = (msg, type) => {
    setModal({ show: true, message: msg, type: type });
    if (type === 'success') {
      setTimeout(() => setModal(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const startScanner = () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner('reader', {
        // 💡 ตั้งค่า qrbox ให้เป็นสี่เหลี่ยมจัตุรัส
        qrbox: { width: 220, height: 220 },
        fps: 20,
        aspectRatio: 1.0, // บังคับสัดส่วน 1:1
      });
    }
    scannerRef.current.render(onScanSuccess, onScanError);
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
      } catch (err) {
        console.error("Failed to clear scanner:", err);
      }
    }
  };

  async function onScanSuccess(result) {
    await stopScanner();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8000/api/approve-scanner', 
        { qr_data: result },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3').play();
      triggerModal(`เซ็นให้คุณ ${res.data.student_name} สำเร็จ! ✨`, "success");
    } catch (err) {
      triggerModal(err.response?.data?.message || "สแกนไม่สำเร็จ หรือข้อมูลไม่ถูกต้อง", "warning");
    }
    setTimeout(() => startScanner(), 3500);
  }

  function onScanError(err) { /* ค้นหา QR ต่อไป */ }

  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans relative overflow-x-hidden selection:bg-indigo-500/30">
      <Navbar />

      {/* 🟡 Modal แจ้งเตือน */}
      {modal.show && (
        <div className="fixed inset-0 flex items-center justify-center z-[120] animate-in fade-in zoom-in duration-300 px-4">
          <div className="bg-white p-10 rounded-[3rem] shadow-[0_0_60px_rgba(0,0,0,0.5)] w-full max-w-[420px] text-center relative z-30 border border-slate-100">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto ${modal.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                 {modal.type === 'success' ? <path d="M5 13l4 4L19 7" /> : <path d="M6 18L18 6M6 6l12 12" />}
               </svg>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-4">{modal.message}</h3>
            {modal.type === 'warning' && (
              <button onClick={() => { setModal({ ...modal, show: false }); startScanner(); }} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl">ลองอีกครั้ง</button>
            )}
          </div>
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"></div>
        </div>
      )}

      <main className="max-w-2xl mx-auto p-6 flex flex-col items-center justify-center min-h-[85vh] space-y-8 text-center">
        <header className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block border border-indigo-500/20 mb-2">Faculty Hub</div>
          <h2 className="text-4xl font-black tracking-tighter text-white uppercase">Scan Activity</h2>
          <p className="text-slate-500 font-medium italic text-sm">วาง QR Code ของนักศึกษาให้ตรงกับกรอบสแกน</p>
        </header>

        {/* 📷 ส่วนแสดงกล้อง (แก้ไขเป็นสี่เหลี่ยมจัตุรัสขอบโค้ง) */}
        <div className="relative w-full max-w-[320px] aspect-square group animate-in zoom-in duration-1000">
          {/* ขอบมุมสแกน (Corners) */}
          <div className="absolute -top-2 -left-2 w-10 h-10 border-t-4 border-l-4 border-indigo-500 rounded-tl-2xl z-20"></div>
          <div className="absolute -top-2 -right-2 w-10 h-10 border-t-4 border-r-4 border-indigo-500 rounded-tr-2xl z-20"></div>
          <div className="absolute -bottom-2 -left-2 w-10 h-10 border-b-4 border-l-4 border-indigo-500 rounded-bl-2xl z-20"></div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 border-b-4 border-r-4 border-indigo-500 rounded-br-2xl z-20"></div>
          
          {/* Container สำหรับกล้อง */}
          <div className="w-full h-full bg-slate-900 rounded-[2.5rem] overflow-hidden border-2 border-slate-800 shadow-[0_0_50px_rgba(79,70,229,0.2)] relative">
             <div id="reader" className="w-full h-full object-cover"></div>
             
             {/* เส้น Laser สแกนแบบใหม่ */}
             <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_#4f46e5] animate-[scan_2s_linear_infinite] z-10"></div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
           <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] bg-slate-900/80 px-5 py-2.5 rounded-full border border-slate-800">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              Lens Active
           </div>
        </div>
      </main>

      {/* เพิ่ม CSS Animation สำหรับเส้น Laser */}
      <style>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        #reader__dashboard_section_csr button {
          background-color: #4f46e5 !important;
          color: white !important;
          border-radius: 12px !important;
          padding: 8px 16px !important;
          font-weight: bold !important;
          border: none !important;
          margin-top: 10px !important;
        }
        #reader video {
          object-fit: cover !important;
          border-radius: 2rem !important;
        }
      `}</style>
    </div>
  );
}