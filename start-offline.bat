@echo off
echo ========================================================
echo  Starting Offline Crash Analytics Dashboard Backup
echo ========================================================
echo.

:: If tar archive exists and image not yet loaded, load it
if exist crash-dashboard-offline.tar (
    echo [*] Found crash-dashboard-offline.tar, loading image...
    docker load -i crash-dashboard-offline.tar
)

echo [*] Launching container on port 8080...
docker compose up -d

echo.
echo ========================================================
echo  [SUCCESS] Dashboard is running at: http://localhost:8080
echo ========================================================
echo.
pause
