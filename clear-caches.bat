@echo off
echo Clearing all caches...

echo.
echo 1. Clearing Next.js cache...
cd /d d:\Kilang\v0-pertamina-frontend-build
if exist .next rmdir /s /q .next
echo Next.js cache cleared.

echo.
echo 2. Clearing Laravel cache...
cd /d d:\Kilang\backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan filament:clear-cached-components
echo Laravel cache cleared.

echo.
echo 3. Clearing browser cache instructions:
echo Please manually clear your browser cache:
echo - Press Ctrl+Shift+Delete
echo - Select "All time" for time range
echo - Check "Cached images and files"
echo - Click "Clear data"

echo.
echo All caches cleared! Press any key to exit...
pause >nul