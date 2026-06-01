@echo off
echo ============================================
echo   AI Urban Traffic Digital Twin Platform
echo   Starting all services...
echo ============================================
echo.

echo [1/2] Starting Backend (FastAPI)...
start "Backend" cmd /c "cd /d "%~dp0backend" && uvicorn main:app --reload --port 8000"

echo [2/2] Starting Frontend (Next.js)...
start "Frontend" cmd /c "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ============================================
echo  Services starting:
echo   Frontend : http://localhost:3000
echo   Backend  : http://localhost:8000
echo   API Docs : http://localhost:8000/docs
echo ============================================
echo.
echo  Press any key to stop all services...
echo.
pause >nul

echo Stopping services...
taskkill /f /fi "WINDOWTITLE eq Backend" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq Frontend" >nul 2>&1
echo All services stopped.
