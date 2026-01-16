<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    use HasFactory;

    // 💡 เพิ่มบรรทัดนี้เพื่ออนุญาตให้บันทึกข้อมูล
    protected $fillable = [
        'user_id',
        'title',
        'todo_date',
        'todo_time',
        'status'
    ];
}