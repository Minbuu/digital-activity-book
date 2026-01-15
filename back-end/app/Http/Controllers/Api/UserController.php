<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all(); // ดึงข้อมูลทั้งหมด

        return response()->json([
            'status' => 'success',
            'data' => $users
        ], 200); // 200 คือ OK
    }

    // 2. ฟังก์ชันสร้าง User ใหม่ (POST)
    public function store(Request $request)
    {
        // ตรวจสอบความถูกต้องของข้อมูล (Validation)
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|unique:users', // ห้ามซ้ำ
            'password' => 'required|string|min:6',
            'role' => 'required|in:student,council,teacher,admin', // ต้องเป็นค่าที่เรากำหนด
        ]);

        // สร้าง User ลง Database
        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'username' => $validated['username'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']), // เข้ารหัสรหัสผ่าน
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully',
            'data' => $user
        ], 201); // 201 คือ Created (สร้างเสร็จแล้ว)
    }
}
