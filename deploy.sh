#!/bin/bash

# Script to deploy the Quiz Application to Render

echo "Starting deployment process..."

# Add all changes
git add .

# Commit changes with a timestamp
echo "Committing changes..."
git commit -m "Deployment update - $(date)"

# Push to GitHub (triggers Render deployment)
echo "Pushing to GitHub..."
git push origin main

echo "Deployment initiated! Check Render dashboard for deployment status."
echo "Frontend: https://quiz-app-sp-frontend.onrender.com"
echo "Backend: https://quiz-app-springboot-shivam-y-yadav-3.onrender.com"