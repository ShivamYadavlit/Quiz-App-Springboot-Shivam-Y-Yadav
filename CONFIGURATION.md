# Configuration Guide

## Application Properties Setup

### Quick Start
1. Copy `application.properties.example` to `application.properties`
2. Modify the configuration values according to your environment
3. Ensure MongoDB is running on your system

### Required Configuration

#### Database (MongoDB)
```properties
# Local MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/quiz_app_db
spring.data.mongodb.database=quiz_app_db

# MongoDB Atlas (Cloud)
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/quiz_app_db
```

#### Security (JWT)
```properties
# Generate a strong secret for production (64+ characters)
jwt.secret=YOUR_STRONG_SECRET_KEY_HERE
jwt.expiration=86400000  # 24 hours in milliseconds
```

#### CORS
```properties
# Development
cors.allowed.origins=http://localhost:3000

# Production
cors.allowed.origins=https://yourdomain.com
```

#### Admin Access
```properties
# Change this secret key for production
admin.secret.key=YOUR_ADMIN_SECRET_KEY_HERE
```

### Environment Variables (Recommended for Production)

```bash
# Set environment variables
export JWT_SECRET=\"your-strong-jwt-secret-key\"
export ADMIN_SECRET_KEY=\"your-admin-secret-key\"
export MONGODB_URI=\"mongodb://localhost:27017/quiz_app_db\"
export CORS_ORIGINS=\"https://yourdomain.com\"
```

```properties
# Use in application.properties
jwt.secret=${JWT_SECRET:defaultsecret}
admin.secret.key=${ADMIN_SECRET_KEY:defaultadminsecret}
spring.data.mongodb.uri=${MONGODB_URI:mongodb://localhost:27017/quiz_app_db}
cors.allowed.origins=${CORS_ORIGINS:http://localhost:3000}
```

### Default Admin User
On first startup, the application creates a default admin user:
- **Username:** admin
- **Password:** admin123
- **Email:** admin@quizapp.com

⚠️ **Important:** Change the default admin password after first login!

### Security Notes
- Never commit real secrets to version control
- Use strong, unique secrets for production
- Rotate secrets regularly
- Use HTTPS in production
- Consider using a secrets management service

### Troubleshooting

#### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod --version`
- Check connection string format
- Verify database permissions

#### JWT Issues
- Ensure JWT secret is at least 32 characters
- Check token expiration time
- Verify CORS configuration

#### Admin Registration Issues
- Verify admin secret key matches
- Check if admin user already exists
- Review application logs