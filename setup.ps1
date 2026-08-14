$ErrorActionPreference = "Stop"

Write-Host "Invecho Local Environment Setup" -ForegroundColor Cyan

# Check for Admin
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "Please run this script as Administrator." -ForegroundColor Red
    Exit
}

$hostsPath = "$env:windir\System32\drivers\etc\hosts"
$domains = @("app.invecho.local", "api.invecho.local", "redis.invecho.local", "inspector.invecho.local", "proxy.invecho.local")

foreach ($domain in $domains) {
    if (-not (Get-Content $hostsPath | Select-String -Pattern $domain -Quiet)) {
        Write-Host "Adding $domain to hosts..." -ForegroundColor Cyan
        Add-Content -Path $hostsPath -Value "127.0.0.1 $domain"
    } else {
        Write-Host "$domain already exists in hosts." -ForegroundColor Green
    }
}

Write-Host "Building Docker images..." -ForegroundColor Cyan
docker compose build

Write-Host "Starting Docker containers..." -ForegroundColor Cyan
docker compose up -d

Write-Host "==========================================" -ForegroundColor Green
Write-Host " Invecho Environment is UP!               " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Frontend:    http://app.invecho.local"
Write-Host "Backend:     http://api.invecho.local"
Write-Host "Redis UI:    http://redis.invecho.local"
Write-Host "Inspector:   http://inspector.invecho.local"
Write-Host "Traefik UI:  http://proxy.invecho.local"
Write-Host "==========================================" -ForegroundColor Green
