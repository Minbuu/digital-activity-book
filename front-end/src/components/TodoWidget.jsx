import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TodoWidget() {
  const [todos, setTodos] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. ดึงข้อมูล To-do จาก API (หรือ LocalStorage ถ้ายังไม่มี Backend)
  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      // สมมติว่ามี API: /api/todos
      const res = await axios.get('http://localhost:8000/api/todos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(res.data);
    } catch (err) {
      console.error("Fetch Error: ถ้ายังไม่มี API จะ Error ตรงนี้", err);
      // Fallback: ดึงจาก LocalStorage สำหรับทดสอบ UI
      const localData = JSON.parse(localStorage.getItem('my_todos')) || [];
      setTodos(localData);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. ฟังก์ชันเพิ่มรายการ
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!taskName || !taskTime) return alert("กรุณากรอกข้อมูลให้ครบ!");

    setLoading(true);
    const newTodo = { id: Date.now(), title: taskName, time: taskTime, completed: false };

    try {
      const token = localStorage.getItem('token');
      // ส่งไปที่ API
      await axios.post('http://localhost:8000/api/todos', newTodo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTodos();
    } catch (err) {
      // Fallback: บันทึกลง LocalStorage ถ้า API ยังไม่พร้อม
      const updatedTodos = [...todos, newTodo];
      localStorage.setItem('my_todos', JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
    } finally {
      setTaskName('');
      setTaskTime('');
      setLoading(false);
    }
  };

  // 3. ฟังก์ชันลบรายการ
  const deleteTodo = (id) => {
    const updated = todos.filter(t => t.id !== id);
    setTodos(updated);
    localStorage.setItem('my_todos', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      {/* --- ส่วนฟอร์มเพิ่ม To-do --- */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-indigo-50 animate-in fade-in zoom-in duration-700">
        <form onSubmit={handleAddTodo} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">งานที่ต้องทำ</label>
            <input 
              type="text" 
              placeholder="เช่น อ่านหนังสือสอบ..." 
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="px-5 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">กำหนดเวลา</label>
            <input 
              type="time" 
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
              className="px-5 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
          </div>
          <div className="flex items-end">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              {loading ? "กำลังบันทึก..." : "เพิ่มรายการใหม่"}
            </button>
          </div>
        </form>
      </div>

      {/* --- ส่วนตารางแสดง To-do List --- */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">สถานะ</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">รายการ</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">เวลา</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {todos.length > 0 ? todos.map((item) => (
                <tr key={item.id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-5">
                    <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-700">{item.title}</td>
                  <td className="px-8 py-5">
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black">
                      {item.time} น.
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => deleteTodo(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-8 py-12 text-center text-slate-400 font-medium">
                    ยังไม่มีรายการที่คุณเพิ่ม... เริ่มต้นจัดการวันของคุณได้เลย! ✍️
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}