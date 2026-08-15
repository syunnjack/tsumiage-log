param(
  [Parameter(Mandatory = $true)][string]$Slug
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$root = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $root
$queuePath = Join-Path $root 'app/data/video-production.json'
$queue = Get-Content $queuePath -Raw -Encoding UTF8 | ConvertFrom-Json
$item = $queue.videos | Where-Object slug -eq $Slug | Select-Object -First 1
if (-not $item) { throw "Video queue entry not found: $Slug" }

$outputDir = Join-Path $root "video-assets/repositories/$Slug"
$renderDir = Join-Path $outputDir 'rendered-slides'
$audioDir = Join-Path $outputDir 'audio'
$segmentDir = Join-Path $outputDir 'segments'
$pptxPath = Join-Path $outputDir "$Slug-tech-preview.pptx"
$mp4Path = Join-Path $outputDir "$Slug-tech-preview.mp4"

New-Item -ItemType Directory -Force -Path $outputDir, $renderDir, $audioDir, $segmentDir | Out-Null
Remove-Item -LiteralPath $pptxPath, $mp4Path -Force -ErrorAction SilentlyContinue
Get-ChildItem -LiteralPath $renderDir -File -ErrorAction SilentlyContinue | Remove-Item -Force
Get-ChildItem -LiteralPath $audioDir -File -ErrorAction SilentlyContinue | Remove-Item -Force
Get-ChildItem -LiteralPath $segmentDir -File -ErrorAction SilentlyContinue | Remove-Item -Force

& node (Join-Path $root 'scripts/create-repository-video-deck.mjs') $Slug $renderDir $pptxPath
if ($LASTEXITCODE -ne 0) { throw 'Headless slide rendering failed.' }

$ffmpegPath = Join-Path $root 'node_modules/ffmpeg-static/ffmpeg.exe'
if (-not (Test-Path -LiteralPath $ffmpegPath)) {
  throw 'ffmpeg-static executable was not found. Run npm install first.'
}
$edgeTts = Get-Command edge-tts -ErrorAction SilentlyContinue
$edgeVoice = 'ja-JP-NanamiNeural'

$slides = @($item.slides)
if ($slides.Count -ne 6 -or @($item.narration).Count -ne 6) {
  throw "Six Japanese slide and narration definitions are required for $Slug"
}

$segments = @()
for ($i = 0; $i -lt $slides.Count; $i++) {
  $number = '{0:D2}' -f ($i + 1)
  $pngPath = Join-Path $renderDir "slide-$number.png"
  $segmentPath = Join-Path $segmentDir "slide-$number.mp4"

  if ($edgeTts) {
    $audioPath = Join-Path $audioDir "slide-$number.mp3"
    & $edgeTts.Source --voice $edgeVoice --text ([string]$item.narration[$i]) --write-media $audioPath
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $audioPath) -or (Get-Item $audioPath).Length -eq 0) {
      throw "Japanese Edge TTS generation failed: $number"
    }
  } else {
    $audioPath = Join-Path $audioDir "slide-$number.wav"
    $speaker = [System.Speech.Synthesis.SpeechSynthesizer]::new()
    try {
      try { $speaker.SelectVoice('Microsoft Haruka Desktop') } catch { Write-Warning 'Microsoft Haruka Desktop was not found; using the default Japanese-capable voice.' }
      $speaker.Rate = 0
      $speaker.Volume = 100
      $speaker.SetOutputToWaveFile($audioPath)
      $speaker.Speak([string]$item.narration[$i])
    } finally {
      $speaker.Dispose()
    }
  }

  & $ffmpegPath -y -hide_banner -loglevel error -loop 1 -framerate 30 -i $pngPath -i $audioPath -filter_complex '[1:a]apad=pad_dur=1[a]' -map '0:v' -map '[a]' -c:v libx264 -preset medium -tune stillimage -c:a aac -b:a 160k -pix_fmt yuv420p -shortest -movflags +faststart $segmentPath
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $segmentPath) -or (Get-Item $segmentPath).Length -eq 0) {
    throw "Video segment rendering failed: $number"
  }
  $segments += $segmentPath
}

$concatPath = Join-Path $segmentDir 'concat.txt'
$concatLines = $segments | ForEach-Object { "file '$($_.Replace("'", "''"))'" }
[System.IO.File]::WriteAllLines($concatPath, $concatLines, [System.Text.UTF8Encoding]::new($false))
& $ffmpegPath -y -hide_banner -loglevel error -f concat -safe 0 -i $concatPath -c copy -movflags +faststart $mp4Path
if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $mp4Path) -or (Get-Item $mp4Path).Length -eq 0) {
  throw 'Final MP4 rendering failed.'
}

& node (Join-Path $root 'scripts/update-video-render-status.mjs') $Slug
if ($LASTEXITCODE -ne 0) { throw 'Video production status update failed.' }

Get-Item $mp4Path, $pptxPath | Select-Object FullName, Length
