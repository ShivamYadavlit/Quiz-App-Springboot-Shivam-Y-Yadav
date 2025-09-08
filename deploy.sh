#!/bin/bash

# Bash deployment script for Quiz Application
# This script will build and deploy both frontend and backend

echo -e "\033[0;32m🚀 Starting Quiz Application Deployment...\033[0m"

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "\033[0;31m❌ Error: Please run this script from the root directory containing 'backend' and 'frontend' folders\033[0m"
    exit 1
fi

# Get current branch
branch=$(git rev-parse --abbrev-ref HEAD)
echo -e "\033[0;36m📂 Current branch: $branch\033[0m"

# Add all changes
echo -e "\033[1;33m📝 Adding all changes...\033[0m"
git add .

# Check if there are any changes to commit
if ! git diff --cached --quiet; then
    # Get commit message from user or use default
    read -p "Enter commit message (or press Enter for default): " commitMessage
    if [ -z "$commitMessage" ]; then
        commitMessage="Update Quiz Application - $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    # Commit changes
    echo -e "\033[1;33m💾 Committing changes...\033[0m"
    git commit -m "$commitMessage"
    
    # Push to remote repository
    echo -e "\033[1;33m📤 Pushing to remote repository...\033[0m"
    git push origin $branch
    
    if [ $? -eq 0 ]; then
        echo -e "\033[0;32m✅ Changes successfully pushed to remote repository!\033[0m"
    else
        echo -e "\033[0;31m❌ Error pushing to remote repository\033[0m"
        exit 1
    fi
else
    echo -e "\033[0;34mℹ️  No changes to commit\033[0m"
fi

echo -e "\033[0;32m🎉 Deployment process completed!\033[0m"
echo -e "\033[0;36m   The changes will be automatically deployed by Render\033[0m"
echo -e "\033[0;36m   Check your Render dashboard for deployment status\033[0m"