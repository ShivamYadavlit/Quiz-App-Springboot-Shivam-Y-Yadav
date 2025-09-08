# 📋 Configuration Files Guide

## 🎯 Why Both Files Are Necessary

### `application.properties` - Development Configuration
**Purpose**: Used for local development and testing
**When Active**: Default profile (when no specific profile is set)
**Contains**: 
- Direct values for local development
- MongoDB Atlas connection (works for development)
- Fixed JWT and admin secrets (safe for development)
- CORS settings for localhost:3000

### `application-prod.properties` - Production Configuration  
**Purpose**: Used for production deployment (Render.com)
**When Active**: When `SPRING_PROFILES_ACTIVE=prod` environment variable is set
**Contains**:
- Environment variable placeholders (`${VAR_NAME:default}`)
- Production-optimized settings
- Security-focused configuration
- Multiple CORS origins for production

## 📁 Current Configuration Status

### ✅ `application.properties` (Development)
```properties
# Application Name
spring.application.name=Quiz-App

# Database - MongoDB Atlas
spring.data.mongodb.uri=mongodb+srv://shivamyadav2072000_db_user:3zLn63QvMRUkWqDl@cluster0.4emwg3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
spring.data.mongodb.database=quiz_app_db

# JWT Security
jwt.secret=mySecretKey123456789012345678901234567890123456789012345678901234567890
jwt.expiration=86400000

# CORS for development
cors.allowed.origins=http://localhost:3000

# Admin secret
admin.secret.key=YourCustomSecretKey2024!
```

### ✅ `application-prod.properties` (Production)
```properties
# Application Name
spring.application.name=Quiz-App
spring.profiles.active=prod
server.port=${PORT:8080}

# Database - Uses environment variables
spring.data.mongodb.uri=${MONGODB_URI:mongodb+srv://...}
spring.data.mongodb.database=${MONGODB_DATABASE:quiz_app_db}

# JWT Security - Uses environment variables
jwt.secret=${JWT_SECRET:mySecretKey...}
jwt.expiration=${JWT_EXPIRATION:86400000}

# CORS for production - Multiple origins
cors.allowed.origins=${CORS_ALLOWED_ORIGINS:http://localhost:3000,https://quiz-app-springboot-shivam-y-yadav-1.onrender.com}

# Admin secret - Uses environment variable
admin.secret.key=${ADMIN_SECRET_KEY:YourCustomSecretKey2024!}

# Production optimizations
spring.main.banner-mode=off
logging.level.com.Quiz.App=INFO
management.endpoints.web.exposure.include=health,info
```

## 🔄 How Spring Boot Chooses Configuration

### Local Development (No profile set)
1. Loads `application.properties`
2. Uses direct values
3. Perfect for local testing

### Production Deployment (profile=prod)
1. Loads `application.properties` (base)
2. **Overrides** with `application-prod.properties`
3. **Resolves** environment variables from Render Dashboard
4. Uses production optimizations

## 🚀 Deployment Environment Variables

For your Render.com deployment, ensure these environment variables are set:

```bash
# Required for production
SPRING_PROFILES_ACTIVE=prod
PORT=8080

# Database
MONGODB_URI=mongodb+srv://shivamyadav2072000_db_user:3zLn63QvMRUkWqDl@cluster0.4emwg3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DATABASE=quiz_app_db

# Security
JWT_SECRET=mySecretKey123456789012345678901234567890123456789012345678901234567890
JWT_EXPIRATION=86400000
ADMIN_SECRET_KEY=YourCustomSecretKey2024!

# CORS (update with your frontend URL when deployed)
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://quiz-app-springboot-shivam-y-yadav-1.onrender.com
```

## 🔧 Configuration Hierarchy

```
Environment Variables (Highest Priority)
    ↓
application-prod.properties (Profile-specific)
    ↓
application.properties (Base configuration)
```

## ✅ Benefits of This Setup

### Development Benefits
- ✅ Works immediately without environment setup
- ✅ Direct values for quick testing
- ✅ Uses same MongoDB Atlas (consistent data)
- ✅ No need to set environment variables locally

### Production Benefits  
- ✅ Secure (no secrets in code)
- ✅ Environment variables override defaults
- ✅ Production optimizations enabled
- ✅ Proper CORS for deployed frontend
- ✅ Health endpoints for monitoring

## 🎯 Testing Both Configurations

### Test Development Configuration
```bash
cd backend
$env:JAVA_HOME="C:\Program Files\Java\jdk-21"
.\mvnw.cmd spring-boot:run
```

### Test Production Configuration Locally
```bash
cd backend
$env:JAVA_HOME="C:\Program Files\Java\jdk-21"
$env:SPRING_PROFILES_ACTIVE="prod"
.\mvnw.cmd spring-boot:run
```

## 🔍 Troubleshooting

### If Development Mode Fails
- Check MongoDB Atlas network access
- Verify connection string credentials
- Ensure Java 21 is installed

### If Production Mode Fails
- Verify all environment variables are set in Render
- Check Render deployment logs
- Confirm MongoDB Atlas allows 0.0.0.0/0 access

Your configuration is now properly set up for both development and production environments!