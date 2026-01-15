import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Login from '../auth/login'; 

export default function Navbar() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // 1. ฟังก์ชันเช็คสถานะ User
    const checkUser = () => {
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
            const parsedUser = JSON.parse(userInfo);
            setUser(parsedUser);
            // 💡 จุดสำคัญ: ถ้าเจอ User ปุ๊บ ให้สั่งปิดหน้าต่าง Login ทันที
            setIsLoginOpen(false); 
        } else {
            setUser(null);
        }
    };

    // 2. เช็คทุกครั้งที่เปิดหน้าเว็บ หรือเมื่อมีการเปิด/ปิด Modal
    useEffect(() => {
        checkUser();
    }, [isLoginOpen, location.pathname]); // เช็คเมื่อเปลี่ยนหน้าด้วย

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/login');
    };

    return (
        <>
            <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                    
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg">D</div>
                            <span className="font-black text-xl text-gray-800 tracking-tighter italic">
                                Digital<span className="text-indigo-600 font-black">Book</span>
                            </span>
                        </Link>

                        {/* เมนูนำทาง (แสดงเมื่อมี user) */}
                        {user && (
                            <div className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-500">
                                <Link to="/" className={location.pathname === '/' ? "text-indigo-600" : ""}>หน้าหลัก</Link>
                                <Link to="/activities" className={location.pathname === '/activities' ? "text-indigo-600" : ""}>กิจกรรมของฉัน</Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-gray-800">สวัสดี, {user.first_name}</p>
                                </div>
                                <button onClick={handleLogout} className="bg-rose-50 text-rose-600 px-5 py-2 rounded-full text-xs font-black">
                                    ออกจากระบบ
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsLoginOpen(true)}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg"
                            >
                                เข้าสู่ระบบ
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* 3. Modal Login: จะแสดงก็ต่อเมื่อ isLoginOpen เป็น true และยังไม่มี User เท่านั้น */}
            {isLoginOpen && !user && (
                <Login 
                    isOpen={isLoginOpen} 
                    onClose={() => setIsLoginOpen(false)} 
                />
            )}
        </>
    );
}