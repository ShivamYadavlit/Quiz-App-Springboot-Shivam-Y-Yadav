# Deployment Guide for Quiz Application

## Overview
This guide provides instructions for deploying the Quiz Application to Render.com using Docker.

## Prerequisites
- Render.com account
- MongoDB Atlas database (already configured)
- Git repository with the latest code

## Environment Variables Required

Set up the following environment variables in your Render service:

### Required Environment Variables
```
MONGODB_URI=mongodb+srv://shivamyadav2072000_db_user:3zLn63QvMRUkWqDl@cluster0.4emwg3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DATABASE=quiz_app_db
JWT_SECRET=your-secure-jwt-secret-key-here
JWT_EXPIRATION=86400000
ADMIN_SECRET_KEY=your-secure-admin-secret-key-here
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:3000
PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

### Security Recommendations
- Generate a strong JWT secret key (at least 256 bits)
- Use a secure admin secret key
- Update CORS origins to match your frontend deployment URL

## Deployment Steps

### Step 1: Prepare Your Repository
1. Ensure all deployment files are committed:
   - `Dockerfile`
   - `application-prod.properties`
   - `.dockerignore`

### Step 2: Create Render Service
1. Log in to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `quiz-app-backend`
   - **Environment**: `Docker`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your deployment branch)
   - **Dockerfile Path**: `Quiz-App/Dockerfile`

### Step 3: Configure Environment Variables
1. In the Render dashboard, go to your service
2. Navigate to "Environment" tab
3. Add all the environment variables listed above
4. **Important**: Update `CORS_ALLOWED_ORIGINS` with your actual frontend URL

### Step 4: Deploy
1. Click "Deploy Latest Commit" or trigger auto-deploy
2. Monitor the build logs for any issues
3. Once deployed, test the health endpoint: `https://your-app.onrender.com/actuator/health`

## Frontend Deployment

### Update Frontend API Base URL
Update your frontend's API configuration to point to your deployed backend:

```javascript
// In Frontend/src/services/api.js
const API_BASE_URL = 'https://your-backend-app.onrender.com/api';
```

### Deploy Frontend to Render
1. Create a new Web Service for the frontend
2. Set build command: `cd Frontend && npm install && npm run build`
3. Set start command: `cd Frontend && npx serve -s build -l 3000`
4. Update backend CORS configuration with frontend URL

## Database Initialization
The application will automatically:
- Connect to MongoDB Atlas
- Create necessary collections
- Initialize sample quiz data (via DataInitializer)

## Monitoring and Troubleshooting

### Health Check
- URL: `https://your-app.onrender.com/actuator/health`
- Should return: `{"status":"UP"}`

### Common Issues
1. **Build Failures**: Check Maven dependencies and Java version
2. **Database Connection**: Verify MongoDB Atlas credentials and network access
3. **CORS Errors**: Ensure frontend URL is in `CORS_ALLOWED_ORIGINS`
4. **JWT Issues**: Verify JWT secret is set and long enough

### Logs
Monitor application logs in Render dashboard for debugging.

## Post-Deployment Testing

### Test Endpoints
1. Health check: `GET /actuator/health`
2. User registration: `POST /api/auth/register`
3. User login: `POST /api/auth/login`
4. Get quizzes: `GET /api/quiz/available`

### Admin Testing
1. Admin registration: `POST /api/admin/register`
2. Admin login: `POST /api/admin/auth/login`
3. Create quiz: `POST /api/admin/quiz/create`

## Security Considerations

### Production Security Checklist
- [ ] Strong JWT secret key (256+ bits)
- [ ] Secure admin secret key
- [ ] CORS properly configured
- [ ] MongoDB Atlas network access configured
- [ ] Environment variables properly set
- [ ] HTTPS enabled (automatic on Render)

## Scaling
- Render automatically handles scaling
- For high traffic, consider upgrading to a higher tier plan
- Monitor memory and CPU usage in Render dashboard

## Backup and Recovery
- MongoDB Atlas provides automatic backups
- Export environment variables configuration
- Keep deployment configuration in version control

## Support
For deployment issues:
1. Check Render build logs
2. Verify environment variables
3. Test database connectivity
4. Review application logs