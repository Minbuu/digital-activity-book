import React from 'react';
// แก้ Path ให้ตรงกับที่อยู่ในโฟลเดอร์ navbar
import Navbar from './navbar/navbar'; 
import ActivityTable from './ActivityTable';
import ChatBot from './ChatBot';

export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* 1. Navbar ตัวเดียวพอ เพราะใน Navbar มี Modal Login ซ่อนไว้อยู่แล้ว */}
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 md:p-10 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 animate-in fade-in duration-700">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-12 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"></div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">กิจกรรมของฉัน</h2>
              <p className="text-gray-500 mt-1 font-medium">จัดการและตรวจสอบสถานะกิจกรรมของคุณ</p>
            </div>
          </div>
        </div>

        {/* 2. แสดงเฉพาะตารางกิจกรรม */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden min-h-[400px]">
            <ActivityTable />
          </div>
        </section>
      </main>

      {/* 3. ปุ่มแชท AI */}
      <ChatBot />

      {/* !!! ห้ามมี <Login /> ตรงนี้เด็ดขาด !!! */}
    </div>
  );
}