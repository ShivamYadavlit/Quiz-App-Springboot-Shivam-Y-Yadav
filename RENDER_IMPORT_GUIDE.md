# 🚀 Render Environment Variables Import Guide

## 📋 Quick Import Instructions

### Method 1: Copy Each Variable Individually
Go to your Render Dashboard → Your Service → Environment Tab

Copy and paste each line from `render-environment-variables.env`:

```
Variable Name: SPRING_PROFILES_ACTIVE
Value: prod

Variable Name: PORT  
Value: 8080

Variable Name: MONGODB_URI
Value: mongodb+srv://shivamyadav2072000_db_user:3zLn63QvMRUkWqDl@cluster0.4emwg3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

Variable Name: MONGODB_DATABASE
Value: quiz_app_db

Variable Name: JWT_SECRET
Value: mySecretKey123456789012345678901234567890123456789012345678901234567890

Variable Name: JWT_EXPIRATION
Value: 86400000

Variable Name: CORS_ALLOWED_ORIGINS
Value: http://localhost:3000,https://quiz-app-springboot-shivam-y-yadav-1.onrender.com,https://quiz-app-frontend.onrender.com

Variable Name: ADMIN_SECRET_KEY
Value: YourCustomSecretKey2024!
```

### Method 2: Bulk Import (If Render Supports)
Some platforms allow bulk import. If available, use the content from `render-environment-variables.env`

## ✅ Verification Checklist

After adding all environment variables:

- [ ] SPRING_PROFILES_ACTIVE = prod
- [ ] PORT = 8080  
- [ ] MONGODB_URI = (long connection string)
- [ ] MONGODB_DATABASE = quiz_app_db
- [ ] JWT_SECRET = (64+ character string)
- [ ] JWT_EXPIRATION = 86400000
- [ ] CORS_ALLOWED_ORIGINS = (comma-separated URLs)
- [ ] ADMIN_SECRET_KEY = YourCustomSecretKey2024!

## 🔄 After Import

1. **Save** all environment variables
2. **Deploy** your service (Manual Deploy → Deploy Latest Commit)
3. **Test** health endpoint: https://quiz-app-springboot-shivam-y-yadav-1.onrender.com/actuator/health
4. **Verify** API works: https://quiz-app-springboot-shivam-y-yadav-1.onrender.com/api/quiz/available

## 📁 Files Created for You

1. **`render-environment-variables.env`** - Exact environment variables for Render
2. **`application-prod-direct.properties`** - Production config with direct values
3. **This guide** - Step-by-step import instructions

Your backend should work perfectly once these environment variables are imported into Render!