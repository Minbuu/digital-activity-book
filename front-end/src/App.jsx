import { Routes, Route } from 'react-router-dom';
import Login from './components/auth/login.jsx'; // เช็ค path ให้ถูกนะ
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* 1. หน้า Login (ใครก็เข้าได้) */}
      <Route path="/login" element={<Login />} />

      {/* 2. หน้า Dashboard (ต้องมี ProtectedRoute คุ้มกัน) */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;