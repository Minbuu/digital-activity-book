import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// 💡 รับ approvedHours มาจาก Dashboard ตรงๆ ไม่ต้องเรียก API เอง
export default function ActivityChart({ approvedHours = 0 }) {
  const targetHours = 50; 
  const remainingHours = Math.max(0, targetHours - approvedHours);

  const data = {
    labels: ['ผ่านแล้ว', 'ยังขาด'],
    datasets: [{
      data: [approvedHours, remainingHours],
      backgroundColor: ['#4F46E5', '#F43F5E'], 
      borderWidth: 0,
      borderRadius: 15,
      spacing: 4,
    }]
  };

  const options = {
    cutout: '82%',
    plugins: { legend: { display: false } },
    animation: { animateRotate: true, duration: 1000 }
  };

  return (
    <div className="relative w-48 h-48 mx-auto">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-black text-slate-800">{approvedHours}</span>
        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">HOURS</span>
      </div>
    </div>
  );
}