@echo off
echo Starting development servers...

echo.
echo 1. Starting Laravel backend server...
cd /d d:\Kilang\backend
start "Laravel Server" cmd /k "php artisan serve"

echo.
echo 2. Starting Next.js frontend development server...
cd /d d:\Kilang\v0-pertamina-frontend-build
start "Next.js Server" cmd /k "npm run dev"

echo.
echo Servers started:
echo - Laravel backend API: http://127.0.0.1:8000/api/v1/
echo - Laravel admin panel: http://127.0.0.1:8000/admin
echo - Next.js frontend: http://localhost:3000/
echo.
echo Press any key to close this window...
pause >nul