@REM @call makeapp.bat

@call makeskinzip.bat nim
call config.bat
".\NSIS\makensis.exe" %PRO_VERSION% %OUT_FILE_VER% %PRO_NAME% ".\SetupScripts\nim\nim_setup.nsi"
echo "creat latest.yml..."
node versionFile.js "%name%_setup_%version%.exe" "%version%"
@rem 如果要调试错误，请使用下面的脚本，这样会打开编译界面（命令行界面中文会显示成?号）
@rem ".\NSIS\makensisw.exe" ".\SetupScripts\nim\nim_setup.nsi"
@pause
