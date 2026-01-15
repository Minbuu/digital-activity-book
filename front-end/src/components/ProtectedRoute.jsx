import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // 1. เช็คว่ามี Token ในกระเป๋าไหม?
  const token = localStorage.getItem('token');

  // 2. ถ้าไม่มี -> ดีดกลับไปหน้า Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. ถ้ามี -> ปล่อยให้เข้าไปได้ (Render หน้า Dashboard)
  return children;
}