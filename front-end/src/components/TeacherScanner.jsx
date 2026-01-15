import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';

export default function TeacherScanner() {
    const [message, setMessage] = useState('เตรียมสแกนรหัสของนักศึกษา');
    const [status, setStatus] = useState('scanning'); // scanning, success, error

    const handleResult = async (result, error) => {
        if (!!result) {
            const code = result?.text;
            setStatus('processing');
            setMessage('กำลังยืนยันกิจกรรม...');

            try {
                const token = localStorage.getItem('token');
                const response = await axios.post('http://localhost:8000/api/verify', 
                    { verification_code: code },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setStatus('success');
                setMessage(response.data.message);
                // หลังจาก 3 วินาที ให้กลับไปสแกนต่อ
                setTimeout(() => { setStatus('scanning'); setMessage('สแกนรายต่อไปได้เลย'); }, 3000);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'เกิดข้อผิดพลาด');
                setTimeout(() => setStatus('scanning'), 3000);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-white font-sans">
            <h2 className="text-2xl font-black mb-2 text-indigo-400">อาจารย์ผู้ตรวจกิจกรรม</h2>
            <p className="mb-8 text-gray-400 text-sm">สแกน QR Code จากหน้าจอนักศึกษาเพื่อยืนยัน</p>

            <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden border-4 border-indigo-500 shadow-2xl shadow-indigo-500/20">
                <QrReader
                    onResult={handleResult}
                    constraints={{ facingMode: 'environment' }}
                    style={{ width: '100%' }}
                />
                {/* เส้นนำสายตาสำหรับสแกน */}
                <div className="absolute inset-0 border-2 border-white/30 m-12 pointer-events-none animate-pulse"></div>
            </div>

            <div className={`mt-8 p-6 rounded-2xl w-full max-w-sm text-center font-bold shadow-lg transition-all ${
                status === 'success' ? 'bg-green-500 text-white' : 
                status === 'error' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300'
            }`}>
                {message}
            </div>
        </div>
    );
}