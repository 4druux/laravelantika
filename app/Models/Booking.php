<?php
// File: app/Models/Booking.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'public_id',
        'nama',
        'telepon',
        'paket',
        'tanggal_booking',
        'catatan',
        'status',
    ];

   
    protected $casts = [
        'tanggal_booking' => 'datetime',
    ];
}