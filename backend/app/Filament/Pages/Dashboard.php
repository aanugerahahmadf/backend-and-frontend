<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\CctvOperationalTable;
use App\Filament\Widgets\CctvStatusTrendChart;
use App\Filament\Widgets\DashboardStats;
use App\Filament\Widgets\NetworkTrafficChart;
use App\Filament\Widgets\OfflineAlerts;
use App\Filament\Widgets\StreamingPerformanceChart;
use BackedEnum;
use Filament\Pages\Page;

class Dashboard extends Page
{
    protected static string|BackedEnum|null $navigationIcon = 'bxs-dashboard';

    protected static ?int $navigationSort = 1;

    public static function getNavigationIcon(): ?string
    {
        return static::$navigationIcon;
    }

    public function getWidgets(): array
    {
        return [
            DashboardStats::class,
            CctvStatusTrendChart::class,
            StreamingPerformanceChart::class,
            NetworkTrafficChart::class,
            OfflineAlerts::class,
            CctvOperationalTable::class,
        ];
    }

    public function getTitle(): string
    {
        return 'Dashboard';
    }
}
