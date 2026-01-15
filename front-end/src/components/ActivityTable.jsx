import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ActivityTable() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('token');
        // เรียก API ดึงข้อมูลกิจกรรม
        const response = await axios.get('http://localhost:8000/api/activities', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // ฟังก์ชันสำหรับกดปุ่มสแกน (ในอนาคตจะเชื่อมกับ Modal QR Code)
  const handleScanClick = (activityId) => {
    alert(`ระบบกำลังเจน QR Code สำหรับกิจกรรมรหัส: ${activityId} เพื่อให้อาจารย์สแกน`);
    // คุณสามารถเพิ่ม logic เปิด Modal ตรงนี้ได้เลย
  };

  const totalHours = activities.reduce((sum, act) => sum + act.hours, 0);

  if (isLoading) return (
    <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
      <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
      <p className="text-gray-500">กำลังโหลดข้อมูลกิจกรรม...</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-sans">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-800">รายการกิจกรรมที่เข้าร่วม</h3>
        <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
          รวมสะสม: {totalHours} / 50 ชม.
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">วันที่</th>
              <th className="px-6 py-4 font-semibold">ชื่อกิจกรรม</th>
              <th className="px-6 py-4 font-semibold">ประเภท</th>
              <th className="px-6 py-4 font-semibold text-center">ชั่วโมง</th>
              <th className="px-6 py-4 font-semibold text-center">คะแนน</th>
              <th className="px-6 py-4 font-semibold text-center">สถานะ / การดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activities.length > 0 ? activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(activity.date).toLocaleDateString('th-TH')}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-800">{activity.name}</div>
                  {/* แสดงชื่ออาจารย์ตามโครงสร้าง DB: first_name และ last_name */}
                  {activity.teacher && (
                    <div className="text-xs text-green-600 font-medium italic mt-1">
                      ✅ รับรองโดย: อ.{activity.teacher.first_name} {activity.teacher.last_name}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    activity.type === 'บังคับ' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center font-bold text-gray-700">{activity.hours}</td>
                <td className="px-6 py-4 text-sm text-center font-mono text-indigo-600">{activity.score}</td>
                <td className="px-6 py-4 text-center">
                  {activity.status === 'รอตรวจสอบ' ? (
                    <button 
                      onClick={() => handleScanClick(activity.id)}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-2 rounded-lg font-bold shadow-sm shadow-amber-200 transition-all active:scale-95 flex items-center gap-1 mx-auto"
                    >
                      <span>📱 สแกนเซ็น</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center text-xs font-bold text-green-500">
                      <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                      อนุมัติแล้ว
                    </span>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-gray-400 italic">
                  ยังไม่มีข้อมูลกิจกรรมในขณะนี้... เริ่มสะสมกิจกรรมกันเถอะ!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}