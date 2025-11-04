@echo off
echo Building and deploying frontend to Laravel...

echo.
echo 1. Building Next.js frontend...
cd /d d:\Kilang\v0-pertamina-frontend-build
npm run build

echo.
echo 2. Removing old build files from Laravel public directory...
cd /d d:\Kilang\backend
if exist public\*.html del /q public\*.html
if exist public\*.js del /q public\*.js
if exist public\*.css del /q public\*.css
if exist public\server.js del /q public\server.js
if exist public\package.json del /q public\package.json
if exist public\_next rmdir /s /q public\_next
if exist public\.next rmdir /s /q public\.next

echo.
echo 3. Copying new build files to Laravel public directory...
cd /d d:\Kilang\v0-pertamina-frontend-build
xcopy /E /I .next\standalone\* ..\backend\public\
xcopy /E /I .next\static ..\backend\public\_next\static

echo.
echo 4. Creating proper index.html...
cd /d d:\Kilang\backend\public
echo ^<!DOCTYPE html^> > index.html
echo ^<html lang="en"^> >> index.html
echo   ^<head^> >> index.html
echo     ^<meta charset="utf-8"^> >> index.html
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1"^> >> index.html
echo     ^<title^Kilang Pertamina International^</title^> >> index.html
echo     ^<link rel="icon" href="/favicon.ico" sizes="any" /^> >> index.html
echo   ^</head^> >> index.html
echo   ^<body^> >> index.html
echo     ^<div id="__next"^>^</div^> >> index.html
echo     ^<script src="/_next/static/chunks/webpack.js"^>^</script^> >> index.html
echo   ^</body^> >> index.html
echo ^</html^> >> index.html

echo.
echo 5. Restarting Laravel server...
echo To start the server, run: php artisan serve

echo.
echo Deployment complete! Access at http://127.0.0.1:8000/
pause