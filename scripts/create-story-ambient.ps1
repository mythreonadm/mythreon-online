$ErrorActionPreference = 'Stop'

# Gera as cenas do prólogo sem narração: remove o áudio original e mantém apenas
# uma camada discreta de sons da floresta, com fade para não cortar abruptamente.
$projectRoot = Split-Path -Parent $PSScriptRoot
$assetDir = Join-Path $projectRoot 'public\assets\storytelling'
$forest = Join-Path $projectRoot 'public\assets\music\forest.mp3'
$ffmpeg = (Get-Command ffmpeg -ErrorAction SilentlyContinue).Source
if (-not $ffmpeg) {
  $ffmpeg = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Filter ffmpeg.exe -Recurse -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName
}
if (-not $ffmpeg) { throw 'ffmpeg não foi encontrado. Instale o FFmpeg e tente novamente.' }
$ffprobe = Join-Path (Split-Path $ffmpeg -Parent) 'ffprobe.exe'
if (-not (Test-Path $forest)) { throw "Trilha de floresta não encontrada: $forest" }

$scenes = @('falconxarvore', 'humanoxlobos', 'humanoxfalcon', 'lupinoxfalcon')
foreach ($base in $scenes) {
  $input = Join-Path $assetDir "$base.mp4"
  $output = Join-Path $assetDir "$base-story.mp4"
  if (-not (Test-Path $input)) { throw "Cena não encontrada: $input" }

  $probe = if (Test-Path $ffprobe) { (& $ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $input 2>$null | Select-Object -First 1).Trim() } else { '' }
  $duration = 7.0
  [double]::TryParse($probe, [Globalization.NumberStyles]::Float, [Globalization.CultureInfo]::InvariantCulture, [ref]$duration) | Out-Null
  $fadeStart = [math]::Max(0.8, $duration - 1.0)
  $filter = 'volume=0.24,afade=t=in:st=0:d=0.8,afade=t=out:st={0}:d=1' -f ([string]::Format([Globalization.CultureInfo]::InvariantCulture, '{0:0.###}', $fadeStart))

  Write-Host "Gerando $base-story.mp4 ($duration s)"
  & $ffmpeg -y -i $input -stream_loop -1 -i $forest `
    -map 0:v:0 -map 1:a:0 -c:v copy -af $filter -c:a aac -b:a 128k `
    -shortest -movflags +faststart $output
  if ($LASTEXITCODE -ne 0) { throw "Falha ao gerar $output" }
}

Write-Host 'Cenas ambientais concluídas.'
