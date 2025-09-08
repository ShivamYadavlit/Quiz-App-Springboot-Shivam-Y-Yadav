# PowerShell script to deploy the Quiz Application to Render

Write-Host "Starting deployment process..." -ForegroundColor Green

# Add all changes
Write-Host "Adding all changes..." -ForegroundColor Yellow
git add .

# Commit changes with a timestamp
Write-Host "Committing changes..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Deployment update - $timestamp"

# Push to GitHub (triggers Render deployment)
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Deployment initiated! Check Render dashboard for deployment status." -ForegroundColor Green
Write-Host "Frontend: https://quiz-app-sp-frontend.onrender.com" -ForegroundColor Cyan
Write-Host "Backend: https://quiz-app-springboot-shivam-y-yadav-3.onrender.com" -ForegroundColor Cyan