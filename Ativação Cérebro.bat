@echo off
setlocal
title Ativação do Cérebro - Mythreon Online
cd /d "%~dp0"

echo.
echo  Mythreon Online - Cérebro ativo
echo  Sincronizando o índice e o vault do Obsidian...
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao foi encontrado. Instale o Node.js LTS e tente novamente.
  pause
  exit /b 1
)

if not exist "scripts\mythreon-brain.mjs" (
  echo Este arquivo precisa ficar na raiz da pasta MYTHREON ONLINE.
  pause
  exit /b 1
)

call npm run brain:watch
echo.
echo  O observador do Cerebro foi encerrado.
pause
