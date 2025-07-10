<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;
   
    protected $casts = [
        'categories' => 'array',
    ];

    protected $fillable = [
        'filename',
        'path',
        'url',
        'categories',
        'aspect_ratio',
    ];
}
