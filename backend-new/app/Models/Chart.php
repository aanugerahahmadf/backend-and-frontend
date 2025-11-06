<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chart extends Model
{
    protected $fillable = [
        'title',
        'data',
        'type',
    ];

    protected $casts = [
        'data' => 'array',
    ];
}
