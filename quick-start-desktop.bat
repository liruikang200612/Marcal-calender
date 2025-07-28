@echo off
echo 启动MarCal桌面版...
echo.
echo 正在检查依赖...
cd /d "%~dp0"
if not exist "node_modules" (
    echo 安装依赖中...
    npm install
)

echo.
echo 启动开发模式...
npm run electron:dev

pause