	
@echo off
cd %~dp0
for /F "tokens=2 delims=, " %%i in  (' findstr  \"name\" ^< ../package.json ') do SET name=%%~i
for /F "tokens=2 delims=, " %%v in  (' findstr \"version\" ^< ../package.json ') do SET version=%%~v
SET PRO_NAME=/DPRONAME=%name%
SET PRO_VERSION=/DPROVERSION=%version%.6051
SET OUT_FILE_VER=/DOUTFILEVER=%version%
echo "%PRO_NAME%,%PRO_VERSION%"