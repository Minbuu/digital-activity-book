<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. รับค่า
        $request->validate([
            'login' => 'required',
            'password' => 'required',
        ]);

        // 🔥 ท่าไม้ตาย: ตัดช่องว่างหน้า-หลังทิ้งอัตโนมัติ (Trim)
        // ต่อให้พิมพ์ " somchai.r " มา ระบบจะแก้เป็น "somchai.r" ให้เอง
        $usernameInput = trim($request->login);
        $passwordInput = $request->password;

        // 2. ค้นหา User
        $user = User::where('username', $usernameInput)->first();

        // 3. ตรวจสอบรหัสผ่าน
        if (!$user || !Hash::check($passwordInput, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
            ], 401);
        }

        // 4. สร้าง Token
        $token = $user->createToken('auth_token')->plainTextToken;

        // 5. ส่งค่ากลับไปให้ React
        return response()->json([
            'status' => 'success',
            'message' => 'Login สำเร็จ',
            'user' => $user,
            'token' => $token
        ], 200);
    }

    // แถม: ฟังก์ชัน Logout
    public function logout(Request $request)
    {
        // ลบ Token ทิ้ง (ทำให้ Token เก่าใช้ไม่ได้อีก)
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout สำเร็จ'
        ]);
    }
}
