<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ActivityController extends Controller
{
    /**
     * สำหรับนักศึกษา: ดึงรายการกิจกรรมของตัวเอง
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
     * 💡 สำหรับอาจารย์: ดูข้อมูลภาพรวมเฉพาะนักศึกษาในที่ปรึกษา (Advisor View)
     */
    public function getMyClassStats(Request $request)
    {
        $user = Auth::user();
        $teacherClass = $user->class_group; 

        if (!$teacherClass) {
            return response()->json([
                'status' => 'error',
                'message' => 'บัญชีอาจารย์ท่านนี้ยังไม่ได้ระบุกลุ่มเรียนที่ดูแล'
            ], 400);
        }

        // ดึงรายชื่อนักศึกษาในกลุ่มเรียน พร้อมสรุปผล
        $students = User::where('role', 'student')
            ->where('class_group', $teacherClass)
            ->with(['activities' => function($query) {
                $query->where('status', 'อนุมัติแล้ว');
            }])
            ->get()
            ->map(function($student) {
                $totalHours = $student->activities->sum('hours');
                return [
                    'id' => $student->id,
                    'full_name' => $student->first_name . ' ' . $student->last_name,
                    'total_hours' => $totalHours,
                    'status' => $totalHours >= 50 ? 'ผ่านเกณฑ์' : 'ยังไม่ครบ',
                    'progress_percent' => min(100, ($totalHours / 50) * 100),
                ];
            });

        return response()->json([
            'class_group' => $teacherClass,
            'total_students' => $students->count(),
            'passed_count' => $students->where('total_hours', '>=', 50)->count(),
            'students' => $students
        ]);
    }

    /**
     * 💡 สำหรับอาจารย์: อนุมัติผ่านการสแกน QR (Global Scan)
     */
    public function approveByScanner(Request $request)
    {
        $request->validate([
            'qr_data' => 'required', // ID ของรายการกิจกรรม
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
            'student_class' => $activity->user->class_group,
            'activity_title' => $activity->title
        ]);
    }
}