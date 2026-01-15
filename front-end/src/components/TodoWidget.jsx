import React from 'react';

export default function TodoWidget() {
  const tasks = [
    { id: 1, text: 'ส่งเล่มรายงานกิจกรรมจิตอาสา', due: '20 ม.ค.', urgent: true },
    { id: 2, text: 'เช็คชั่วโมงกิจกรรมในระบบ', due: 'วันนี้', urgent: false },
  ];

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
        <h3 className="text-2xl font-bold text-gray-800">รายการที่ต้องทำ</h3>
      </div>
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
            <span className="text-gray-700 font-medium">{task.text}</span>
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${task.urgent ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {task.due}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}