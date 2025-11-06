<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cctv extends Model
{
     protected $fillable = [
        'building_id',
        'room_id',
        'name',
        'username',
        'password',
        'ip_address',
        'ip_rtsp_url',
    ];

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
