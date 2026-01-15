import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ถ้าอยากยิง API Logout ด้วย

export default function Dashboard() {
  const navigate = useNavigate();
  
  // 1. ดึงข้อมูล User ออกมาโชว์ (แปลงจาก Text เป็น Object)
  const user = JSON.parse(localStorage.getItem('user_info')) || { name: 'ผู้เยี่ยมชม' };

  // 2. ฟังก์ชัน Logout
  const handleLogout = async () => {
    // (Optional: ยิงบอก Server ให้ทำลาย Token)
    const token = localStorage.getItem('token');
    try {
        await axios.post('http://localhost:8000/api/logout', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.log("Logout error at server", error);
    }

    // --- หัวใจสำคัญของการ Logout ---
    localStorage.removeItem('token');     // ลบตั๋ว
    localStorage.removeItem('user_info'); // ลบข้อมูลชื่อ
    navigate('/login');                   // ส่งกลับหน้า Login
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar แบบง่าย */}
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">Digital Activity Book</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">สวัสดี, {user.name}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto mt-10 p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">ยินดีต้อนรับเข้าสู่ระบบ! 🎉</h2>
          <p className="text-gray-600">
            ตอนนี้คุณอยู่ในหน้า Dashboard แล้ว คนที่มี Token เท่านั้นถึงจะเห็นหน้านี้
          </p>
          
          <div className="mt-6 p-4 bg-indigo-50 rounded border border-indigo-100">
            <h3 className="font-semibold text-indigo-800">ข้อมูลของคุณ:</h3>
            <ul className="mt-2 text-sm text-gray-700">
                <li>📌 <b>ชื่อ:</b> {user.name}</li>
                <li>📌 <b>Username:</b> {user.username}</li>
                <li>📌 <b>Role:</b> {user.role || 'นักศึกษา'}</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}