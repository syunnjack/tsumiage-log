param(
  [int]$Count = 0,
  [switch]$SkipCollection,
  [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$queuePath = Join-Path $root 'app/data/video-production.json'

function Invoke-NpmScript([string]$Name) {
  Write-Output "Running npm script: $Name"
  & npm.cmd run $Name
  if ($LASTEXITCODE -ne 0) {
    throw "npm run $Name failed with exit code $LASTEXITCODE"
  }
}

Push-Location $root
try {
  if (-not $SkipCollection) {
    Invoke-NpmScript 'content:collect'
  }

  Invoke-NpmScript 'video:queue'
  $queue = Get-Content $queuePath -Raw -Encoding UTF8 | ConvertFrom-Json
  $queued = @($queue.videos | Where-Object status -eq 'queued')
  $renderCount = if ($Count -gt 0) {
    [Math]::Min($Count, $queued.Count)
  } else {
    $queued.Count
  }

  if ($renderCount -gt 0) {
    $targets = @($queued | Select-Object -First $renderCount)
    Write-Output "Rendering $renderCount queued videos: $($targets.slug -join ', ')"
    & (Join-Path $PSScriptRoot 'render-video-batch.ps1') -Slugs $targets.slug
  } else {
    Write-Output 'No queued videos require rendering.'
  }

  Invoke-NpmScript 'video:queue'
  Invoke-NpmScript 'content:audit'
  Invoke-NpmScript 'manual:audit'
  Invoke-NpmScript 'copy:audit'
  Invoke-NpmScript 'video:audit'
  Invoke-NpmScript 'video:assets:complete'
  Invoke-NpmScript 'lint'
  if (-not $SkipBuild) {
    Invoke-NpmScript 'build'
  }

  $finalQueue = Get-Content $queuePath -Raw -Encoding UTF8 | ConvertFrom-Json
  $remaining = @($finalQueue.videos | Where-Object status -eq 'queued')
  $rendered = @($finalQueue.videos | Where-Object status -eq 'rendered')
  Write-Output "Video publication preparation completed: rendered=$($rendered.Count), queued=$($remaining.Count)"
  if ($remaining.Count -gt 0) {
    throw "Video publication preparation is incomplete: $($remaining.slug -join ', ')"
  }
} finally {
  Pop-Location
}
