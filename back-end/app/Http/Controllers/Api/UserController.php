<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    // 1. ดึงข้อมูล User ทั้งหมด (เหมือนเดิม)
    public function index()
    {
        $users = User::all();
        return response()->json([
            'status' => 'success',
            'data' => $users
        ], 200);
    }

    // 2. สร้าง User ใหม่ (เหมือนเดิม)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:student,council,teacher,admin',
        ]);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'username' => $validated['username'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully',
            'data' => $user
        ], 201);
    }

    // 💡 3. ฟังก์ชันอัปเดตข้อมูลส่วนตัว (ชื่อ-นามสกุล-Username)
    public function updateProfile(Request $request)
    {
        $user = Auth::user(); // ดึง User ที่ Login อยู่

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|unique:users,username,' . $user->id, // ยกเว้น username ตัวเอง
        ]);

        $user->update([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'username' => $validated['username'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'อัปเดตข้อมูลโปรไฟล์สำเร็จ',
            'user' => $user
        ]);
    }

    // 💡 4. ฟังก์ชันเปลี่ยนรหัสผ่าน (พร้อมตรวจสอบรหัสผ่านเดิม)
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => ['required', 'confirmed', Password::min(6)], // ต้องมี confirm_password ส่งมาด้วย
        ]);

        $user = Auth::user();

        // ตรวจสอบว่ารหัสผ่านเดิมถูกไหม
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'รหัสผ่านปัจจุบันไม่ถูกต้อง'
            ], 422);
        }

        // อัปเดตรหัสผ่านใหม่
        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'เปลี่ยนรหัสผ่านสำเร็จแล้ว'
        ]);
    }
}