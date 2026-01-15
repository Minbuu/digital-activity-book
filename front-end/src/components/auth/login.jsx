import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. เพิ่มตัวช่วยเปลี่ยนหน้า

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate(); // 2. ประกาศตัวแปรสำหรับเปลี่ยนหน้า

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // ยิง API ไปที่ Laravel
      const response = await axios.post(`http://localhost:8000/api/login`, {
        login: username,
        password: password
      });

      // ถ้าสำเร็จ (Status 200 และ Backend ส่ง success มา)
      if (response.data.status === 'success') {
        console.log("Login สำเร็จ!", response.data);

        // 1. เก็บ Token และข้อมูล User ลงเครื่อง
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_info', JSON.stringify(response.data.user));

        // 2. แจ้งเตือนสวยๆ (หรือจะลบออกก็ได้ถ้าไม่อยากให้มี Pop-up)
        alert(`ยินดีต้อนรับคุณ ${response.data.user.name}`);

        // 3. เปลี่ยนหน้าไปที่หน้าแรก (/) โดยไม่ต้องรีโหลดหน้าเว็บ
        navigate('/'); 
      }

    } catch (err) {
      console.error("Login Error:", err);
      
      // จัดการ Error Message
      if (err.response && err.response.status === 401) {
        // กรณี 401: รหัสผ่านผิด หรือ ไม่พบชื่อผู้ใช้
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      } else if (err.code === "ERR_NETWORK") {
        // กรณีต่อ Server ไม่ติด
        setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ (กรุณาเช็คว่ารัน php artisan serve หรือยัง)");
      } else {
        // กรณีอื่นๆ
        setError("เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่ภายหลัง");
      }
    } finally {
      setIsLoading(false); // หยุดโหลดเสมอ ไม่ว่าจะสำเร็จหรือพัง
    }
  };

  return (
    // ปรับความสูง: ใช้ h-[calc(100vh-4rem)] เพื่อเผื่อที่ให้ Navbar (ถ้ามี)
    // ถ้าไม่มี Navbar ให้แก้เป็น h-screen ได้เลย
    <div className="flex h-[calc(100vh-4rem)] w-full bg-white overflow-hidden">
      
      {/* --- ส่วนซ้าย: Branding (เหมือนเดิม) --- */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-tr from-indigo-600 to-purple-700 justify-center items-center relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-10 -left-10 blur-3xl"></div>
        <div className="absolute w-80 h-80 bg-white/10 rounded-full bottom-20 right-20 blur-3xl"></div>

        <div className="relative z-10 text-center text-white px-10">
          <div className="mb-6 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Digital Activity Book</h1>
          <p className="text-lg text-indigo-100">ระบบบันทึกกิจกรรมดิจิทัลสำหรับนักศึกษา<br />สะดวก รวดเร็ว ตรวจสอบง่าย</p>
        </div>
      </div>

      {/* --- ส่วนขวา: Login Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">ยินดีต้อนรับกลับ!</h2>
            <p className="mt-2 text-sm text-gray-600">กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูลของคุณ</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            
            {/* Error Message Display */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-pulse">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้ / รหัสนักศึกษา</label>
                <input
                  id="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="กรอกชื่อผู้ใช้ของคุณ"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">ลืมรหัสผ่าน?</a>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all transform 
                ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}
              `}
            >
              {isLoading ? (
                  <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      กำลังตรวจสอบ...
                  </span>
              ) : (
                  "เข้าสู่ระบบ"
              )}
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              ยังไม่มีบัญชีใช่ไหม?{" "}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">ติดต่อฝ่ายทะเบียน</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}