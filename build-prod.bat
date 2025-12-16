@echo off
echo Building Connectly Chat Platform for Production...
echo.

echo Installing dependencies...
cd /d "D:\Chat-Platform"
call npm install

echo.
echo Building Angular application...
call ng build --configuration production

echo.
echo Production build completed!
echo Built files are in the dist/ directory
echo.

echo To serve the production build:
echo 1. Copy dist/ contents to your web server
echo 2. Ensure backend is running on port 8080
echo 3. Configure your web server to serve index.html for all routes
echo.
pause