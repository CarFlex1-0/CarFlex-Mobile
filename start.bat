@echo off
title CarFlex Startup Script

:: Start Server in new PowerShell window
start powershell -NoExit -Command "cd ..\CarFlex1.0\server\ ; npm run dev"

:: Start OBD Proxy in new PowerShell window
start powershell -NoExit -Command "cd .\server ; node obd-proxy.js"

:: Start ELM in new PowerShell window
start powershell -NoExit -Command "python -m elm -n 35000 -v 3"

:: Start Expo in Terminal
start cmd /k "yarn expo start"

echo All services started successfully!
pause


