@echo off
:: Kill any existing Vite dev server on port 5174
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5174" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: Launch dashboard
cd /d "D:\VFXellence-LTD\polymath\apps\dashboard"
start "Polymath Dashboard" cmd /c "pnpm dev"

:: Wait for server then open browser
timeout /t 3 /nobreak >nul
start http://localhost:5174
