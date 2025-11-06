<?php

namespace App\Services;

use App\Repositories\ChartRepository;

class ChartService extends BaseService
{
    protected $chartRepository;

    public function __construct(ChartRepository $chartRepository)
    {
        parent::__construct($chartRepository);
        $this->chartRepository = $chartRepository;
    }

    public function getProductionTrends()
    {
        // In a real application, this would retrieve actual chart data from the repository
        // For now, we'll return sample data but in the future this would come from the database
        return [
            ['date' => '2025-10-01', 'production' => 1200, 'target' => 1500],
            ['date' => '2025-10-02', 'production' => 1400, 'target' => 1500],
            ['date' => '2025-10-03', 'production' => 1100, 'target' => 1500],
            ['date' => '2025-10-04', 'production' => 1600, 'target' => 1500],
            ['date' => '2025-10-05', 'production' => 1300, 'target' => 1500],
            ['date' => '2025-10-06', 'production' => 1550, 'target' => 1500],
            ['date' => '2025-10-07', 'production' => 1450, 'target' => 1500],
        ];
    }

    public function getUnitPerformance()
    {
        // In a real application, this would retrieve actual chart data from the repository
        // For now, we'll return sample data but in the future this would come from the database
        return [
            ['unit' => 'Unit A', 'efficiency' => 85, 'capacity' => 1000],
            ['unit' => 'Unit B', 'efficiency' => 92, 'capacity' => 1200],
            ['unit' => 'Unit C', 'efficiency' => 78, 'capacity' => 800],
            ['unit' => 'Unit D', 'efficiency' => 95, 'capacity' => 1500],
            ['unit' => 'Unit E', 'efficiency' => 88, 'capacity' => 1100],
        ];
    }
}
