import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar/navbar';
import ChatBot from './ChatBot'; 
import ActivityChart from './ActivityChart'; 
import TodoWidget from './TodoWidget'; 

export default function Dashboard() {
  const [approvedHours, setApprovedHours] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // ดึงข้อมูลผู้ใช้จาก localStorage (ตรวจสอบ key ให้ตรงกับที่เก็บตอน Login)
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
      {/* 1. ส่วนแถบเมนู (Navbar) */}
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 mb-20">
        
        {/* 2. ส่วนสรุปผล (Hero Section) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* การ์ดทักทายแบบพรีเมียม */}
          <div className="lg:col-span-2 bg-white p-8 md:p-14 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col justify-center animate-in fade-in slide-in-from-left-6 duration-1000">
            <div className="flex items-center gap-3 mb-4 text-indigo-600 font-bold tracking-widest uppercase text-xs">
               <span className="w-8 h-[2px] bg-indigo-600"></span>
               Overview Report
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
              สวัสดี, {user.first_name} 👋
            </h2>
            <div className="space-y-2">
               <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
                 {approvedHours >= 50 
                   ? "ยินดีด้วย! คุณสะสมชั่วโมงครบถ้วนตามเกณฑ์ 50 ชั่วโมงแล้ว" 
                   : `คุณสะสมไปแล้ว ${approvedHours} ชม. ต้องการอีกเพียง ${Math.max(0, 50 - approvedHours)} ชม. เพื่อผ่านเกณฑ์กิจกรรม`}
               </p>
               {/* Progress Bar เล็กๆ เพิ่มความสวยงาม */}
               <div className="w-full h-3 bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-1000 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                    style={{ width: `${Math.min(100, (approvedHours/50)*100)}%` }}
                  ></div>
               </div>
            </div>
          </div>

          {/* การ์ดกราฟวงกลม */}
          <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-6 duration-1000">
             <ActivityChart approvedHours={approvedHours} />
             <div className="mt-6 text-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Activity Progress</p>
                <p className="text-sm font-bold text-indigo-600 mt-1">{Math.round((approvedHours/50)*100)}% Completed</p>
             </div>
          </div>
        </div>

        {/* 3. ส่วนรายการที่ต้องทำ (Todo List) */}
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
           <div className="flex items-center gap-4 mb-6 px-4">
              <div className="w-2.5 h-8 bg-indigo-600 rounded-full"></div>
              <h3 className="text-2xl font-black text-slate-800">จัดการงานสำคัญ</h3>
           </div>
           <TodoWidget />
        </div>
      </main>

      {/* 4. ผู้ช่วย AI (ChatBot) */}
      <ChatBot />
    </div>
  );
}