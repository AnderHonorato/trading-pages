@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)
netsh advfirewall firewall delete rule name="Trading Pages v11 LAN 4312" >nul 2>&1
netsh advfirewall firewall add rule name="Trading Pages v11 LAN 4312" dir=in action=allow protocol=TCP localport=4312 remoteip=LocalSubnet profile=private,public
echo.
echo Acesso Wi-Fi do Trading Pages liberado somente para a rede local.
pause
