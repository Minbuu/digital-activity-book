import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/login'; // 1. เช็ค Path ให้ตรงตามโครงสร้างโฟลเดอร์จริง
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* 1. หน้า Login */}
      <Route path="/login" element={<Login />} />

      {/* 2. หน้า Dashboard (หน้าแรก) */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* 3. ดักจับกรณีพิมพ์ URL มั่ว ให้ส่งกลับไปหน้าแรก */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;