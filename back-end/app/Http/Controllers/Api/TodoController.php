<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TodoController extends Controller
{
    /**
     * ดึงรายการ To-do ทั้งหมดของผู้ใช้ที่ล็อกอิน
     */
    public function index(): JsonResponse
    {
        $todos = Todo::where('user_id', auth()->id())
            ->orderBy('todo_date', 'asc')
            ->orderBy('todo_time', 'asc')
            ->get();

        return response()->json($todos);
    }

    /**
     * บันทึกรายการ To-do ใหม่
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'todo_date' => 'required|date',
            'todo_time' => 'required', // รับค่าจาก React เป็น HH:mm
        ]);

        $todo = Todo::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'todo_date' => $request->todo_date,
            'todo_time' => $request->todo_time,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'บันทึกสำเร็จ!',
            'todo' => $todo
        ], 201);
    }

    /**
     * สลับสถานะงาน (ขีดฆ่า/ยกเลิกขีดฆ่า)
     */
    public function updateStatus($id): JsonResponse
    {
        $todo = Todo::where('user_id', auth()->id())->findOrFail($id);

        $todo->status = ($todo->status === 'pending') ? 'completed' : 'pending';
        $todo->save();

        return response()->json($todo);
    }

    /**
     * ลบรายการ To-do
     */
    public function destroy($id): JsonResponse
    {
        $todo = Todo::where('user_id', auth()->id())->findOrFail($id);
        $todo->delete();

        return response()->json([
            'message' => 'ลบข้อมูลสำเร็จ'
        ]);
    }

    public function getStats(): JsonResponse
    {
        $total = Todo::where('user_id', auth()->id())->count();
        $completed = Todo::where('user_id', auth()->id())->where('status', 'completed')->count();
        $pending = $total - $completed;

        return response()->json([
            'total' => $total,
            'completed' => $completed,
            'pending' => $pending,
            'percentage' => $total > 0 ? round(($completed / $total) * 100) : 0
        ]);
    }
}
