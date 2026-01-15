<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ActivityController extends Controller
{
    /**
     * ดึงรายการกิจกรรมของนักศึกษา
     */
    public function index(Request $request)
    {
        try {
            // แก้ไข: เปลี่ยนจาก 'name' เป็น 'first_name,last_name' ให้ตรงกับ DB จริง
            $activities = Activity::with('teacher:id,first_name,last_name') 
                                  ->where('user_id', $request->user()->id)
                                  ->orderBy('date', 'desc')
                                  ->get();

            return response()->json($activities);
        } catch (\Exception $e) {
            // ถ้าพังอีก จะได้รู้ว่าพังเพราะอะไร
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * ฟังก์ชันสำหรับสร้าง QR Code
     */
    public function generateVerification(Request $request, $id)
    {
        $activity = Activity::where('id', $id)
                            ->where('user_id', $request->user()->id)
                            ->firstOrFail();

        if (!$activity->verification_code) {
            $activity->update([
                'verification_code' => Str::random(32)
            ]);
        }

        return response()->json([
            'status' => 'success',
            'verification_code' => $activity->verification_code
        ]);
    }

    /**
     * ฟังก์ชันสำหรับอาจารย์: ยืนยันกิจกรรม
     */
    public function verify(Request $request)
    {
        $request->validate([
            'verification_code' => 'required|string'
        ]);

        $activity = Activity::where('verification_code', $request->verification_code)
                            ->where('status', 'รอตรวจสอบ')
                            ->first();

        if (!$activity) {
            return response()->json(['message' => 'ไม่พบกิจกรรมหรือถูกยืนยันไปแล้ว'], 404);
        }

        $activity->update([
            'status' => 'อนุมัติแล้ว',
            'verified_by' => $request->user()->id, // เก็บ ID อาจารย์ที่สแกน
            'verified_at' => now(),
            'verification_code' => null 
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'ยืนยันกิจกรรมสำเร็จแล้ว'
        ]);
    }
}