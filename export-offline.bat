@echo off
echo ========================================================
echo  Exporting Docker Image for Offline Presentation
echo ========================================================
echo.
echo [1/2] Building Docker image...
docker compose build

echo.
echo [2/2] Saving image to crash-dashboard-offline.tar ...
docker save -o crash-dashboard-offline.tar crash-dashboard:latest

echo.
echo ========================================================
echo  [SUCCESS] File saved: crash-dashboard-offline.tar
echo  Copy this file and start-offline.bat to a USB flash drive!
echo ========================================================
pause
