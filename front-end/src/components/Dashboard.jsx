import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatBot from './ChatBot'; // << ต้องมีไฟล์ ChatBot.jsx ในโฟลเดอร์เดียวกัน

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
          <span>สวัสดี, {user.name}</span>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">ออกจากระบบ</button>
        </div>
      </nav>

      {/* Main Content: แบ่งเป็น 2 ฝั่ง */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ฝั่งซ้าย: ข้อมูลกิจกรรม */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">ยินดีต้อนรับ! 🎉</h2>
          <p>ตอนนี้คุณสามารถจัดการกิจกรรมและสอบถามกฎระเบียบผ่าน AI ได้แล้ว</p>
        </div>

        {/* ฝั่งขวา: พี่ระเบียบ AI */}
        <div className="md:col-span-1">
          <ChatBot /> 
        </div>
      </div>
    </div>
  );
}