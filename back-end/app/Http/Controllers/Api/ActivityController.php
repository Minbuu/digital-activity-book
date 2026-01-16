<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ActivityController extends Controller
{
    /**
     * 👨‍🎓 สำหรับนักศึกษา: ดึงรายการกิจกรรมของตัวเอง
     */
    public function index(Request $request)
    {
        try {
            $activities = Activity::with('teacher:id,first_name,last_name')
                ->where('user_id', Auth::id())
                ->orderBy('date', 'desc')
                ->get();

            return response()->json($activities);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * 👨‍🏫 สำหรับอาจารย์: ดูข้อมูลภาพรวมนักศึกษาในที่ปรึกษา
     */
    public function getMyClassStats(Request $request)
    {
        try {
            $teacherId = Auth::id(); 

            $students = User::where('role', 'student')
                ->where('advisor_id', $teacherId) 
                ->with(['activities' => function ($query) {
                    // ดึงเฉพาะกิจกรรมที่อนุมัติแล้วมาคำนวณชั่วโมง
                    $query->where('status', 'อนุมัติแล้ว');
                }])
                ->get()
                ->map(function ($student) {
                    $totalHours = $student->activities->sum('hours');
                    return [
                        'id' => $student->id,
                        'full_name' => ($student->first_name ?? 'ไม่ระบุ') . ' ' . ($student->last_name ?? ''),
                        'total_hours' => $totalHours,
                        'status' => $totalHours >= 50 ? 'ผ่านเกณฑ์' : 'ยังไม่ครบ',
                        'progress_percent' => min(100, ($totalHours / 50) * 100),
                    ];
                });

            return response()->json([
                'teacher_name' => Auth::user()->first_name,
                'students' => $students,
                'total_students' => $students->count(),
                'passed_count' => $students->where('total_hours', '>=', 50)->count()
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * 🔍 ใหม่! สำหรับอาจารย์: ดูรายละเอียดกิจกรรมทั้งหมดของนักศึกษาคนนั้นๆ
     */
    public function getStudentActivityHistory($studentId)
    {
        try {
            // เช็คว่าอาจารย์คนนี้เป็นที่ปรึกษาของเด็กคนนี้จริงไหม (เพื่อความปลอดภัย)
            $student = User::where('id', $studentId)
                ->where('advisor_id', Auth::id())
                ->first();

            if (!$student) {
                return response()->json(['message' => 'ไม่พบข้อมูลนักศึกษาในความดูแลของคุณ'], 403);
            }

            // ดึงกิจกรรมทั้งหมดของเด็กคนนี้ (ทั้งที่ผ่านและไม่ผ่าน)
            $activities = Activity::where('user_id', $studentId)
                ->orderBy('date', 'desc')
                ->get();

            return response()->json([
                'student_name' => $student->first_name . ' ' . $student->last_name,
                'activities' => $activities
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * 📸 สำหรับอาจารย์: อนุมัติผ่านการสแกน QR
     */
    public function approveByScanner(Request $request)
    {
        try {
            $request->validate([
                'qr_data' => 'required', 
            ]);

            $activity = Activity::with('user')->find($request->qr_data);

            if (!$activity) {
                return response()->json(['message' => 'ไม่พบข้อมูลกิจกรรมในระบบ'], 404);
            }

            $activity->update([
                'status' => 'อนุมัติแล้ว',
                'verified_by' => Auth::id(),
                'verified_at' => now(),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'เซ็นอนุมัติกิจกรรมสำเร็จ!',
                'student_name' => $activity->user->first_name . ' ' . $activity->user->last_name,
                'student_class' => $activity->user->class_group ?? 'ไม่ระบุห้อง', 
                'activity_title' => $activity->title
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}