<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Building extends Model
{
        protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'marker_icon_url',
    ];

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    public function cctvs(): HasMany
    {
        return $this->hasMany(Cctv::class);
    }
}
