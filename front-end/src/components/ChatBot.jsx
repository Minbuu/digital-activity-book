import { useState } from "react";
import axios from "axios";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "สวัสดีครับ! มีข้อสงสัยเรื่องกฎระเบียบกิจกรรมถาม 'พี่ระเบียบ' ได้เลยครับ" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. โชว์ข้อความเราก่อน
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // 2. ส่งไปถาม Laravel (ส่ง Token ไปด้วยถ้าต้องล็อกอิน)
      // const token = localStorage.getItem('token'); 
      const res = await axios.post("http://localhost:8000/api/chat", { 
        message: input 
      });

      // 3. เอาคำตอบจาก AI มาโชว์
      setMessages([...newMessages, { role: "bot", text: res.data.reply }]);

    } catch (error) {
      setMessages([...newMessages, { role: "bot", text: "ขออภัย ระบบขัดข้อง" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 border rounded-lg shadow-lg bg-white overflow-hidden">
      <div className="bg-indigo-600 p-4 text-white font-bold flex items-center">
        🤖 พี่ระเบียบ (AI Guru)
      </div>
      
      {/* โซนแชท */}
      <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === "user" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-800"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-gray-400 text-center">กำลังพิมพ์...</div>}
      </div>

      {/* ช่องพิมพ์ */}
      <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์คำถามที่นี่..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          ส่ง
        </button>
      </form>
    </div>
  );
}