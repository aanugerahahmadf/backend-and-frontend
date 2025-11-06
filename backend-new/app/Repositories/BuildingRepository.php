<?php

namespace App\Repositories;

use App\Models\Building;
use App\Repositories\BaseRepository;

class BuildingRepository extends BaseRepository
{
    public function __construct(Building $model)
    {
        parent::__construct($model);
    }

    public function withRoomsAndCctvs()
    {
        return $this->model->with(['rooms.cctvs'])->get();
    }
}
