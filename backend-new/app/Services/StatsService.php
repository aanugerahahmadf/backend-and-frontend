<?php

namespace App\Services;

use App\Repositories\StatsRepository;
use App\Models\Building;
use App\Models\Room;
use App\Models\Cctv;

class StatsService extends BaseService
{
    protected $statsRepository;

    public function __construct(StatsRepository $statsRepository)
    {
        parent::__construct($statsRepository);
        $this->statsRepository = $statsRepository;
    }

    public function getStats()
    {
        // In a real application, this would retrieve actual stats from the repository
        // For now, we'll return sample data but in the future this would come from the database
        return [
            'total_buildings' => Building::count(),
            'total_rooms' => Room::count(),
            'total_cctvs' => Cctv::count(),
        ];
    }
}
