param(
  [int]$Count = 10,
  [string[]]$Slugs = @()
)

$ErrorActionPreference = 'Continue'
$root = Split-Path $PSScriptRoot -Parent
$queuePath = Join-Path $root 'app/data/video-production.json'
$queue = Get-Content $queuePath -Raw -Encoding UTF8 | ConvertFrom-Json
$targets = if ($Slugs.Count) {
  @($queue.videos | Where-Object { $_.slug -in $Slugs })
} else {
  @($queue.videos | Where-Object status -eq 'queued' | Select-Object -First $Count)
}
$results = @()

foreach ($target in $targets) {
  Write-Output "Rendering $($target.slug)"
  $started = Get-Date
  try {
    Get-Process POWERPNT -ErrorAction SilentlyContinue |
      Where-Object { [string]::IsNullOrWhiteSpace($_.MainWindowTitle) } |
      Stop-Process -Force
    Start-Sleep -Seconds 6
    & (Join-Path $PSScriptRoot 'render-repository-video.ps1') -Slug $target.slug
    if (-not $?) { throw "Renderer exited with code $LASTEXITCODE" }
    $results += [PSCustomObject]@{ slug = $target.slug; status = 'rendered'; seconds = [Math]::Round(((Get-Date) - $started).TotalSeconds, 1) }
    Start-Sleep -Seconds 8
  } catch {
    Write-Warning "$($target.slug): $($_.Exception.Message)"
    $results += [PSCustomObject]@{ slug = $target.slug; status = 'failed'; seconds = [Math]::Round(((Get-Date) - $started).TotalSeconds, 1) }
    Get-Process POWERPNT -ErrorAction SilentlyContinue |
      Where-Object { [string]::IsNullOrWhiteSpace($_.MainWindowTitle) -and $_.StartTime -ge $started } |
      Stop-Process -Force
    Start-Sleep -Seconds 5
  }
}

$results | Format-Table -AutoSize
if ($results.status -contains 'failed') { exit 2 }
