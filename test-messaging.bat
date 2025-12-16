@echo off
echo ========================================
echo   TESTING CONNECTLY CHAT MESSAGING
echo ========================================
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd /d d:\Chat-Platform-Backend && npm start"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd /d d:\Chat-Platform && ng serve"

echo Waiting for frontend to start...
timeout /t 10 /nobreak > nul

echo.
echo ========================================
echo   READY FOR TESTING!
echo ========================================
echo.
echo 1. Open Chrome: http://localhost:4200
echo 2. Register as User1 (e.g., "alice")
echo 3. Open Chrome Incognito: http://localhost:4200  
echo 4. Register as User2 (e.g., "bob")
echo 5. Send messages between both users
echo.
echo If messages don't appear:
echo - Check browser console for errors
echo - Verify WebSocket connection in Network tab
echo - Check backend console for message logs
echo.
pause