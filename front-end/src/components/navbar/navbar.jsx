import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Login from '../auth/login'; 

export default function Navbar() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // 1. ฟังก์ชันเช็คสถานะ User แบบละเอียด
    const checkUser = () => {
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
            try {
                const parsedUser = JSON.parse(userInfo);
                setUser(parsedUser);
                // 💡 ถ้าล็อกอินอยู่ ห้ามเปิดหน้าต่าง Login ทิ้งไว้เด็ดขาด
                setIsLoginOpen(false); 
            } catch (e) {
                console.error("User info format error");
                localStorage.removeItem('user_info');
            }
        } else {
            setUser(null);
        }
    };

    // 2. ตรวจสอบสถานะทุกครั้งที่เปิด/ปิด Modal หรือเปลี่ยนหน้า URL
    useEffect(() => {
        checkUser();
    }, [isLoginOpen, location.pathname]);

    // 3. ฟังก์ชัน Logout แบบเคลียร์เกลี้ยง
    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/'); // กลับไปหน้า Home
        window.location.reload(); // บังคับรีเฟรชหน้าเพื่อเคลียร์ State ทั้งระบบ
    };

    // ตัวช่วยจัดการสีเมนู Active
    const getLinkClass = (path) => 
        `transition-all duration-300 ${location.pathname === path ? "text-indigo-600 font-extrabold scale-110" : "text-gray-500 hover:text-indigo-500 font-bold"}`;

    return (
        <>
            <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100 transition-all">
                <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
                    
                    {/* ส่วนซ้าย: โลโก้ + เมนูหลัก */}
                    <div className="flex items-center gap-10">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">D</div>
                            <span className="font-black text-2xl text-gray-800 tracking-tighter italic">
                                Digital<span className="text-indigo-600">Book</span>
                            </span>
                        </Link>

                        {/* แสดงเมนูเมื่อล็อกอินสำเร็จแล้วเท่านั้น */}
                        {user && (
                            <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wider">
                                <Link to="/" className={getLinkClass('/')}>หน้าหลัก</Link>
                                <Link to="/activities" className={getLinkClass('/activities')}>กิจกรรม</Link>
                            </div>
                        )}
                    </div>

                    {/* ส่วนขวา: ข้อมูล User / ปุ่มเข้าสู่ระบบ */}
                    <div className="flex items-center space-x-6">
                        {user ? (
                            <div className="flex items-center gap-5 animate-in fade-in slide-in-from-right-5">
                                <div className="text-right hidden sm:block border-r pr-5 border-gray-100">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Authorized</p>
                                    <p className="text-sm font-bold text-gray-800">สวัสดี, {user.first_name || user.name}</p>
                                </div>
                                <button 
                                    onClick={handleLogout} 
                                    className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-6 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-sm border border-rose-100"
                                >
                                    LOGOUT
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsLoginOpen(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1 active:scale-95"
                            >
                                เข้าสู่ระบบ
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* 3. Modal Login: ป้องกันการแสดงซ้อนด้วยเงื่อนไข !user */}
            {isLoginOpen && !user && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-md animate-in zoom-in-95 duration-300">
                        <Login 
                            isOpen={isLoginOpen} 
                            onClose={() => setIsLoginOpen(false)} 
                        />
                    </div>
                </div>
            )}
        </>
    );
}