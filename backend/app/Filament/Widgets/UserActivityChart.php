<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;

class UserActivityChart extends ChartWidget
{
    public function getHeading(): ?string
    {
        return 'User Activity';
    }

    protected function getData(): array
    {
        return [
            'datasets' => [
                [
                    'label' => 'Active Users',
                    'data' => [12, 19, 3, 5, 2, 3, 9],
                    'backgroundColor' => '#3B82F6',
                ],
            ],
            'labels' => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
