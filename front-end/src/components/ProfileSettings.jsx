import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './navbar/navbar';

export default function ProfileSettings() {
  const user = JSON.parse(localStorage.getItem('user_info'));
  const [profile, setProfile] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:8000/api/profile/update', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem('user_info', JSON.stringify(res.data.user));
      alert("อัปเดตโปรไฟล์สำเร็จ!");
    } catch (err) { alert("อัปเดตล้มเหลว!"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 md:p-12 space-y-10">
        
        <header>
          <h2 className="text-4xl font-black text-slate-800">ตั้งค่าโปรไฟล์</h2>
          <p className="text-slate-400 font-medium">จัดการข้อมูลส่วนตัวและความปลอดภัยของคุณ</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          {/* ส่วนข้อมูลส่วนตัว */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-slate-700 uppercase tracking-widest">ข้อมูลพื้นฐาน</h3>
            <p className="text-slate-400">ชื่อและอีเมลที่คุณใช้ในระบบ</p>
          </div>
          
          <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-bold text-slate-600 ml-2">ชื่อจริง</label>
                  <input type="text" value={profile.first_name} onChange={(e) => setProfile({...profile, first_name: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-slate-600 ml-2">นามสกุล</label>
                  <input type="text" value={profile.last_name} onChange={(e) => setProfile({...profile, last_name: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-bold text-slate-600 ml-2">อีเมล</label>
                <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 font-bold" />
              </div>
              <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100">
                บันทึกการเปลี่ยนแปลง
              </button>
            </form>
          </div>

          <hr className="md:col-span-3 border-slate-100" />

          {/* ส่วนเปลี่ยนรหัสผ่าน */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-slate-700 uppercase tracking-widest text-rose-500">ความปลอดภัย</h3>
            <p className="text-slate-400">เปลี่ยนรหัสผ่านใหม่เพื่อความปลอดภัย</p>
          </div>

          <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <form className="space-y-5">
              <div className="space-y-2">
                <label className="font-bold text-slate-600 ml-2">รหัสผ่านปัจจุบัน</label>
                <input type="password" placeholder="••••••••" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 font-bold" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-slate-600 ml-2">รหัสผ่านใหม่</label>
                <input type="password" placeholder="••••••••" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 font-bold" />
              </div>
              <button className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all active:scale-95 shadow-lg">
                อัปเดตรหัสผ่าน
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}