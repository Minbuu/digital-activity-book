<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // 1. ข้อมูลส่วนตัว
            $table->string('student_id')->nullable()->unique(); // รหัสนักศึกษา (ว่างได้เผื่อเป็นครู, ห้ามซ้ำ)
            $table->string('first_name'); // ชื่อจริง
            $table->string('last_name');  // นามสกุล
            // 2. ข้อมูลการเรียน (ว่างได้ เพราะครู/แอดมินไม่มีข้อมูลนี้)
            $table->string('department')->nullable(); // แผนกวิชา (เช่น ช่างยนต์, คอมพิวเตอร์)
            $table->string('level')->nullable();      // ระดับชั้น (เช่น ปวช.1/1, ปวส.2)
            // 3. บทบาท (กำหนดค่าเริ่มต้นเป็น student)
            $table->enum('role', ['student', 'council', 'teacher', 'admin'])->default('student');
            $table->string('username')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
