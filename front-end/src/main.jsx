import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 1. เพิ่มบรรทัดนี้ (นำเข้า BrowserRouter)
import { BrowserRouter } from 'react-router-dom' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. เอา BrowserRouter มาครอบ App ไว้แบบนี้ครับ */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)