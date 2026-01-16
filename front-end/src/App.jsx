import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/login'; 
import Dashboard from './components/Dashboard';
import ActivityPage from './components/ActivityPage';
import ProtectedRoute from './components/ProtectedRoute';
import TeacherScanner from './components/TeacherScanner'; 
import ProfileSettings from './components/ProfileSettings';

function App() {
  return (
    <Routes>
      {/* 🟢 1. หน้า Login (ทุกคนเข้าถึงได้) */}
      <Route path="/login" element={<Login />} />

      {/* 🔐 2. หน้า Dashboard (ต้อง Login) */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* 🔐 3. หน้าตารางกิจกรรมทั้งหมด (ต้อง Login) */}
      <Route 
        path="/activities" 
        element={
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        } 
      />

      {/* 🔐 4. หน้าตั้งค่าโปรไฟล์และเปลี่ยนรหัสผ่าน (ต้อง Login) */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        } 
      />

      {/* 🔐 5. หน้า Scanner สำหรับอาจารย์ (ต้อง Login) */}
      {/* 💡 อนาคตสามารถเพิ่ม logic ใน ProtectedRoute ให้เช็ค Role: 'teacher' ได้ */}
      <Route 
        path="/teacher/scanner" 
        element={
          <ProtectedRoute>
            <TeacherScanner />
          </ProtectedRoute>
        } 
      />

      {/* 🔴 6. Fallback: ถ้าเข้า URL มั่ว ให้เด้งกลับหน้าแรก */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;