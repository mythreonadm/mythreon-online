param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech

$ffmpeg = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages\Gyan.FFmpeg.Shared_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build-shared\bin\ffmpeg.exe'
if (-not (Test-Path -LiteralPath $ffmpeg)) {
  $ffmpeg = (Get-Command ffmpeg -ErrorAction SilentlyContinue).Source
}
if (-not $ffmpeg) { throw 'FFmpeg não encontrado. Instale Gyan.FFmpeg.Shared antes de executar este script.' }

$assetDir = Join-Path $ProjectRoot 'public\assets\storytelling'
$tempDir = Join-Path $env:TEMP 'mythreon-story-narration'
New-Item -ItemType Directory -Force -Path $assetDir, $tempDir | Out-Null

$scenes = @(
  @{ Base='falconxarvore'; Text='Na floresta de Lyss, a Essência despertou. O destino encontrou seu guardião.' },
  @{ Base='humanoxlobos'; Text='Os lobos avançaram. O medo era apenas o primeiro teste.' },
  @{ Base='humanoxfalcon'; Text='A Matriz respondeu. O humano recebeu a força do falcão.' },
  @{ Base='lupinoxfalcon'; Text='Homem e fera tornaram-se um só. Nascia a lenda de Mythreon.' }
)

$voice = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voice.SelectVoiceByHints(
  [System.Speech.Synthesis.VoiceGender]::Male,
  [System.Speech.Synthesis.VoiceAge]::Adult,
  0,
  [System.Globalization.CultureInfo]::GetCultureInfo('pt-BR')
)
$voice.Rate = 1
$voice.Volume = 100

foreach ($scene in $scenes) {
  $inputVideo = Join-Path $assetDir ($scene.Base + '.mp4')
  $wav = Join-Path $tempDir ($scene.Base + '.wav')
  $outputVideo = Join-Path $assetDir ($scene.Base + '-narrado.mp4')
  if (-not (Test-Path -LiteralPath $inputVideo)) { throw "Vídeo não encontrado: $inputVideo" }

  $voice.SetOutputToWaveFile($wav)
  $voice.Speak($scene.Text)
  $voice.SetOutputToDefaultAudioDevice()

  # Abaixa levemente o pitch e acrescenta uma reverberação curta, dando textura de cronista arcano.
  & $ffmpeg -y -i $inputVideo -i $wav -map 0:v:0 -map 1:a:0 -c:v copy -af 'asetrate=18742.5,aresample=22050,atempo=1.176,aecho=0.8:0.88:80:0.18' -c:a aac -b:a 160k -shortest -movflags +faststart $outputVideo
  if ($LASTEXITCODE -ne 0) { throw "Falha ao criar $outputVideo" }
}

$voice.Dispose()
Remove-Item -LiteralPath $tempDir -Recurse -Force -ErrorAction SilentlyContinue
Write-Host 'Quatro vídeos narrados criados em public/assets/storytelling.'
