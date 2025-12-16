@echo off
echo ========================================
echo   CONNECTLY CHAT - LIVE DEPLOYMENT
echo ========================================
echo.

echo Step 1: Building Frontend for Production...
cd /d "d:\Chat-Platform"
call ng build --configuration=production
if %errorlevel% neq 0 (
    echo Frontend build failed!
    pause
    exit /b 1
)
echo Frontend build completed successfully!
echo.

echo Step 2: Installing Backend Dependencies...
cd /d "d:\Chat-Platform-Backend"
call npm install
if %errorlevel% neq 0 (
    echo Backend dependency installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo ========================================
echo   READY FOR DEPLOYMENT!
echo ========================================
echo.
echo Next Steps:
echo 1. Deploy Backend to Railway:
echo    - Install Railway CLI: npm install -g @railway/cli
echo    - Login: railway login
echo    - Deploy: railway deploy
echo.
echo 2. Deploy Frontend to Vercel:
echo    - Install Vercel CLI: npm install -g vercel
echo    - Deploy: vercel --prod
echo.
echo 3. Update environment variables with your live domains
echo.
echo For detailed instructions, see DEPLOYMENT.md
echo.
pause