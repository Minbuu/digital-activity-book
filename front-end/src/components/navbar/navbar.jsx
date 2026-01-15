import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// ตรวจสอบ Path ไฟล์ Login ของคุณให้ถูกต้องนะครับ
import Login from '../auth/login/login.jsx'; 

export default function Navbar() {
    // 1. สร้าง State คุม Modal และข้อมูล User
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // 2. เช็คสถานะการ Login จาก localStorage
    useEffect(() => {
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
    }, [isLoginOpen]); // เมื่อ Modal ปิดลง ให้เช็คข้อมูลใหม่เผื่อเพิ่ง Login สำเร็จ

    // 3. ฟังก์ชัน Logout
    const handleLogout = () => {
        localStorage.clear(); // ล้างข้อมูล Token และ User
        setUser(null);
        navigate('/login'); // ส่งไปหน้า Login (ถ้าต้องการ) หรืออยู่ที่เดิม
    };

    return (
        <>
            <nav className="bg-white shadow-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        
                        {/* โลโก้ - คลิกแล้วกลับหน้าแรก */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                </svg>
                            </div>
                            <span className="font-bold text-xl text-gray-800 tracking-wide">
                                Digital<span className="text-indigo-600">Book</span>
                            </span>
                        </div>

                        {/* เมนูขวา */}
                        <div className="flex items-center space-x-4">
                            <a href="#" className="hidden md:block text-gray-600 hover:text-indigo-600 transition">หน้าแรก</a>
                            
                            {/* 4. สลับปุ่มตามสถานะ User */}
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                        สวัสดี, {user.name}
                                    </span>
                                    <button 
                                        onClick={handleLogout}
                                        className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold border border-red-100 hover:bg-red-500 hover:text-white transition"
                                    >
                                        ออกจากระบบ
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsLoginOpen(true)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium shadow-md transition transform hover:-translate-y-0.5"
                                >
                                    เข้าสู่ระบบ
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* ส่ง Props isOpen และ onClose ไปยัง Component Login */}
            <Login 
                isOpen={isLoginOpen} 
                onClose={() => setIsLoginOpen(false)} 
            />
        </>
    );
}