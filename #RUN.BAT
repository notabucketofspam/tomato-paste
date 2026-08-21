@ECHO off
ECHO build
CALL build
ECHO.

ECHO z_run
CALL z_run
ECHO.

ECHO push_II
CD notkeys
CALL mexec "./push_II.sh"
ECHO.

ECHO DONE
timeout /t 10
