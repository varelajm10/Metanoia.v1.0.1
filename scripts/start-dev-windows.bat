@echo off
echo Iniciando Metanoia v1.0.1 en modo desarrollo...
echo.

REM Configurar variables de entorno
set NODE_OPTIONS=--max-old-space-size=4096
set NODE_ENV=development

REM Verificar que Node.js esté instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js no está instalado o no está en el PATH
    pause
    exit /b 1
)

REM Verificar que npm esté instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: npm no está instalado o no está en el PATH
    pause
    exit /b 1
)

echo Variables de entorno configuradas:
echo NODE_OPTIONS=%NODE_OPTIONS%
echo NODE_ENV=%NODE_ENV%
echo.

echo Iniciando servidor de desarrollo...
echo El servidor estará disponible en: http://localhost:3000
echo.

REM Iniciar el servidor de desarrollo
npm run dev

pause

