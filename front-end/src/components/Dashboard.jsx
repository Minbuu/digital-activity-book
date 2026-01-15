import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatBot from './ChatBot'; 
import ActivityTable from './ActivityTable'; // 1. อ้างอิงไฟล์ตารางกิจกรรม

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_info')) || { name: 'ผู้เยี่ยมชม' };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
        await axios.post('http://localhost:8000/api/logout', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.log("Logout error at server", error);
    }
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navbar */}
      <nav className="bg-white shadow-sm p-4 mb-6 rounded-lg flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">Digital Activity Book</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">สวัสดี, {user.name}</span>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            ออกจากระบบ
          </button>
        </div>
      </nav>

      {/* Main Content: แบ่งเป็น 2 ฝั่ง */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ฝั่งซ้าย (กินพื้นที่ 2 ใน 3): แสดงตารางกิจกรรม */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">ยินดีต้อนรับ! 🎉</h2>
            <p className="text-gray-500">จัดการกิจกรรมและตรวจสอบสถานะการรับรองได้ที่นี่</p>
          </div>

          {/* 2. แสดง Component ตารางกิจกรรมที่นี่ */}
          <ActivityTable /> 
        </div>

        {/* ฝั่งขวา (กินพื้นที่ 1 ใน 3): พี่ระเบียบ AI */}
        <div className="md:col-span-1">
          <div className="sticky top-6">
            <ChatBot />
            <p className="text-center text-xs text-gray-400 mt-4 italic">
              * สงสัยระเบียบกิจกรรม? ถามพี่ระเบียบได้เลย
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}