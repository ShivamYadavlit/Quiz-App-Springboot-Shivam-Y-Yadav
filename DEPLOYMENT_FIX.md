# 🚀 Deployment Fix Guide

## 🔴 Current Issue
The Spring Boot application is failing to start on Render.com due to:
1. **Missing environment variables** for JWT and admin configuration
2. **Wrong database configuration** (trying to connect to localhost instead of MongoDB Atlas)

## ✅ Solution: Configure Environment Variables on Render.com

### Step 1: Access Render Dashboard
1. Go to your Render.com dashboard
2. Navigate to your Quiz App backend service
3. Go to the **Environment** tab

### Step 2: Set Required Environment Variables

Add these environment variables in the Render Dashboard:

```bash
# JWT Configuration
JWT_SECRET=mySecretKey123456789012345678901234567890123456789012345678901234567890
JWT_EXPIRATION=86400000

# Admin Configuration  
ADMIN_SECRET_KEY=YourCustomSecretKey2024!

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://shivamyadav2072000_db_user:3zLn63QvMRUkWqDl@cluster0.4emwg3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DATABASE=quiz_app_db

# CORS Configuration (update with your actual frontend URL)
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://quiz-app-springboot-shivam-y-yadav-1.onrender.com

# Server Configuration
PORT=8080
```

### Step 3: Verify Production Profile
Ensure your build command uses the production profile:
```bash
./mvnw clean package -DskipTests -Dspring.profiles.active=prod
```

### Step 4: Deploy
After adding environment variables, trigger a new deployment.

## 🔧 Alternative: Use .env File (for local testing)

Create a `.env` file in the backend directory:
```bash
JWT_SECRET=mySecretKey123456789012345678901234567890123456789012345678901234567890
JWT_EXPIRATION=86400000
ADMIN_SECRET_KEY=YourCustomSecretKey2024!
MONGODB_URI=mongodb+srv://shivamyadav2072000_db_user:3zLn63QvMRUkWqDl@cluster0.4emwg3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DATABASE=quiz_app_db
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## 🎯 Expected Result
After configuration:
- ✅ JWT authentication will work
- ✅ MongoDB Atlas connection will be established
- ✅ Admin functionality will be available
- ✅ CORS will allow frontend communication

## 🔍 Troubleshooting
If issues persist:
1. Check Render logs for any remaining errors
2. Verify MongoDB Atlas allows connections from 0.0.0.0/0
3. Ensure environment variables are saved and deployment is triggered