<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response; 
use Illuminate\Support\Facades\Log; // 🔥 เพิ่มบรรทัดนี้ครับ! เส้นแดงคำว่า Log จะหายไป

class ChatController extends Controller
{
    public function ask(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);
        $userQuestion = $request->message;

        $context = "
            บทบาท: คุณคือ 'พี่ระเบียบ' AI ผู้ช่วยตอบคำถามประจำระบบ Digital Activity Book
            กฎเหล็ก: 
            1. ตอบเฉพาะข้อมูลที่มีใน [ข้อมูลระเบียบการ] ด้านล่างนี้เท่านั้น
            2. ถ้าไม่มีข้อมูลในกฎ ให้ตอบว่า 'ขออภัยครับ เรื่องนี้ไม่อยู่ในเงื่อนไขระเบียบการ กรุณาติดต่อฝ่ายทะเบียนครับ'
            [ข้อมูลระเบียบการ]
            1. นักศึกษา ปวส. ต้องเก็บชั่วโมงกิจกรรม 50 ชม./เทอม (บังคับ 20, เลือก 30)
            2. ส่งเล่มล่าช้า หักคะแนนจิตพิสัยวันละ 1 คะแนน
            3. จิตอาสานอกสถานที่ต้องแนบรูปถ่ายและลายเซ็นผู้รับรอง
            4. ติดต่อ: อาจารย์สมชาย (ห้อง 302)
        ";

        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json(['reply' => 'Error: ไม่พบ API Key'], 500);
        }

        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $context . "\n\nคำถามจากนักศึกษา: " . $userQuestion]
                    ]
                ]
            ]
        ]);

        if ($response->failed()) {
            return response()->json([
                'reply' => 'เกิดข้อผิดพลาดในการเชื่อมต่อ Google: ' . $response->body()
            ], 500);
        }

        $responseData = $response->json();
        
        $botReply = data_get($responseData, 'candidates.0.content.parts.0.text');

        if (!$botReply) {
            $blockReason = data_get($responseData, 'promptFeedback.blockReason');
            if ($blockReason) {
                $botReply = "ตอบไม่ได้เนื่องจากติดระบบความปลอดภัย (Reason: $blockReason)";
            } else {
                // แก้ตรงนี้: ลบ \ ออก เพราะเรา import มาแล้ว
                Log::error('Gemini Error:', $responseData);
                $botReply = 'ระบบได้รับคำตอบไม่สมบูรณ์ กรุณาลองใหม่';
            }
        }

        return response()->json([
            'reply' => $botReply
        ]);
    }
}