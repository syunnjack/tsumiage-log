param(
  [int]$Count = 10,
  [string[]]$Slugs = @()
)

$ErrorActionPreference = 'Continue'
$root = Split-Path $PSScriptRoot -Parent
$queuePath = Join-Path $root 'app/data/video-production.json'
$queue = Get-Content $queuePath -Raw -Encoding UTF8 | ConvertFrom-Json
$logDir = Join-Path $root '.video-logs'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
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
    $stdout = Join-Path $logDir "$($target.slug).out.log"
    $stderr = Join-Path $logDir "$($target.slug).err.log"
    $process = Start-Process powershell.exe -ArgumentList @(
      '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File',
      (Join-Path $PSScriptRoot 'render-repository-video.ps1'), '-Slug', $target.slug
    ) -WorkingDirectory $root -WindowStyle Hidden -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
    if (-not $process.WaitForExit(150000)) {
      $process.Kill()
      throw 'Renderer timed out after 150 seconds.'
    }
    $expectedMp4 = Join-Path $root "video-assets/repositories/$($target.slug)/$($target.slug)-tech-preview.mp4"
    $expectedPptx = Join-Path $root "video-assets/repositories/$($target.slug)/$($target.slug)-tech-preview.pptx"
    $hasArtifacts = (Test-Path $expectedMp4) -and (Test-Path $expectedPptx) -and
      (Get-Item $expectedMp4).Length -gt 0 -and (Get-Item $expectedPptx).Length -gt 0 -and
      (Get-Item $expectedMp4).LastWriteTime -ge $started -and (Get-Item $expectedPptx).LastWriteTime -ge $started
    # 終了コードは artifact-tool の後片付けに書き換えられることがあるので、
    # 成否は生成物が今回の実行で作られたかどうかで判定する
    if (-not $hasArtifacts) {
      $detail = if (Test-Path $stderr) { Get-Content $stderr -Raw } else { '' }
      throw "Renderer did not create fresh artifacts (exit code $($process.ExitCode)). $detail"
    }
    $audioDir = Join-Path $root "video-assets/repositories/$($target.slug)/audio"
    Remove-Item -LiteralPath $audioDir -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item $stdout, $stderr -Force -ErrorAction SilentlyContinue
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
Remove-Item $logDir -Recurse -Force -ErrorAction SilentlyContinue
if ($results.status -contains 'failed') { exit 2 }
