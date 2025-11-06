<?php

namespace App\Http\Resources;

use App\Http\Resources\BaseApiResource;
use App\Http\Resources\CctvResource;

class RoomResource extends BaseApiResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'building_id' => $this->building_id,
            'name' => $this->name,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'marker_icon_url' => $this->marker_icon_url,
            'cctvs' => CctvResource::collection($this->cctvs),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
