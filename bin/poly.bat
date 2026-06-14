@echo off
:: Kill any existing Mission Control dev servers (client 5174 + API 4500)
for %%p in (5174 4500) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%%p" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a >nul 2>&1
    )
)

:: Launch Mission Control (server + client via concurrently)
cd /d "D:\VFXellence-LTD\.canon\.mission-control"
start "Polymath Mission Control" cmd /c "pnpm dev"

:: Wait for server boot then open browser
timeout /t 6 /nobreak >nul
start http://localhost:5174
