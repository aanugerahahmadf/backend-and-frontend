<?php

namespace App\Services;

use App\Repositories\BuildingRepository;

class BuildingService extends BaseService
{
    protected $buildingRepository;

    public function __construct(BuildingRepository $buildingRepository)
    {
        parent::__construct($buildingRepository);
        $this->buildingRepository = $buildingRepository;
    }

    public function getBuildingsWithRoomsAndCctvs()
    {
        return $this->buildingRepository->withRoomsAndCctvs();
    }
}
