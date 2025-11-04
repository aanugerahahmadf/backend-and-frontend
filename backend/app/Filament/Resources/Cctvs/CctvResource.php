<?php

namespace App\Filament\Resources\Cctvs;

use App\Filament\Resources\Cctvs\Pages\ManageCctvs;
use App\Models\Cctv;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Tables\Actions\Action;
use UnitEnum;

class CctvResource extends Resource
{
    protected static ?string $model = Cctv::class;

    protected static string|UnitEnum|null $navigationGroup = 'Playlist And Maps';

    protected static ?string $navigationLabel = 'Cctv';

    protected static ?string $modelLabel = 'Cctv';

    protected static ?string $pluralModelLabel = 'Cctv';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('building_id')
                    ->relationship('building', 'name')
                    ->searchable()
                    ->preload()
                    ->native(false)
                    ->searchPrompt('Search Building...')
                    ->required()
                    ->live(),
                Select::make('room_id')
                    ->relationship('room', 'name')
                    ->searchable()
                    ->preload()
                    ->native(false)
                    ->searchPrompt('Search Room...')
                    ->required()
                    ->live(),
                TextInput::make('name')
                    ->required(),
                TextInput::make('username')
                    ->default('admin'),
                TextInput::make('password')
                    ->password()
                    ->default('password.123'),
                TextInput::make('ip_address')
                    ->required()
                    ->ipv4(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('building.name')
                    ->searchable(),
                TextColumn::make('room.name')
                    ->searchable(),
                TextColumn::make('ip_address')
                    ->searchable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make()
                    ->button()
                    ->color('info')
                    ->size('lg'),
                EditAction::make()
                    ->button()
                    ->color('warning')
                    ->size('lg'),
                DeleteAction::make()
                    ->button()
                    ->color('danger')
                    ->size('lg'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageCctvs::route('/'),
        ];
    }
}
