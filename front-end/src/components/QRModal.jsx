import { QRCodeCanvas } from 'qrcode.react';

export default function QRModal({ isOpen, onClose, code, activityName }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
                <h3 className="text-xl font-black text-gray-900 mb-2">ให้อาจารย์สแกน</h3>
                <p className="text-sm text-gray-500 mb-6">{activityName}</p>
                
                <div className="bg-gray-50 p-6 rounded-2xl flex justify-center mb-6 shadow-inner">
                    <QRCodeCanvas value={code} size={200} level={"H"} />
                </div>

                <button 
                    onClick={onClose}
                    className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                    ปิดหน้าต่าง
                </button>
            </div>
        </div>
    );
}