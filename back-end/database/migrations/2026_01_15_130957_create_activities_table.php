<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->date('date');
            $table->enum('type', ['บังคับ', 'เลือก']);
            $table->integer('hours');
            $table->integer('score');

            // --- ส่วนที่ต้องเพิ่มสำหรับการสแกนเซ็น ---
            $table->string('status')->default('รอตรวจสอบ');
            $table->unsignedBigInteger('verified_by')->nullable(); // ID อาจารย์ที่สแกนเซ็น
            $table->string('verification_code')->unique()->nullable(); // รหัสสำหรับสร้าง QR Code
            $table->timestamp('verified_at')->nullable(); // วันที่และเวลาที่สแกนเซ็น
            // ---------------------------------------

            $table->timestamps();

            // เชื่อม verified_by กับตาราง users (ถ้าอาจารย์อยู่ในตารางเดียวกัน)
            $table->foreign('verified_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
