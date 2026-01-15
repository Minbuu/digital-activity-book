import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // ล้างข้อมูลเก่าก่อนเริ่ม Login ใหม่
      localStorage.clear();

      const response = await axios.post(`http://localhost:8000/api/login`, {
        login: username, // ตรวจสอบว่า Backend ใช้ key 'login' หรือ 'username' นะครับ
        password: password
      });

      if (response.data.status === 'success') {
        // 1. เก็บ Token และข้อมูล User
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_info', JSON.stringify(response.data.user));

        // 2. เปลี่ยนหน้าทันที (Navbar จะไปปรากฏในหน้า Dashboard เอง)
        navigate('/'); 
      }

    } catch (err) {
      console.error("Login Error:", err);
      if (err.response && err.response.status === 401) {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      } else if (err.code === "ERR_NETWORK") {
        setError("เซิร์ฟเวอร์ไม่ตอบสนอง (ตรวจสอบ XAMPP หรือการรัน PHP)");
      } else {
        setError("ระบบขัดข้อง กรุณาลองใหม่ภายหลัง");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // เปลี่ยนเป็น min-h-screen เพื่อให้เต็มจอในหน้า Login
    <div className="flex min-h-screen w-full bg-white overflow-hidden font-sans">
      
      {/* ส่วนซ้าย: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-indigo-700 to-purple-800 justify-center items-center relative">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-10 -left-10 blur-3xl animate-pulse"></div>
        <div className="absolute w-80 h-80 bg-white/10 rounded-full bottom-20 right-20 blur-3xl animate-pulse delay-700"></div>

        <div className="relative z-10 text-center text-white px-10">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Digital Activity Book</h1>
          <p className="text-xl text-indigo-100 font-light">
            เข้าถึงบันทึกกิจกรรมได้ทุกที่ <br /> 
            ฉลาดขึ้นด้วยผู้ช่วย AI 'พี่ระเบียบ'
          </p>
        </div>
      </div>

      {/* ส่วนขวา: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-gray-900 mb-3">ยินดีต้อนรับ!</h2>
            
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3">
                    <span className="text-red-500 text-xl">⚠️</span>
                    <p className="text-sm text-red-700 font-semibold">{error}</p>
                </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">รหัสนักศึกษา / ชื่อผู้ใช้</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="ตัวอย่าง: 6530xxx"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">รหัสผ่าน</label>
                  <button type="button" className="text-sm text-indigo-600 font-bold hover:underline">ลืมรหัสผ่าน?</button>
                </div>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="กรอกรหัสผ่านของคุณ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all 
                ${isLoading 
                  ? 'bg-gray-400 cursor-wait' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200'}
              `}
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>

            <div className="text-center pt-4">
                <p className="text-gray-500 text-sm">
                    มีปัญหาการเข้าใช้งาน? <span className="text-indigo-600 font-bold cursor-pointer">ติดต่อผู้ดูแลระบบ</span>
                </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}