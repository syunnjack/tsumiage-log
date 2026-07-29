param(
  [Parameter(Mandatory = $true)][string]$Slug
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$root = Split-Path $PSScriptRoot -Parent
$queue = Get-Content (Join-Path $root 'app/data/video-production.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$item = $queue.videos | Where-Object slug -eq $Slug | Select-Object -First 1
if (-not $item) { throw "Video queue entry not found: $Slug" }

$outputDir = Join-Path $root "public/videos/repositories/$Slug"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
$pptxPath = Join-Path $outputDir "$Slug-tech-preview.pptx"
$mp4Path = Join-Path $outputDir "$Slug-tech-preview.mp4"
$audioDir = Join-Path $outputDir 'audio'
New-Item -ItemType Directory -Force -Path $audioDir | Out-Null

function Add-Text($slide, $text, $left, $top, $width, $height, $size, $bold = $false, $color = 0x111111) {
  $shape = $slide.Shapes.AddTextbox(1, $left, $top, $width, $height)
  $shape.TextFrame.TextRange.Text = $text
  $shape.TextFrame.TextRange.Font.Name = 'Arial'
  $shape.TextFrame.TextRange.Font.Size = $size
  $shape.TextFrame.TextRange.Font.Bold = [int]$bold * -1
  $shape.TextFrame.TextRange.Font.Color.RGB = $color
  return $shape
}

$slides = @(
  @{ title = "$($item.repository) TECH EXPLANATION"; body = "Architecture, implementation and commit history in 75 seconds" },
  @{ title = 'WHAT DOES IT SOLVE?'; body = $item.description },
  @{ title = 'TECH STACK'; body = "Primary technologies: $($item.language)" },
  @{ title = 'REPOSITORY HIGHLIGHTS'; body = "Public source code, README and commit history reveal the design decisions." },
  @{ title = 'ITERATIVE IMPROVEMENT'; body = 'Small commits continuously improve features, quality and release readiness.' },
  @{ title = 'READ THE FULL ARTICLE'; body = "$($item.articleUrl)`n`nTSUMIAGE LOG" }
)

$powerPoint = New-Object -ComObject PowerPoint.Application
$presentation = $null
try {
  $powerPoint.Visible = -1
  $presentation = $powerPoint.Presentations.Add()
  $presentation.PageSetup.SlideWidth = 960
  $presentation.PageSetup.SlideHeight = 540
  for ($i = 0; $i -lt $slides.Count; $i++) {
    $slide = $presentation.Slides.Add($i + 1, 12)
    $slide.Background.Fill.ForeColor.RGB = 0xF5F2E9
    [void](Add-Text $slide 'TSUMIAGE LOG / TECH VIDEO' 42 32 850 32 16 $true 0x356F55)
    [void](Add-Text $slide $slides[$i].title 42 130 850 105 34 $true)
    [void](Add-Text $slide $slides[$i].body 42 270 850 170 20 $false 0x333333)
    [void](Add-Text $slide ('{0:D2}' -f ($i + 1)) 875 490 45 20 10 $false 0x666666)

    $wav = Join-Path $audioDir ('slide-{0:D2}.wav' -f ($i + 1))
    $speaker = [System.Speech.Synthesis.SpeechSynthesizer]::new()
    try {
      $speaker.SelectVoice('Microsoft Haruka Desktop')
      $speaker.SetOutputToWaveFile($wav)
      $speaker.Speak([string]$item.narration[$i])
    } finally { $speaker.Dispose() }
    $player = New-Object -ComObject WMPlayer.OCX
    $duration = [Math]::Max([double]$player.newMedia($wav).duration + 1, 5)
    [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($player)
    $media = $slide.Shapes.AddMediaObject2($wav, 0, -1, -20, -20, 1, 1)
    $media.AnimationSettings.PlaySettings.PlayOnEntry = -1
    $media.AnimationSettings.PlaySettings.HideWhileNotPlaying = -1
    $slide.SlideShowTransition.AdvanceOnTime = -1
    $slide.SlideShowTransition.AdvanceTime = $duration
  }
  $presentation.SaveAs($pptxPath)
  $presentation.CreateVideo($mp4Path, -1, 5, 720, 30, 80)
  $deadline = (Get-Date).AddMinutes(15)
  while ((Get-Date) -lt $deadline -and [int]$presentation.CreateVideoStatus -notin 3, 4) { Start-Sleep -Seconds 5 }
  if ([int]$presentation.CreateVideoStatus -ne 3) { throw 'Video export failed or timed out.' }
} finally {
  if ($presentation) { $presentation.Close(); [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($presentation) }
  try { $powerPoint.Quit() } catch {}
  [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($powerPoint)
}

Get-Item $mp4Path, $pptxPath | Select-Object FullName, Length
