Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Margadarshak AI Platform" -ForegroundColor Cyan
Write-Host "  Starting all services..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Starting Backend (FastAPI)..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PSScriptRoot\backend"
    uvicorn main:app --reload --port 8000
}

Write-Host "[2/2] Starting Frontend (Next.js)..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PSScriptRoot\frontend"
    npm run dev
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Services starting:" -ForegroundColor Green
Write-Host "  Frontend : http://localhost:3000" -ForegroundColor Green
Write-Host "  Backend  : http://localhost:8000" -ForegroundColor Green
Write-Host "  API Docs : http://localhost:8000/docs" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services..."
Write-Host ""

try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "Stopping services..." -ForegroundColor Yellow
    $backendJob | Stop-Job | Remove-Job
    $frontendJob | Stop-Job | Remove-Job
    Write-Host "All services stopped." -ForegroundColor Green
}
