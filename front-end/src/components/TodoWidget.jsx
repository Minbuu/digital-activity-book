import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

export default function TodoWidget() {
  const [todos, setTodos] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskDay, setTaskDay] = useState("");
  const [taskMonth, setTaskMonth] = useState("");
  const [notifiedTasks, setNotifiedTasks] = useState([]);

  // 💡 State สำหรับ Modal
  const [modal, setModal] = useState({ show: false, message: "", type: "success" });
  const [deleteId, setDeleteId] = useState(null);

  // 💡 ตัวควบคุมเสียง (Ref) เพื่อให้สั่งหยุดจากที่ไหนก็ได้
  const audioRef = useRef(null);

  const currentYear = new Date().getFullYear();

  const fetchTodos = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  // 💡 ระบบแจ้งเตือนอัจฉริยะ: เด้ง Modal + เสียงวนลูป 🔊🔄
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      const currentDate = now.toISOString().split('T')[0];

      todos.forEach(todo => {
        if (
          todo.todo_date === currentDate &&
          todo.todo_time.substring(0, 5) === currentTime &&
          !notifiedTasks.includes(todo.id) &&
          todo.status === 'pending'
        ) {
          // 🔊 เริ่มเล่นเสียงและตั้งค่าให้ Loop
          if (!audioRef.current) {
            audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audioRef.current.loop = true; // 💡 สั่งให้วนลูป
            audioRef.current.volume = 0.6;
            audioRef.current.play().catch(e => console.log("ต้องการการคลิกหน้าเว็บก่อนเพื่อเล่นเสียง"));
          }

          triggerModal(`⏰ ถึงเวลาทำ: ${todo.title}`, "warning");
          setNotifiedTasks(prev => [...prev, todo.id]);
        }
      });
    }, 1000 * 20); // เช็คทุก 20 วินาที

    return () => clearInterval(timer);
  }, [todos, notifiedTasks]);

  const triggerModal = (msg, type) => {
    setModal({ show: true, message: msg, type: type });
    if (type === "success") {
      setTimeout(() => setModal({ show: false, message: "", type: "success" }), 2000);
    }
  };

  // 💡 ฟังก์ชันปิด Modal และหยุดเสียง
  const stopAlert = () => {
    if (audioRef.current) {
      audioRef.current.pause(); // หยุดเสียง
      audioRef.current.currentTime = 0; // รีเซ็ตเวลาเสียง
      audioRef.current = null; // ล้างค่า Ref
    }
    setModal({ show: false, message: "", type: "success" });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!taskName || !taskTime || !taskDay || !taskMonth) {
      return triggerModal("กรุณากรอกข้อมูลให้ครบถ้วนก่อนบันทึก!", "warning");
    }

    const formattedDate = `${currentYear}-${taskMonth.padStart(2, "0")}-${taskDay.padStart(2, "0")}`;
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/api/todos", 
        { title: taskName, todo_date: formattedDate, todo_time: taskTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      triggerModal("บันทึกข้อมูลสำเร็จ!", "success");
      setTaskName(""); setTaskTime(""); setTaskDay(""); setTaskMonth("");
      fetchTodos();
    } catch (err) { triggerModal("ระบบขัดข้อง บันทึกไม่สำเร็จ!", "warning"); }
  };

  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:8000/api/todos/${id}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos();
    } catch (err) { console.error(err); }
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/todos/${deleteId.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteId(null);
      fetchTodos();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="relative space-y-8 font-sans">
      
      {/* 🔴 1. Custom Confirm Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] animate-in fade-in zoom-in duration-300 px-4">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-rose-50 flex flex-col items-center w-full max-w-[450px] text-center relative z-20">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight uppercase">ยืนยันการลบ?</h3>
            <p className="text-slate-400 font-bold mb-8 italic leading-relaxed px-4">
              รายการ <span className="text-rose-500 not-italic">"{deleteId.title}"</span> จะหายไปถาวรเลยนะเพื่อน!
            </p>
            <div className="flex gap-4 w-full px-2">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95">ยกเลิก</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-rose-500 text-white font-black rounded-2xl shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-95">ลบเลย!</button>
            </div>
          </div>
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setDeleteId(null)}></div>
        </div>
      )}

      {/* 🟡 2. Alert Success & Warning Modal (Success นิ่ง / Warning มีปุ่มหยุดเสียง) */}
      {modal.show && (
        <div className="fixed inset-0 flex items-center justify-center z-[120] animate-in fade-in zoom-in duration-300 px-4">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-white flex flex-col items-center w-full max-w-[450px] text-center relative z-30">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${modal.type === "success" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
              {modal.type === "success" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              )}
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2 uppercase">{modal.message}</h3>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-6 leading-relaxed">Digital Activity Book</p>
            
            {modal.type === "warning" && (
              <button 
                onClick={stopAlert} 
                className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-3xl shadow-xl shadow-amber-100 transition-all active:scale-95 text-lg"
              >
                เข้าใจแล้วเพื่อน! (ปิดเสียง) 🔇
              </button>
            )}
          </div>
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"></div>
        </div>
      )}

      {/* Form Section */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="ลุยอะไรดีวันนี้..." value={taskName} onChange={(e) => setTaskName(e.target.value)} className="px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 font-bold" />
            <input type="time" value={taskTime} onChange={(e) => setTaskTime(e.target.value)} className="px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 font-bold" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <input type="number" placeholder="วันที่" min="1" max="31" value={taskDay} onChange={(e) => setTaskDay(e.target.value)} className="px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 font-bold" />
            <select value={taskMonth} onChange={(e) => setTaskMonth(e.target.value)} className="px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 font-bold">
              <option value="">เลือกเดือน</option>
              {["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."].map((m, i) => (<option key={i} value={i + 1}>{m}</option>))}
            </select>
            <div className="px-5 py-4 rounded-2xl bg-slate-100 text-slate-400 font-black flex items-center justify-center italic tracking-widest">{currentYear}</div>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 transform hover:-translate-y-1">บันทึกเป้าหมายลงฐานข้อมูล 💾</button>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-white overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">รายการ</th>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">เวลา</th>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {todos.length > 0 ? (
              todos.map((item) => (
                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 text-slate-700 font-bold">
                    <p className={`transition-all duration-500 ${item.status === "completed" ? "text-slate-300 line-through italic" : ""}`}>
                      {item.title}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-lg font-black text-[10px] tracking-tighter ${item.status === "completed" ? "bg-slate-100 text-slate-400" : "bg-indigo-50 text-indigo-600"}`}>
                      {item.todo_time.substring(0, 5)} น.
                    </span>
                  </td>
                  <td className="px-8 py-5 flex justify-end gap-2">
                    <button onClick={() => toggleStatus(item.id)} className={`p-2 rounded-xl transition-all ${item.status === "completed" ? "bg-green-500 text-white" : "bg-slate-50 text-slate-300 hover:text-green-500"}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </button>
                    <button onClick={() => setDeleteId({ id: item.id, title: item.title })} className="p-2 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all transform hover:rotate-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" className="px-8 py-20 text-center text-slate-300 font-bold italic tracking-tighter">ยังไม่มีรายการที่ต้องทำ... ✨</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}