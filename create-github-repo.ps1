# Run this AFTER: gh auth login
# Creates the repo on GitHub and pushes your code.

$ErrorActionPreference = "Stop"
Push-Location $PSScriptRoot

# Ensure GitHub CLI is on PATH (e.g. after fresh install or new terminal)
$ghPath = "C:\Program Files\GitHub CLI"
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    $env:Path = "$ghPath;$env:Path"
}

gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in. Run this first: gh auth login --web --git-protocol https" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    Pop-Location
    exit 1
}

Write-Host "Creating repo and pushing..." -ForegroundColor Cyan
gh repo create new_livesite_widget --public --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host "Done. Repo: https://github.com/$(gh api user -q .login)/new_livesite_widget" -ForegroundColor Green
}
Pop-Location
