@echo off
echo Starting Connectly Chat Platform...
echo.

echo Installing backend dependencies...
cd /d "D:\Chat-Platform-Backend"
call npm install

echo.
echo Starting backend server...
start "Backend Server" cmd /k "npm start"

echo.
echo Installing frontend dependencies...
cd /d "D:\Chat-Platform"
call npm install

echo.
echo Starting frontend development server...
start "Frontend Server" cmd /k "ng serve"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:4200
echo.
echo Press any key to exit...
pause > nul