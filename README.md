# Quiz Application

This is a full-stack quiz application built using Spring Boot for the backend and React for the frontend.

## Features

- User Authentication (Login/Register)
- Admin Panel for quiz creation and management
- Quiz taking interface with real-time submission
- Leaderboard display
- Quiz history and results tracking

## Technology Stack

### Frontend
- React
- Tailwind CSS
- Axios for API calls

### Backend
- Spring Boot (Java 21)
- Spring Security for authentication
- Spring Data MongoDB
- MongoDB as database
- JWT for token-based authentication

## Security Best Practices

This application follows security best practices:

1. **Environment Variables**: Sensitive data like database credentials, JWT secrets, and API keys are stored as environment variables
2. **Gitignore**: Sensitive files are excluded from version control through comprehensive .gitignore rules
3. **CORS Configuration**: Proper CORS settings to prevent unauthorized cross-origin requests
4. **JWT Authentication**: Secure token-based authentication for API endpoints
5. **Password Encryption**: User passwords are encrypted using BCrypt

## Deployment

The application is deployed on Render.com with separate services for frontend and backend.

- Frontend URL: https://quiz-app-sp-frontend.onrender.com
- Backend URL: https://quiz-app-springboot-shivam-y-yadav-3.onrender.com

## Setup Instructions

1. Clone the repository
2. Create environment configuration files:
   - Copy `backend/render-environment-variables.env.example` to `backend/render-environment-variables.env`
   - Copy `backend/src/main/resources/application-prod.properties.example` to `backend/src/main/resources/application-prod.properties`
   - Fill in your actual values in these files (never commit real credentials)
3. Start MongoDB service
4. Run backend:
   - Navigate to `backend/`
   - Build and run with Maven:
     ```bash
     mvn spring-boot:run
     ```
5. Run frontend:
   - Navigate to `frontend/`
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start development server:
     ```bash
     npm start
     ```

## Build & Deployment

### Manual Deployment

1. Make sure all changes are committed:
   ```bash
   git add .
   git commit -m "Deployment update"
   git push origin main
   ```

2. Or use the deployment scripts:
   - On Windows: Run `deploy.ps1`
   - On Mac/Linux: Run `deploy.sh`

### Backend Deployment
```bash
mvn clean package
java -jar target/Quiz-App-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
```bash
npm run build
```

### Automatic Deployment
The application is configured for automatic deployment on Render.com. Any changes pushed to the main branch will trigger automatic redeployment.

## Environment Variables

### Backend
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed origins

### Frontend
- `NODE_ENV`: Set to "production" for production builds

## API Documentation

The backend API is organized into several controllers:
- Public API: `/public/**` (no authentication required)
- Auth API: `/api/auth/**` (authentication endpoints)
- Quiz API: `/api/quiz/**` (quiz-related endpoints)
- Admin API: `/api/admin/**` (admin-only endpoints)
- Leaderboard API: `/leaderboard/**` (public leaderboard endpoints)

## Troubleshooting

If you encounter issues with data not showing:
1. Check the browser console for API errors
2. Verify the backend is running and accessible
3. Check MongoDB connection
4. Ensure CORS is properly configured