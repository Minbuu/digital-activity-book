import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from './navbar/navbar';
import ChatBot from './ChatBot'; 
import ActivityChart from './ActivityChart'; 
import TodoWidget from './TodoWidget'; 

export default function Dashboard() {
  const [data, setData] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); 
  
  // 💡 State สำหรับ Modal ดูประวัติกิจกรรม
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user_info')) || { first_name: 'ผู้ใช้', role: 'student' };

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

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

  // 💡 ฟังก์ชันสำหรับกดดูประวัติกิจกรรมนักศึกษา
  const viewHistory = async (studentId) => {
    setIsHistoryLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8000/api/teacher/student-history/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentHistory(res.data.activities);
      setSelectedStudent(res.data.student_name);
    } catch (err) {
      console.error("View History Error:", err);
      alert("ไม่สามารถดึงข้อมูลกิจกรรมได้");
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleDataChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const filteredStudents = data?.students?.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  const approvedHours = user.role === 'student' && Array.isArray(data)
    ? data.filter(act => act.status === 'อนุมัติแล้ว').reduce((sum, act) => sum + (Number(act.hours) || 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 mb-20">
        
        {/* --- 👨‍🏫 VIEW: อาจารย์ (Advisor Dashboard) --- */}
        {user.role === 'teacher' ? (
          <div className="space-y-10">
            <header className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-indigo-600 p-10 md:p-14 rounded-[3.5rem] text-white shadow-xl shadow-indigo-200 animate-in fade-in slide-in-from-left-6 duration-1000">
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter italic leading-tight">
                  Advisor Console 👋
                </h2>
                <p className="opacity-80 font-bold uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
                   <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                   ดูแลนักศึกษาในที่ปรึกษาของ อ. {data?.teacher_name || user.first_name}
                </p>
                <div className="grid grid-cols-2 gap-8 border-t border-white/20 pt-8 font-black uppercase italic tracking-tighter">
                  <div>
                    <p className="text-5xl">{data?.total_students || 0}</p>
                    <p className="text-[10px] opacity-60 mt-1">นักศึกษาในความดูแล</p>
                  </div>
                  <div>
                    <p className="text-5xl text-green-300">{data?.passed_count || 0}</p>
                    <p className="text-[10px] opacity-60 mt-1">ผ่านเกณฑ์ (50 ชม.)</p>
                  </div>
                </div>
              </div>

              <div onClick={() => window.location.href='/teacher/scanner'} className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:-translate-y-2 transition-all duration-500 group">
                 <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                 </div>
                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Start Scanning</h3>
                 <p className="text-slate-400 text-[10px] mt-1 font-black uppercase tracking-widest opacity-60">ระบบเซ็นกิจกรรมดิจิทัล</p>
              </div>
            </header>

            <section className="bg-white p-8 md:p-12 rounded-[4rem] shadow-xl border border-slate-100">
              <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tighter italic">
                   <div className="w-2.5 h-8 bg-indigo-600 rounded-full"></div>
                   STUDENT LIST MONITORING
                </h3>
                <div className="relative w-full md:w-72">
                  <input 
                    type="text" 
                    placeholder="ค้นหาชื่อนักศึกษา..." 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents?.length > 0 ? (
                  filteredStudents.map(student => (
                    <div 
                      key={student.id} 
                      onClick={() => viewHistory(student.id)} // 💡 เพิ่ม Event คลิกที่นี่
                      className="p-7 rounded-[3rem] bg-slate-50/50 border border-slate-100 hover:border-indigo-500 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm border border-slate-100 group-hover:rotate-6 transition-transform">{student.full_name[0]}</div>
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${student.total_hours >= 50 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                          {student.status}
                        </div>
                      </div>
                      <p className="font-black text-slate-800 text-xl tracking-tight mb-1">{student.full_name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-6">Verified: {student.total_hours} Hours</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <span>Progress</span>
                          <span className="text-indigo-600 font-bold">{Math.round(student.progress_percent)}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                           <div 
                            className={`h-full transition-all duration-1000 rounded-full ${student.total_hours >= 50 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-indigo-600'}`} 
                            style={{ width: `${student.progress_percent}%` }}
                           ></div>
                        </div>
                      </div>
                      <div className="mt-4 text-[10px] font-bold text-indigo-500 text-center opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">คลิกเพื่อดูรายละเอียดกิจกรรม</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 italic font-bold text-slate-400">
                    ไม่พบข้อมูลนักศึกษา
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          /* --- 👨‍🎓 VIEW: นักศึกษา (หน้าเดิม) --- */
          <div className="space-y-8 animate-in fade-in duration-1000">
            {/* ... โค้ดส่วนนักศึกษาคงเดิม ... */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 md:p-14 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col justify-center">
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
                   <div className="w-full h-4 bg-slate-100 rounded-full mt-6 overflow-hidden border border-slate-50 shadow-inner">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-1000 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                        style={{ width: `${Math.min(100, (approvedHours/50)*100)}%` }}
                      ></div>
                   </div>
                </div>
              </div>
              <div className="bg-white p-10 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col items-center justify-center">
                 <ActivityChart approvedHours={approvedHours} />
              </div>
            </div>
            <TodoWidget onUpdate={handleDataChange} />
          </div>
        )}
      </main>

      {/* 📘 Modal แสดงประวัติกิจกรรมของนักศึกษาที่เลือก */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <header className="p-10 bg-indigo-600 text-white relative">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-8 right-8 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-all active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2 italic">Student Records</p>
              <h3 className="text-3xl font-black italic tracking-tighter uppercase">{selectedStudent}</h3>
            </header>

            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4 bg-slate-50/30">
              {isHistoryLoading ? (
                <div className="py-20 text-center font-black text-slate-400 italic">กำลังโหลดประวัติ...</div>
              ) : studentHistory.length > 0 ? (
                studentHistory.map(act => (
                  <div key={act.id} className="flex items-center justify-between p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm group hover:border-indigo-500 transition-all">
                    <div className="space-y-1">
                      <p className="font-black text-slate-800 text-lg tracking-tight group-hover:text-indigo-600 transition-colors">{act.title}</p>
                      <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                        <span>🗓️ {act.date}</span>
                        <span>⏱️ {act.hours} ชม.</span>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${act.status === 'อนุมัติแล้ว' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                      {act.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center font-black text-slate-400 italic uppercase tracking-widest">ไม่พบประวัติกิจกรรม</div>
              )}
            </div>
            
            <footer className="p-8 bg-slate-50 border-t border-slate-100 text-center">
               <button 
                onClick={() => setSelectedStudent(null)} 
                className="px-10 py-3 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
               >
                 Close Records
               </button>
            </footer>
          </div>
        </div>
      )}

      <ChatBot />
    </div>
  );
}