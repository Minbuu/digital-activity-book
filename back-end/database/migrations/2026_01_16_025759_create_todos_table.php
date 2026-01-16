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
        Schema::create('todos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->date('todo_date');
            $table->string('todo_time'); // เปลี่ยนเป็น string เพื่อรองรับรูปแบบเวลา เช่น HH:MM หรือ HH:MM:SS
            $table->enum('status', ['pending', 'completed'])->default('pending');
            $table->timestamps();

            // เพิ่ม index สำหรับประสิทธิภาพในการ query
            $table->index(['user_id', 'todo_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('todos');
    }
};