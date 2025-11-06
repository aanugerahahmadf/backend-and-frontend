<?php

namespace App\Filament\Resources\Rooms;

use UnitEnum;
use BackedEnum;
use App\Models\Room;
use Filament\Tables\Table;
use Filament\Schemas\Schema;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Resource;
use Filament\Actions\DeleteAction;
use Filament\Support\Icons\Heroicon;
use Filament\Actions\BulkActionGroup;
use Filament\Forms\Components\Select;
use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use App\Filament\Resources\Rooms\Pages\ManageRooms;

class RoomResource extends Resource
{
    protected static ?string $model = Room::class;

    protected static string|UnitEnum|null $navigationGroup = 'Playlist And Maps';

    protected static ?string $navigationLabel = 'Room';

    protected static ?string $modelLabel = 'Room';

    protected static ?string $pluralModelLabel = 'Room';

    protected static ?int $navigationSort = 2;


    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                Select::make('building_id')
                    ->relationship('building', 'name')
                    ->searchable()
                    ->preload()
                    ->native(false)
                    ->searchPrompt('Search Building...')
                    ->required()
                    ->live(),
                TextInput::make('latitude'),
                TextInput::make('longitude'),
                TextInput::make('marker_icon_url')
                    ->label('Marker Icon')
                    ->placeholder('https://blade-ui-kit.com/blade-icons/tabler-device-cctv-f')
                    ->default('https://blade-ui-kit.com/blade-icons/tabler-device-cctv-f')
                    ->helperText('Enter a custom marker icon URL or leave blank to use the default green CCTV icon.'),
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
                TextColumn::make('latitude')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('longitude')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('marker_icon_url')
                    ->searchable()
                    ->toggleable(),
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
            'index' => ManageRooms::route('/'),
        ];
    }
}
