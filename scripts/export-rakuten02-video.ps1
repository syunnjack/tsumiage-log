param(
  [Parameter(Mandatory = $true)][string]$PresentationPath,
  [Parameter(Mandatory = $true)][string]$NarrationJsonPath,
  [Parameter(Mandatory = $true)][string]$VideoPath
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech

$audioDir = Join-Path (Split-Path $NarrationJsonPath -Parent) 'audio'
New-Item -ItemType Directory -Force -Path $audioDir | Out-Null
$narrations = Get-Content -LiteralPath $NarrationJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
$durations = @()

for ($index = 0; $index -lt $narrations.Count; $index++) {
  $wavPath = Join-Path $audioDir ('slide-{0:D2}.wav' -f ($index + 1))
  $speaker = [System.Speech.Synthesis.SpeechSynthesizer]::new()
  try {
    $speaker.SelectVoice('Microsoft Haruka Desktop')
    $speaker.Rate = 0
    $speaker.Volume = 100
    $speaker.SetOutputToWaveFile($wavPath)
    $speaker.Speak([string]$narrations[$index])
  }
  finally {
    $speaker.Dispose()
  }

  $player = New-Object -ComObject WMPlayer.OCX
  try {
    $media = $player.newMedia($wavPath)
    $durations += [Math]::Max([double]$media.duration + 1.2, 5.0)
  }
  finally {
    [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($player)
  }
}

$powerPoint = New-Object -ComObject PowerPoint.Application
$presentation = $null
try {
  $powerPoint.Visible = -1
  $presentation = $powerPoint.Presentations.Open($PresentationPath, 0, 0, 0)

  for ($index = 1; $index -le $presentation.Slides.Count; $index++) {
    $slide = $presentation.Slides.Item($index)
    $wavPath = Join-Path $audioDir ('slide-{0:D2}.wav' -f $index)
    $media = $slide.Shapes.AddMediaObject2($wavPath, 0, -1, -20, -20, 1, 1)
    $media.AnimationSettings.PlaySettings.PlayOnEntry = -1
    $media.AnimationSettings.PlaySettings.HideWhileNotPlaying = -1
    $slide.SlideShowTransition.AdvanceOnTime = -1
    $slide.SlideShowTransition.AdvanceTime = $durations[$index - 1]
  }

  $presentation.Save()
  if (Test-Path -LiteralPath $VideoPath) { Remove-Item -LiteralPath $VideoPath -Force }
  $presentation.CreateVideo($VideoPath, -1, 5, 1080, 30, 85)

  $deadline = (Get-Date).AddMinutes(15)
  while ((Get-Date) -lt $deadline) {
    Start-Sleep -Seconds 5
    $status = [int]$presentation.CreateVideoStatus
    if ($status -eq 3) { break }
    if ($status -eq 4) { throw 'PowerPoint video export failed.' }
  }
  if ([int]$presentation.CreateVideoStatus -ne 3) { throw 'PowerPoint video export timed out.' }
}
finally {
  if ($null -ne $presentation) {
    $presentation.Close()
    [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($presentation)
  }
  try { $powerPoint.Quit() } catch { Write-Warning "PowerPoint was already closing: $($_.Exception.Message)" }
  [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($powerPoint)
}

Get-Item -LiteralPath $VideoPath | Select-Object FullName, Length, LastWriteTime
