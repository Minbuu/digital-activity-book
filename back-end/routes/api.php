<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;



// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');



// เปิดให้เข้าถึงได้โดยไม่ต้อง Login
Route::post('/login', [AuthController::class, 'login']);

// ต้องมี Token ถึงจะเข้าได้ (Protected Routes)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // ย้าย route users เดิมมาไว้ในนี้ได้ ถ้าอยากให้เฉพาะคนล็อกอินเห็นข้อมูล
    // Route::get('/users', [UserController::class, 'index']); 
    // Laravel จะเติม prefix '/api' ให้อัตโนมัติ
    // URL จะเป็น: http://localhost:8000/api/users
    Route::get('/users', [UserController::class, 'index']); // ดึงข้อมูล
    Route::post('/users', [UserController::class, 'store']); // สร้างข้อมูล
});

