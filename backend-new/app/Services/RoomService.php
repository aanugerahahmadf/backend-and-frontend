<?php

namespace App\Services;

use App\Repositories\RoomRepository;

class RoomService extends BaseService
{
    protected $roomRepository;

    public function __construct(RoomRepository $roomRepository)
    {
        parent::__construct($roomRepository);
        $this->roomRepository = $roomRepository;
    }

    public function getRoomsByBuildingId(int $buildingId)
    {
        return $this->roomRepository->getByBuildingId($buildingId);
    }

    public function getRoomsWithCctvs()
    {
        return $this->roomRepository->withCctvs();
    }
}
