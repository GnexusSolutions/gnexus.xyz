@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://127.0.0.1:3951/
  py -m http.server 3951 --bind 127.0.0.1
  exit /b
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://127.0.0.1:3951/
  python -m http.server 3951 --bind 127.0.0.1
  exit /b
)
echo Python 3 is required to run the local static server.
pause
