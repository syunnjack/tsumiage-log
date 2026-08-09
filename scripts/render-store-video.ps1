param(
  [Parameter(Mandatory = $true)][string]$Slug,
  [Parameter(Mandatory = $true)][string]$OutDir
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$root = Split-Path $PSScriptRoot -Parent
$queuePath = Join-Path $root 'app/data/store-videos.json'
$queue = Get-Content $queuePath -Raw -Encoding UTF8 | ConvertFrom-Json
$item = $queue.videos | Where-Object slug -eq $Slug | Select-Object -First 1
if (-not $item) { throw "Store video entry not found: $Slug" }

$renderDir = Join-Path $OutDir 'rendered-slides'
$audioDir = Join-Path $OutDir 'audio'
$segmentDir = Join-Path $OutDir 'segments'
$pptxPath = Join-Path $OutDir "$Slug-full.pptx"
$fullMp4Path = Join-Path $OutDir "$Slug-full.mp4"
$previewMp4Path = Join-Path $OutDir "$Slug-preview.mp4"

New-Item -ItemType Directory -Force -Path $OutDir, $renderDir, $audioDir, $segmentDir | Out-Null
Remove-Item -LiteralPath $pptxPath, $fullMp4Path, $previewMp4Path -Force -ErrorAction SilentlyContinue
Get-ChildItem -LiteralPath $renderDir -File -ErrorAction SilentlyContinue | Remove-Item -Force
Get-ChildItem -LiteralPath $audioDir -File -ErrorAction SilentlyContinue | Remove-Item -Force
Get-ChildItem -LiteralPath $segmentDir -File -ErrorAction SilentlyContinue | Remove-Item -Force

& node (Join-Path $root 'scripts/create-store-video-deck.mjs') $Slug $renderDir $pptxPath
if ($LASTEXITCODE -ne 0) { throw 'Headless slide rendering failed.' }

$ffmpegPath = & node -e "process.stdout.write(require('ffmpeg-static'))"
if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $ffmpegPath)) {
  throw 'ffmpeg-static executable was not found. Run npm install first.'
}

$slides = @($item.slides)
if ($slides.Count -ne 6 -or @($item.narration).Count -ne 6) {
  throw "Six Japanese slide and narration definitions are required for $Slug"
}

$segments = @()
for ($i = 0; $i -lt $slides.Count; $i++) {
  $number = '{0:D2}' -f ($i + 1)
  $pngPath = Join-Path $renderDir "slide-$number.png"
  $wavPath = Join-Path $audioDir "slide-$number.wav"
  $segmentPath = Join-Path $segmentDir "slide-$number.mp4"

  $speaker = [System.Speech.Synthesis.SpeechSynthesizer]::new()
  try {
    try { $speaker.SelectVoice('Microsoft Haruka Desktop') } catch { Write-Warning 'Microsoft Haruka Desktop was not found; using the default Japanese-capable voice.' }
    $speaker.Rate = 0
    $speaker.Volume = 100
    $speaker.SetOutputToWaveFile($wavPath)
    $speaker.Speak([string]$item.narration[$i])
  } finally {
    $speaker.Dispose()
  }

  & $ffmpegPath -y -hide_banner -loglevel error -loop 1 -framerate 30 -i $pngPath -i $wavPath -filter_complex '[1:a]apad=pad_dur=1[a]' -map '0:v' -map '[a]' -c:v libx264 -preset medium -tune stillimage -c:a aac -b:a 160k -pix_fmt yuv420p -shortest -movflags +faststart $segmentPath
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $segmentPath) -or (Get-Item $segmentPath).Length -eq 0) {
    throw "Video segment rendering failed: $number"
  }
  $segments += $segmentPath
}

# Full paid video (all 6 segments) -- this is the BOOTH deliverable, never committed to the public repo.
$concatPath = Join-Path $segmentDir 'concat-full.txt'
$concatLines = $segments | ForEach-Object { "file '$($_.Replace("'", "''"))'" }
[System.IO.File]::WriteAllLines($concatPath, $concatLines, [System.Text.UTF8Encoding]::new($false))
& $ffmpegPath -y -hide_banner -loglevel error -f concat -safe 0 -i $concatPath -c copy -movflags +faststart $fullMp4Path
if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $fullMp4Path) -or (Get-Item $fullMp4Path).Length -eq 0) {
  throw 'Full MP4 rendering failed.'
}

# Free preview (first freePreviewSlideCount segments only) -- this is safe to publish publicly.
$freeCount = if ($item.freePreviewSlideCount) { [int]$item.freePreviewSlideCount } else { 2 }
$previewSegments = $segments | Select-Object -First $freeCount
$previewConcatPath = Join-Path $segmentDir 'concat-preview.txt'
$previewConcatLines = $previewSegments | ForEach-Object { "file '$($_.Replace("'", "''"))'" }
[System.IO.File]::WriteAllLines($previewConcatPath, $previewConcatLines, [System.Text.UTF8Encoding]::new($false))
& $ffmpegPath -y -hide_banner -loglevel error -f concat -safe 0 -i $previewConcatPath -c copy -movflags +faststart $previewMp4Path
if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $previewMp4Path) -or (Get-Item $previewMp4Path).Length -eq 0) {
  throw 'Preview MP4 rendering failed.'
}

Get-Item $fullMp4Path, $previewMp4Path, $pptxPath | Select-Object FullName, Length
