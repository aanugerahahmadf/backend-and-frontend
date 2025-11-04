<?php

namespace App\Filament\Widgets;

use App\Models\Building;
use App\Models\Cctv;
use App\Models\Room;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class DashboardStats extends BaseWidget
{
    protected int | string | array $columnSpan = 2;

    public function getHeading(): ?string
    {
        return 'Dashboard Statistics';
    }

    protected function getStats(): array
    {
        return [
            Stat::make('Total Buildings', Building::count())
                ->description('All facility buildings')
                ->descriptionIcon('heroicon-m-building-office-2')
                ->color('primary'),
            Stat::make('Total Rooms', Room::count())
                ->description('All monitored rooms')
                ->descriptionIcon('heroicon-m-home')
                ->color('success'),
            Stat::make('Active CCTV Cameras', Cctv::count())
                ->description('Cameras currently streaming')
                ->descriptionIcon('heroicon-m-video-camera')
                ->color('warning'),
        ];
    }
}
