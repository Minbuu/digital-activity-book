<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'date',
        'type',
        'hours',
        'score',             // เพิ่มคะแนน
        'status',
        'verified_by',       // เพิ่ม ID อาจารย์ผู้รับรอง
        'verification_code', // เพิ่มรหัสสำหรับเจน QR Code
        'verified_at'        // เพิ่มเวลาที่เซ็นสำเร็จ
    ];

    /**
     * การแปลงข้อมูล (Casting) เพื่อให้ใช้งานง่ายขึ้น
     */
    protected $casts = [
        'date' => 'date',           // ให้คืนค่าเป็น Carbon object อัตโนมัติ
        'verified_at' => 'datetime', // ให้คืนค่าเป็น Carbon object อัตโนมัติ
        'hours' => 'integer',
        'score' => 'integer',
    ];

    /**
     * ความสัมพันธ์: กิจกรรมนี้เป็นของนักศึกษาคนไหน
     */
    public function student()
    {
        // อ้างอิงจากคอลัมน์ user_id
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * ความสัมพันธ์: กิจกรรมนี้ใครเป็นคนเซ็นยืนยันให้
     */
    public function teacher()
    {
        // อ้างอิงจากคอลัมน์ verified_by
        return $this->belongsTo(User::class, 'verified_by');
    }
}