# Quick Start Script for VEXO E-Commerce

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "VEXO E-Commerce - Quick Start" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check MongoDB
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoService -and $mongoService.Status -eq "Running") {
    Write-Host "[OK] MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "[WARNING] MongoDB is not running" -ForegroundColor Red
    Write-Host "Please start MongoDB manually:" -ForegroundColor Yellow
    Write-Host "  Option 1: net start MongoDB (as Administrator)" -ForegroundColor White
    Write-Host "  Option 2: mongod --dbpath C:\\data\\db" -ForegroundColor White
    Write-Host ""
}

# Check if Spring Boot is running
Write-Host "Checking Spring Boot backend..." -ForegroundColor Yellow
$javaProcess = Get-Process -Name java -ErrorAction SilentlyContinue
if ($javaProcess) {
    Write-Host "[OK] Spring Boot appears to be running" -ForegroundColor Green
} else {
    Write-Host "[INFO] Starting Spring Boot backend..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList ''-NoExit'', ''-Command'', ''cd ""C:\\Users\\Spectre\\Downloads\\campusProject\\campusProject""; Write-Host ""Starting Spring Boot..."" -ForegroundColor Cyan; .\\mvnw.cmd spring-boot:run''
    Write-Host "[OK] Spring Boot starting in new window..." -ForegroundColor Green
}

Write-Host ""
Write-Host "Waiting for backend to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Test backend API
try {
    $response = Invoke-WebRequest -Uri ''http://localhost:8080/api/products'' -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "[OK] Backend API is responding" -ForegroundColor Green
    $products = ($response.Content | ConvertFrom-Json)
    Write-Host "[OK] Found $($products.Count) products in database" -ForegroundColor Green
} catch {
    Write-Host "[WARNING] Backend API not ready yet. It may still be starting up." -ForegroundColor Yellow
    Write-Host "Please wait a minute and check: http://localhost:8080/api/products" -ForegroundColor White
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend API: http://localhost:8080/api/products" -ForegroundColor White
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
