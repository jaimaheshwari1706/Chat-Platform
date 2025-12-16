@echo off
echo Starting Chat Platform...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd /d d:\Chat-Platform-Backend && npm start"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd /d d:\Chat-Platform && ng serve"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:4200
echo.
echo Open two browser windows to test chat between users
pause