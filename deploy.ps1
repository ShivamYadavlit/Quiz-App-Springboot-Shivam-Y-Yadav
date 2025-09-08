#!/usr/bin/env pwsh

# PowerShell deployment script for Quiz Application
# This script will build and deploy both frontend and backend

Write-Host "🚀 Starting Quiz Application Deployment..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "backend" -PathType Container) -or -not (Test-Path "frontend" -PathType Container)) {
    Write-Host "❌ Error: Please run this script from the root directory containing 'backend' and 'frontend' folders" -ForegroundColor Red
    exit 1
}

# Get current branch
$branch = git rev-parse --abbrev-ref HEAD
Write-Host "📂 Current branch: $branch" -ForegroundColor Cyan

# Add all changes
Write-Host "📝 Adding all changes..." -ForegroundColor Yellow
git add .

# Check if there are any changes to commit
$changes = git diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
    # Get commit message from user or use default
    $commitMessage = Read-Host "Enter commit message (or press Enter for default)"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "Update Quiz Application - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    }
    
    # Commit changes
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
    git commit -m "$commitMessage"
    
    # Push to remote repository
    Write-Host "📤 Pushing to remote repository..." -ForegroundColor Yellow
    git push origin $branch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Changes successfully pushed to remote repository!" -ForegroundColor Green
    } else {
        Write-Host "❌ Error pushing to remote repository" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ℹ️  No changes to commit" -ForegroundColor Blue
}

Write-Host "🎉 Deployment process completed!" -ForegroundColor Green
Write-Host "   The changes will be automatically deployed by Render" -ForegroundColor Cyan
Write-Host "   Check your Render dashboard for deployment status" -ForegroundColor Cyan