import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/login'; 
import Dashboard from './components/Dashboard';
import ActivityPage from './components/ActivityPage'; // เพิ่มไฟล์หน้ากิจกรรมแยก
import ProtectedRoute from './components/ProtectedRoute';
import TeacherScanner from './components/TeacherScanner'; 

function App() {
  return (
    <Routes>
      {/* 1. หน้า Login */}
      <Route path="/login" element={<Login />} />

      {/* 2. หน้า Dashboard (หน้าแรก: โชว์กราฟ + To-do List) */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* 3. หน้ากิจกรรม (แยกไฟล์: โชว์ตารางกิจกรรมทั้งหมด) */}
      <Route 
        path="/activities" 
        element={
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        } 
      />

      {/* 4. หน้า Scanner (สำหรับอาจารย์) */}
      <Route 
        path="/teacher/scanner" 
        element={
          <ProtectedRoute>
            <TeacherScanner />
          </ProtectedRoute>
        } 
      />

      {/* 5. ดักจับ URL มั่ว ให้ส่งกลับหน้าแรก */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;