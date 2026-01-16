import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from './navbar/navbar';
import ChatBot from './ChatBot'; 
import ActivityChart from './ActivityChart'; 
import TodoWidget from './TodoWidget'; 

export default function Dashboard() {
  const [data, setData] = useState(null); // เก็บข้อมูลที่ได้จาก API
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 💡 ดึงข้อมูลผู้ใช้
  const user = JSON.parse(localStorage.getItem('user_info')) || { first_name: 'ผู้ใช้', role: 'student' };

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // 💡 แยก Endpoint ตาม Role
      const endpoint = user.role === 'teacher' 
        ? 'http://localhost:8000/api/teacher/class-stats' 
        : 'http://localhost:8000/api/activities';

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setData(res.data);
    } catch (err) { 
      console.error("Fetch Data Error:", err); 
    } finally {
      setIsLoading(false);
    }
  }, [user.role]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const handleDataChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  // คำนวณชั่วโมงสำหรับนักศึกษา (ถ้าเป็น role student)
  const approvedHours = user.role === 'student' && Array.isArray(data)
    ? data.filter(act => act.status === 'อนุมัติแล้ว').reduce((sum, act) => sum + (Number(act.hours) || 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 mb-20">
        
        {/* --- 👨‍🏫 ส่วนของอาจารย์: แสดงสถิติเด็กในชั้นเรียน --- */}
        {user.role === 'teacher' ? (
          <div className="space-y-10">
            {/* Header สรุปภาพรวมของห้อง */}
            <header className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-indigo-600 p-10 md:p-14 rounded-[3.5rem] text-white shadow-xl shadow-indigo-200 animate-in fade-in slide-in-from-left-6 duration-1000">
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter italic">
                  Advisor : {user.first_name} 👋
                </h2>
                <p className="opacity-80 font-bold uppercase tracking-widest text-xs mb-8">
                  กลุ่มเรียนที่ดูแล: {data?.class_group || 'ยังไม่ระบุ'}
                </p>
                <div className="flex gap-12 border-t border-white/20 pt-8 font-black uppercase italic tracking-tighter">
                  <div>
                    <p className="text-4xl">{data?.total_students || 0}</p>
                    <p className="text-[10px] opacity-60">นักศึกษาทั้งหมด</p>
                  </div>
                  <div>
                    <p className="text-4xl text-green-300">{data?.passed_count || 0}</p>
                    <p className="text-[10px] opacity-60">ผ่านเกณฑ์แล้ว (50 ชม.)</p>
                  </div>
                </div>
              </div>

              {/* ปุ่มทางลัดไปหน้าสแกน */}
              <div onClick={() => window.location.href='/teacher/scanner'} className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 transition-all group">
                 <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                 </div>
                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Quick Scan</h3>
                 <p className="text-slate-400 text-xs mt-1 font-bold italic">เปิดกล้องสแกนให้นักศึกษา</p>
              </div>
            </header>

            {/* ตารางรายชื่อนักศึกษาในที่ปรึกษา */}
            <section className="bg-white p-10 rounded-[4rem] shadow-xl border border-slate-100">
              <h3 className="text-2xl font-black text-slate-800 mb-8 px-2 flex items-center gap-3 tracking-tighter italic">
                 <div className="w-2.5 h-8 bg-indigo-600 rounded-full"></div>
                 STUDENT LIST MONITORING
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.students?.map(student => (
                  <div key={student.id} className="p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-indigo-500 hover:bg-white transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm border border-slate-100">{student.full_name[0]}</div>
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${student.total_hours >= 50 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {student.status}
                      </div>
                    </div>
                    <p className="font-black text-slate-800 text-lg tracking-tight mb-1">{student.full_name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-5">Current: {student.total_hours} Hours</p>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                       <div className={`h-full transition-all duration-1000 ${student.total_hours >= 50 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-indigo-600'}`} style={{ width: `${student.progress_percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          
          /* --- 👨‍🎓 ส่วนของนักศึกษา: โชว์กราฟ + To-do (หน้าเดิมของคุณ) --- */
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 md:p-14 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col justify-center animate-in fade-in slide-in-from-left-6 duration-1000">
                <div className="flex items-center gap-3 mb-4 text-indigo-600 font-bold tracking-widest uppercase text-xs">
                   <span className="w-8 h-[2px] bg-indigo-600"></span>
                   Student Performance
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tighter italic">
                  สวัสดี, {user.first_name} 👋
                </h2>
                <div className="space-y-2">
                   <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium">
                     {approvedHours >= 50 
                       ? "ยอดเยี่ยมมาก! คุณสะสมชั่วโมงกิจกรรมครบตามเกณฑ์แล้ว" 
                       : `คุณสะสมไปแล้ว ${approvedHours} ชม. ขาดอีก ${Math.max(0, 50 - approvedHours)} ชม. จะผ่านเกณฑ์`}
                   </p>
                   <div className="w-full h-4 bg-slate-100 rounded-full mt-6 overflow-hidden border border-slate-50">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-1000 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                        style={{ width: `${Math.min(100, (approvedHours/50)*100)}%` }}
                      ></div>
                   </div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-6 duration-1000">
                 <ActivityChart approvedHours={approvedHours} />
                 <div className="mt-6 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Progress</p>
                    <p className="text-lg font-black text-indigo-600 mt-1">{Math.round((approvedHours/50)*100)}%</p>
                 </div>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
               <div className="flex items-center justify-between mb-8 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">TO-DO List</h3>
                      <p className="text-slate-400 text-sm font-medium italic">วางแผนและจัดการตารางเรียน/กิจกรรมของคุณ</p>
                    </div>
                  </div>
               </div>
               <TodoWidget onUpdate={handleDataChange} />
            </div>
          </div>
        )}
      </main>

      <ChatBot />
    </div>
  );
}