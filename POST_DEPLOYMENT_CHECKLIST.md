# 🚀 Post-Deployment Checklist

## ✅ Verify Your Deployment is Working

### 1. Check Health Endpoint
Test your backend health:
```
https://quiz-app-springboot-shivam-y-yadav-1.onrender.com/actuator/health
```
Expected response: `{"status":"UP"}`

### 2. Test API Endpoints

#### Test User Registration:
```bash
curl -X POST https://quiz-app-springboot-shivam-y-yadav-1.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "password123"
  }'
```

#### Test Admin Registration:
```bash
curl -X POST https://quiz-app-springboot-shivam-y-yadav-1.onrender.com/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123",
    "adminSecretKey": "YourCustomSecretKey2024!"
  }'
```

#### Test Available Quizzes:
```bash
curl -X GET https://quiz-app-springboot-shivam-y-yadav-1.onrender.com/api/quiz/available
```

### 3. Frontend Integration

Update your frontend API configuration:

**In `Frontend/src/services/api.js`:**
```javascript
const API_BASE_URL = 'https://your-backend-app.onrender.com/api';
```

### 4. Update CORS Configuration

Once you have your frontend deployed, update the CORS environment variable:
```
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-app.onrender.com
```

### 5. MongoDB Atlas Network Access

Ensure MongoDB Atlas allows connections from anywhere:
1. Go to MongoDB Atlas Dashboard
2. Network Access → IP Access List
3. Add IP: `0.0.0.0/0` (Allow access from anywhere)

## 🎯 Success Indicators

- ✅ Health endpoint returns `{"status":"UP"}`
- ✅ User registration works
- ✅ Admin registration works with secret key
- ✅ Quiz data is returned
- ✅ No CORS errors in browser console
- ✅ MongoDB connection is successful

## 🔍 Troubleshooting

### If Still Getting Errors:

1. **Check Render Logs:**
   - Go to Render Dashboard → Your Service → Logs
   - Look for any ERROR messages

2. **Verify Environment Variables:**
   - Render Dashboard → Your Service → Environment
   - Ensure all variables are set correctly

3. **MongoDB Issues:**
   - Verify MongoDB Atlas credentials
   - Check network access settings
   - Test connection string manually

4. **JWT Issues:**
   - Ensure JWT_SECRET is long enough (64+ characters)
   - Check JWT_EXPIRATION is numeric

### Common Solutions:

- **Redeploy:** Sometimes a fresh deployment resolves issues
- **Clear Cache:** Clear browser cache if testing frontend
- **Check Logs:** Always check latest deployment logs for specific errors