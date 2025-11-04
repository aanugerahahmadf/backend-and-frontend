<?php

namespace App\Filament\Widgets;

use App\Models\Cctv;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Database\Eloquent\Builder;

class OfflineAlerts extends BaseWidget
{
    protected int | string | array $columnSpan = 2;

    public function getHeading(): ?string
    {
        return 'Recent Offline Alerts';
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(Cctv::query()->latest()->limit(5))
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Camera')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('building.name')
                    ->label('Building')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('room.name')
                    ->label('Room')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('ip_address')
                    ->label('IP Address')
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created At')
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->paginated(false);
    }
}
