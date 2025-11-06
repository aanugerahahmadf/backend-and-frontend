<?php

namespace App\Http\Controllers\Api;

use App\Services\BuildingService;
use App\Http\Resources\BuildingResource;
use Illuminate\Http\Request;

class BuildingController extends BaseApiController
{
    protected $buildingService;

    public function __construct(BuildingService $buildingService)
    {
        $this->buildingService = $buildingService;
    }

    public function index()
    {
        $buildings = $this->buildingService->getBuildingsWithRoomsAndCctvs();
        return $this->success(BuildingResource::collection($buildings), 'Buildings retrieved successfully');
    }

    public function show($id)
    {
        $building = $this->buildingService->getById($id);

        if (!$building) {
            return $this->error('Building not found', 404);
        }

        return $this->success(new BuildingResource($building), 'Building retrieved successfully');
    }
}
