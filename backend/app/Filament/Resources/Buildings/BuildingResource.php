<?php

namespace App\Filament\Resources\Buildings;

use App\Filament\Resources\Buildings\Pages\ManageBuildings;
use App\Models\Building;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TextInput\Mask;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Tables\Actions\Action;
use UnitEnum;

class BuildingResource extends Resource
{
    protected static ?string $model = Building::class;

    protected static string|UnitEnum|null $navigationGroup = 'Playlist And Maps';

    protected static ?string $navigationLabel = 'Building';

    protected static ?string $modelLabel = 'Building';

    protected static ?string $pluralModelLabel = 'Building';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('latitude'),
                TextInput::make('longitude'),
                TextInput::make('marker_icon_url')
                    ->label('Marker Icon URL (opsional)')
                    ->placeholder('https://.../icon.png')
                    ->default('https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-blue.png')
                    ->helperText('Kosongkan untuk pakai default pin peta. Jika diisi, gunakan URL ikon kustom.')
                    ->url(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
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
            'index' => ManageBuildings::route('/'),
        ];
    }
}
