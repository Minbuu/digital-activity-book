<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\TodoController;


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');




// เปิดให้เข้าถึงได้โดยไม่ต้อง Login
Route::post('/login', [AuthController::class, 'login']);

// ต้องมี Token ถึงจะเข้าได้ (Protected Routes)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/activities', [ActivityController::class, 'index']); // ดูรายการ
    Route::post('/activities/{id}/generate-qr', [ActivityController::class, 'generateVerification']); // เจน QR
    Route::post('/activities/verify', [ActivityController::class, 'verify']); // อาจารย์กดเซ็น
    Route::get('/todos', [TodoController::class, 'index']);
    Route::post('/todos', [TodoController::class, 'store']);
    Route::patch('/todos/{id}/status', [TodoController::class, 'updateStatus']); // 💡 สำหรับกดติ๊กถูก
    Route::delete('/todos/{id}', [TodoController::class, 'destroy']);
    Route::get('/users', [UserController::class, 'index']); // ดึงข้อมูล
    Route::post('/users', [UserController::class, 'store']); // สร้างข้อมูล
    Route::get('/todos-stats', [TodoController::class, 'getStats']);
    Route::put('/profile/update', [UserController::class, 'updateProfile']);
    Route::post('/profile/change-password', [UserController::class, 'changePassword']);
    Route::post('/chat', [ChatController::class, 'ask']);
    Route::get('/activities', [ActivityController::class, 'index']);
    // สร้างรหัสยืนยัน (สำหรับนักศึกษาเปิดโชว์)
    Route::post('/activities/{id}/generate-verification', [ActivityController::class, 'generateVerification']);
    // อนุมัติผ่านการสแกน (สำหรับอาจารย์)
    Route::post('/approve-scanner', [ActivityController::class, 'approveByScanner']);
    // สำหรับหน้า Dashboard ของอาจารย์
    Route::get('/teacher/class-stats', [ActivityController::class, 'getMyClassStats']);
    Route::get('/teacher/student-history/{studentId}', [ActivityController::class, 'getStudentActivityHistory']);
});
