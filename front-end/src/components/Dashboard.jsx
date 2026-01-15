import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar/navbar';
import ChatBot from './ChatBot'; 
import ActivityChart from './ActivityChart'; 
import TodoWidget from './TodoWidget'; 

export default function Dashboard() {
  const [approvedHours, setApprovedHours] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // ดึงข้อมูลผู้ใช้จาก localStorage
  const user = JSON.parse(localStorage.getItem('user_info')) || { first_name: 'นักศึกษา' };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/activities', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const total = res.data
          .filter(act => act.status === 'อนุมัติแล้ว') 
          .reduce((sum, act) => sum + act.hours, 0);
        
        setApprovedHours(total);
      } catch (err) { 
        console.error("Fetch Stats Error:", err); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* 1. Navbar: จัดการ Login/Logout และนำทาง */}
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 mb-20">
        
        {/* 2. Hero Section: สรุปชั่วโมงกิจกรรม */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white p-8 md:p-14 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col justify-center animate-in fade-in slide-in-from-left-6 duration-1000">
            <div className="flex items-center gap-3 mb-4 text-indigo-600 font-bold tracking-widest uppercase text-xs">
               <span className="w-8 h-[2px] bg-indigo-600"></span>
               Student Performance
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
              สวัสดี, {user.first_name} 👋
            </h2>
            <div className="space-y-2">
               <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium">
                 {approvedHours >= 50 
                   ? "ยอดเยี่ยมมาก! คุณสะสมชั่วโมงกิจกรรมครบตามเกณฑ์แล้ว" 
                   : `คุณสะสมไปแล้ว ${approvedHours} ชม. ขาดอีก ${Math.max(0, 50 - approvedHours)} ชม. จะผ่านเกณฑ์`}
               </p>
               {/* Progress Bar แสดงความก้าวหน้า */}
               <div className="w-full h-4 bg-slate-100 rounded-full mt-6 overflow-hidden border border-slate-50">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-1000 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)]"
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

        {/* 3. Todo Section: ระบบจัดการงานที่ต้องทำ (เพิ่ม-เก็บ-แสดงผล) */}
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
           <div className="flex items-center justify-between mb-8 px-6">
              <div className="flex items-center gap-4">
                <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">รายการที่ต้องทำ</h3>
                  <p className="text-slate-400 text-sm font-medium italic">วางแผนและจัดการตารางเรียน/กิจกรรมของคุณ</p>
                </div>
              </div>
           </div>

           {/* TodoWidget จะมีทั้งฟอร์มกรอกและตารางแสดงผลในตัวเดียว */}
           <TodoWidget />
        </div>
      </main>

      <ChatBot />
    </div>
  );
}