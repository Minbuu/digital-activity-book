import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Login from '../auth/login'; 

export default function Navbar() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const checkUser = () => {
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
            try {
                const parsedUser = JSON.parse(userInfo);
                setUser(parsedUser);
                setIsLoginOpen(false); 
            } catch (e) {
                localStorage.removeItem('user_info');
            }
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        checkUser();
    }, [isLoginOpen, location.pathname]);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/');
        window.location.reload();
    };

    const getLinkClass = (path) => 
        `transition-all duration-300 relative py-2 ${
            location.pathname === path 
            ? "text-indigo-600 font-black" 
            : "text-slate-400 hover:text-indigo-500 font-bold"
        }`;

    return (
        <>
            <nav className="bg-white/80 backdrop-blur-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] sticky top-0 z-50 border-b border-white transition-all">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    
                    {/* ส่วนซ้าย: โลโก้ + เมนูหลัก */}
                    <div className="flex items-center gap-12">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white w-11 h-11 rounded-2xl flex items-center justify-center font-black shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-all duration-500">D</div>
                            <span className="font-black text-2xl text-slate-800 tracking-tighter italic">
                                Digital<span className="text-indigo-600">Book</span>
                            </span>
                        </Link>

                        {user && (
                            <div className="hidden md:flex items-center gap-10 text-[13px] uppercase tracking-[0.15em]">
                                {/* 🏠 หน้าหลัก: มีให้ทุกคน */}
                                <Link to="/" className={getLinkClass('/')}>หน้าหลัก</Link>
                                
                                {/* 📘 เมนูกิจกรรม: 💡 แสดงเฉพาะนักศึกษา (student) เท่านั้น */}
                                {user.role === 'student' && (
                                    <Link to="/activities" className={getLinkClass('/activities')}>กิจกรรม</Link>
                                )}
                                
                                {/* 🔍 เมนู SCANNER: 💡 แสดงเฉพาะ อาจารย์/เจ้าหน้าที่ เท่านั้น */}
                                {(user.role === 'teacher' || user.role === 'council' || user.role === 'admin') && (
                                    <Link 
                                        to="/teacher/scanner" 
                                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[11px] font-black hover:bg-indigo-600 transition-all shadow-lg active:scale-95 group"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                        SCANNER
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ส่วนขวา: Profile & Settings */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-5 duration-500">
                                <div className="flex items-center bg-slate-50 p-1.5 pr-5 rounded-[2rem] border border-slate-100 group">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm border-2 border-white shadow-sm mr-3 uppercase">
                                        {user.first_name?.[0] || 'U'}
                                    </div>
                                    <div className="text-left hidden sm:block mr-4">
                                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">
                                            {user.role}
                                        </p>
                                        <p className="text-sm font-black text-slate-700 leading-none">
                                            {user.first_name}
                                        </p>
                                    </div>
                                    <Link to="/profile" className="p-2 bg-white text-slate-400 hover:text-indigo-600 hover:shadow-md rounded-xl transition-all active:scale-90 border border-slate-100" title="ตั้งค่าโปรไฟล์">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                    </Link>
                                </div>

                                <button onClick={handleLogout} className="bg-rose-500 hover:bg-rose-600 text-white w-10 h-10 flex items-center justify-center rounded-2xl transition-all active:scale-90 shadow-lg shadow-rose-100" title="ออกจากระบบ">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setIsLoginOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1 active:scale-95">เข้าสู่ระบบ</button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Modal Login */}
            {isLoginOpen && !user && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-md animate-in zoom-in-95 duration-300">
                        <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
}