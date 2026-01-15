import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// ลงทะเบียน Component ของ ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ActivityChart({ approvedHours = 0 }) {
  const targetHours = 50; // เป้าหมายชั่วโมงกิจกรรม
  
  // ตรวจสอบชั่วโมงที่เหลือ (ถ้าเกินเป้าหมายให้เป็น 0)
  const remainingHours = Math.max(0, targetHours - approvedHours);

  const data = {
    labels: ['ชั่วโมงที่ผ่านแล้ว', 'ยังขาดอีก'],
    datasets: [
      {
        data: [approvedHours, remainingHours],
        // แก้ไขสี: ส่วนที่ขาดเปลี่ยนเป็นสีแดง (Rose-500) และสีพื้นหลังเวลา Hover
        backgroundColor: ['#4F46E5', '#F43F5E'], 
        hoverBackgroundColor: ['#4338CA', '#E11D48'],
        borderWidth: 0,
        borderRadius: 10, // เพิ่มความมนให้ปลายกราฟ
      },
    ],
  };

  const options = {
    cutout: '80%', // ทำให้เป็นวงแหวนบางๆ
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false }, // ซ่อน Label
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => ` ${context.label}: ${context.raw} ชม.`
        }
      }
    },
    animation: {
      animateRotate: true,
      duration: 2000 // อนิเมชั่นตอนโหลด
    }
  };

  return (
    <div className="relative w-48 h-48 mx-auto group">
      {/* วาดกราฟวงกลม */}
      <Doughnut data={data} options={options} />
      
      {/* ตัวเลขแสดงผลตรงกลางวงกลม */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-black text-slate-800 transition-transform group-hover:scale-110 duration-300">
          {approvedHours}
        </span>
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] mt-1 text-center">
          จาก {targetHours} ชม.<br/>
          {remainingHours > 0 && <span className="text-rose-500 text-[9px] normal-case font-medium">(ขาดอีก {remainingHours})</span>}
        </span>
      </div>
    </div>
  );
}