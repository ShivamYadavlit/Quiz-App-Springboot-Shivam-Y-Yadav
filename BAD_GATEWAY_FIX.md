# 🚨 Bad Gateway Error - Complete Fix Guide

## 🔍 Current Issue: https://quiz-app-springboot-shivam-y-yadav-3.onrender.com
Error: **502 Bad Gateway** - Service unavailable

## 🎯 Most Likely Causes & Solutions

### Cause 1: MongoDB Connection Failure (Most Likely)
**Symptom**: Application starts but crashes during DataInitializer
**Solution**: Fix environment variables

#### ✅ Correct Environment Variables for Render:
```bash
SPRING_PROFILES_ACTIVE=prod
PORT=8080
MONGODB_URI=mongodb+srv://shivamyadav2072000_db_user:3zLn63QvMRUkWqDl@cluster0.4emwg3d.mongodb.net/quiz_app_db?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DATABASE=quiz_app_db
JWT_SECRET=mySecretKey123456789012345678901234567890123456789012345678901234567890
JWT_EXPIRATION=86400000
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://quiz-app-springboot-shivam-y-yadav-3.onrender.com
ADMIN_SECRET_KEY=YourCustomSecretKey2024!
```

**Key Fix**: Ensure `MONGODB_URI` includes `/quiz_app_db` in the path.

### Cause 2: Service Crash Loop
**Symptom**: Service keeps restarting
**Solution**: Check logs and restart service

### Cause 3: Health Check Timeout
**Symptom**: Service starts but doesn't respond to health checks
**Solution**: Verify health endpoint works

## 🛠️ Immediate Action Steps

### Step 1: Check Service Status
1. Go to **Render Dashboard**
2. Find service: `quiz-app-springboot-shivam-y-yadav-3`
3. Check current status (Live/Building/Failed)

### Step 2: Review Latest Logs
Look for these error patterns:
- `localhost:27017` connections (MongoDB issue)
- `Application run failed` (startup failure)
- `Port 8080 already in use` (port conflict)
- `Could not resolve placeholder` (missing env vars)

### Step 3: Update Environment Variables
1. **Environment Tab** in Render Dashboard
2. **Update/Add** all variables listed above
3. **Save** changes

### Step 4: Force Redeploy
1. **Manual Deploy** → **Deploy Latest Commit**
2. **Monitor build logs** for successful startup
3. **Wait for** "Live" status

### Step 5: Test Health Endpoint
Once deployed, test:
```bash
curl https://quiz-app-springboot-shivam-y-yadav-3.onrender.com/actuator/health
```
Expected: `{"status":"UP"}`

## 🔧 Alternative Solutions

### Solution A: Restart Service
1. **Settings** → **Restart Service**
2. Wait for service to come back online

### Solution B: Check MongoDB Atlas
1. Go to **MongoDB Atlas Dashboard**
2. **Network Access** → Verify `0.0.0.0/0` is allowed
3. **Database Access** → Verify user credentials

### Solution C: Temporary Fix (Disable DataInitializer)
If MongoDB issues persist, temporarily disable data initialization:

Update `DataInitializer.java` to skip initialization in production:
```java
@Profile("!prod") // Only run in non-production
@Component
public class DataInitializer implements CommandLineRunner {
    // ... existing code
}
```

## 🎯 Success Indicators

After fix, you should see:
- ✅ Service status shows **Live** (green)
- ✅ Health endpoint returns `{"status":"UP"}`
- ✅ API endpoints return data
- ✅ No more Bad Gateway errors

## 🆘 If Still Not Working

### Check These Common Issues:

1. **Environment Variables Not Saved**
   - Verify all 8 variables are present
   - Click "Save" after each addition

2. **MongoDB Atlas Connection**
   - Test connection string manually
   - Verify network access settings

3. **Java/Spring Boot Issues**
   - Check for Java 21 compatibility
   - Review application.properties files

4. **Render Service Limits**
   - Free tier has limitations
   - Service might need time to "wake up"

### Get Help:
1. **Share Render logs** - Copy recent deployment logs
2. **Environment variables screenshot** - Show current settings
3. **Error details** - Specific error messages from logs

Your backend should be accessible at:
**https://quiz-app-springboot-shivam-y-yadav-3.onrender.com**