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
    // ถ้าอยากให้คนล็อกอินเท่านั้นถึงถามได้ ให้เอาไปไว้ในกลุ่ม middleware auth:sanctum
    Route::post('/chat', [ChatController::class, 'ask']);
});
