# Quiz-App-Springboot-Shivam-Y-Yadav

A full-stack quiz application built with Spring Boot backend and React frontend, featuring user authentication, quiz management, and leaderboard tracking.

## 🚀 Features

- **User Authentication** - JWT-based secure login/registration
- **Admin Panel** - Quiz creation and management
- **Quiz Taking** - Interactive quiz interface with real-time submission
- **Leaderboard** - Track and display quiz results
- **MongoDB Atlas** - Cloud database integration
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Technology Stack

### Backend
- Spring Boot 3.5.4
- Java 21
- Spring Security (JWT)
- Spring Data MongoDB
- Maven

### Frontend
- React
- Tailwind CSS
- Axios
- React Router

### Database
- MongoDB Atlas

## ⚙️ Configuration

### Important Security Note
**Configuration files containing sensitive data are gitignored for security.**

### Setup Configuration Files

1. **Backend Configuration:**
   ```bash
   cd Quiz-App/src/main/resources
   cp application.properties.example application.properties
   cp application-prod.properties.example application-prod.properties
   ```

2. **Edit `application.properties`** with your local settings:
   - MongoDB connection string
   - JWT secret key
   - Admin secret key
   - CORS allowed origins

3. **For Production:** Use environment variables as shown in `application-prod.properties.example`

### Environment Variables (Production)
```bash
MONGODB_URI=your-mongodb-atlas-connection-string
MONGODB_DATABASE=quiz_app_db
JWT_SECRET=your-256-bit-secret-key
JWT_EXPIRATION=86400000
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
ADMIN_SECRET_KEY=your-admin-secret-key
PORT=8080
```

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 16+
- MongoDB Atlas account (or local MongoDB)
- Docker (for deployment)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Quiz-App-Springboot-Shivam--main
   ```

2. **Setup Backend:**
   ```bash
   cd Quiz-App
   # Copy and configure application.properties (see Configuration section above)
   ./mvnw spring-boot:run
   ```

3. **Setup Frontend:**
   ```bash
   cd Frontend
   npm install
   npm start
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Health Check: http://localhost:8080/actuator/health

## 🐳 Docker Deployment

### Build and Run
```bash
cd Quiz-App
docker build -t quiz-app .
docker run -p 8080:8080 quiz-app
```

### Deploy to Render.com
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/register` - Admin registration

### Quiz Management
- `GET /api/quiz/available` - Get available quizzes
- `GET /api/quiz/{id}` - Get quiz by ID
- `POST /api/quiz/submit` - Submit quiz answers
- `POST /api/admin/quiz/create` - Create new quiz (Admin)

### Leaderboard
- `GET /api/leaderboard/stats` - Get leaderboard statistics

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (User/Admin)
- BCrypt password hashing
- CORS configuration
- Environment variable configuration
- Non-root Docker user

## 📝 Development Notes

### Configuration Files
- `application.properties` - Local development configuration (gitignored)
- `application-prod.properties` - Production configuration (gitignored)
- `application.properties.example` - Template for local setup
- `application-prod.properties.example` - Template for production setup

### Build Commands
```bash
# Backend build
./mvnw clean package -DskipTests

# Frontend build
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Important Notes

- **Never commit configuration files with sensitive data**
- **Always use environment variables in production**
- **Generate strong secret keys for JWT and admin access**
- **Configure CORS properly for your frontend domain**