@echo off
chcp 65001 >nul
setlocal
title Ativação do Cérebro - Mythreon Online
cd /d "%~dp0"

echo.
echo  Mythreon Online - Cérebro v2
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

node scripts\brain-service.mjs
echo.
echo  O observador do Cerebro foi encerrado.
pause
