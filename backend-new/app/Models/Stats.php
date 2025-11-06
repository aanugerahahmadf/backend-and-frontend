<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stats extends Model
{
    protected $fillable = [
        'metric',
        'value',
        'timestamp',
    ];

    protected $casts = [
        'timestamp' => 'datetime',
    ];
}
