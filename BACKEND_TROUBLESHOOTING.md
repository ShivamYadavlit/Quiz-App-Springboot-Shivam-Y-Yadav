# 🔧 Backend Troubleshooting Guide
## Your Backend URL: https://quiz-app-springboot-shivam-y-yadav-1.onrender.com

## 🚨 Current Issues Detected

Your backend deployment appears to be experiencing issues:
- Health endpoint is timing out
- API endpoints are not responding

## ✅ Immediate Action Required

### 1. Check Render Dashboard
1. Go to [Render.com Dashboard](https://dashboard.render.com)
2. Find your service: `quiz-app-springboot-shivam-y-yadav-1`
3. Check the **Status** - should be "Live" (green)
4. If status shows "Build Failed" or "Deploy Failed", check logs

### 2. Verify Environment Variables
Ensure these are set in Render Dashboard → Environment tab:

```bash
JWT_SECRET=mySecretKey123456789012345678901234567890123456789012345678901234567890
JWT_EXPIRATION=86400000
ADMIN_SECRET_KEY=YourCustomSecretKey2024!
MONGODB_URI=mongodb+srv://shivamyadav2072000_db_user:3zLn63QvMRUkWqDl@cluster0.4emwg3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DATABASE=quiz_app_db
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://quiz-app-springboot-shivam-y-yadav-1.onrender.com
PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

### 3. Check Build/Deploy Logs
Look for these common errors in logs:
- ❌ `Could not resolve placeholder 'jwt.secret'`
- ❌ `MongoSocketOpenException: Exception opening socket`
- ❌ `Port 8080 was already in use`

### 4. Force Redeploy
1. In Render Dashboard → Manual Deploy
2. Click "Deploy Latest Commit"
3. Monitor the build logs

### 5. Test Health After Fix
Once redeployed, test:
```bash
curl https://quiz-app-springboot-shivam-y-yadav-1.onrender.com/actuator/health
```
Expected response: `{"status":"UP"}`

## 🔍 Common Render.com Issues

### Issue 1: Free Tier Sleep
**Problem**: Render free tier services sleep after 15 minutes of inactivity
**Solution**: 
- First request may take 30-60 seconds to wake up
- Wait and retry the health endpoint
- Consider upgrading to paid tier for always-on service

### Issue 2: Build Timeout
**Problem**: Build takes too long and times out
**Solution**:
- Check if Maven dependencies are resolving
- Verify Java 21 compatibility
- Review build logs for specific errors

### Issue 3: MongoDB Connection
**Problem**: Cannot connect to MongoDB Atlas
**Solution**:
- Verify MongoDB Atlas allows 0.0.0.0/0 IP access
- Check credentials in MONGODB_URI
- Test connection string manually

## 🚀 Quick Test Commands

### Test Health Endpoint
```bash
curl -v https://quiz-app-springboot-shivam-y-yadav-1.onrender.com/actuator/health
```

### Test API Endpoint
```bash
curl -v https://quiz-app-springboot-shivam-y-yadav-1.onrender.com/api/quiz/available
```

### Test User Registration
```bash
curl -X POST https://quiz-app-springboot-shivam-y-yadav-1.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

## 📱 Frontend Integration

Once backend is working, update your frontend:

### Update API Base URL
In your frontend `src/services/api.js`:
```javascript
const API_BASE_URL = 'https://quiz-app-springboot-shivam-y-yadav-1.onrender.com/api';
```

### Test CORS
Ensure your frontend can communicate with backend without CORS errors.

## 🎯 Success Indicators

- ✅ Backend status shows "Live" in Render
- ✅ Health endpoint returns `{"status":"UP"}`
- ✅ API endpoints return data (not 504/timeout)
- ✅ No CORS errors when accessing from frontend
- ✅ Database connection established

## 🆘 If Still Not Working

1. **Share Render logs** - Copy recent deployment logs
2. **Check service status** - Screenshot of Render dashboard
3. **Verify environment variables** - Ensure all are set correctly
4. **Test locally** - Confirm app works with same environment variables locally

Your backend should be accessible at: https://quiz-app-springboot-shivam-y-yadav-1.onrender.com