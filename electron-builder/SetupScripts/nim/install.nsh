
Var OLD_PATH 
!macro beforeInstall
    nsProcess::_FindProcess "QMC_ASG_Server.exe"
    Pop $R0
    ${If} $R0 = 0
        nsProcess::_KillProcess "QMC_ASG_Server.exe"
        Pop $R0
        Sleep 500
    ${EndIf}
  ReadRegStr $0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_PATHNAME}"  UninstallString
  ReadRegStr $1 HKCU "SOFTWARE\QMC\${PRONAME}"  InstallLocation
  uninstall: 
  ${If} $0 != ''
    StrCpy $OLD_PATH $0 -10  
    ExecWait '"$0" /S /D=$1 _?=$OLD_PATH'
    Sleep 500
  ${Endif}
!macroend

!macro customInstall
    WriteRegStr HKCU "SOFTWARE\QMC\${PRONAME}" InstallLocation $INSTDIR
    ReadRegStr $0 HKLM "SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\WinPcapInst" 'DisplayIcon'
    ${If} $0 == ""
        ; nsNiuniuSkin::SetControlAttribute $hInstallDlg "wintips" "visible" "true"
        ExecWait  "$INSTDIR\resources\vc\WinPcap_4_1_3.exe"  "$1" 
        
        ; ExecShell "" "$INSTDIR\resources\vc\WinPcap_4_1_3.exe"
        ; ${If} $1 == 0
    ${EndIf}
    ; nsExec::Exec "$INSTDIR\resources\vc\ConfigureNetwork.exe" 
    ; Pop $2
    ; MessageBox MB_OK "返回值$2"
    nsNiuniuSkin::SetControlAttribute $hInstallDlg "slrProgress" "value" "100"	
    nsNiuniuSkin::SetControlAttribute $hInstallDlg "progress_pos" "text" "100%"
    ; ExecShell  "" "$INSTDIR\resources\vc\vc_redist.x64.exe"  "/quiet"
!macroend

!macro customUnInit
    nsProcess::_FindProcess "ASG24100.exe"
    Pop $R1
    ${If} $R1 = 0
        nsProcess::_KillProcess "ASG24100.exe"
    ${EndIf}
    nsProcess::_FindProcess "QMC_ASG_Server.exe"
    Pop $R0
    ${If} $R0 = 0
        nsProcess::_KillProcess "QMC_ASG_Server.exe"
        Pop $R0
        Sleep 500
    ${EndIf}
!macroend

!macro customUnInstall
  DeleteRegKey /ifempty HKCU "SOFTWARE\QMC\${PRONAME}"
  RMDir $INSTDIR
!macroend

