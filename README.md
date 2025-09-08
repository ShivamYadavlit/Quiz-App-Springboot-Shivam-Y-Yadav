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
- Spring Boot (Java 11+)
- Spring Security for authentication
- Spring Data MongoDB
- MongoDB as database
- JWT for token-based authentication

## Deployment

The application is deployed on Render.com with separate services for frontend and backend.

- Frontend URL: https://quiz-app-sp-frontend.onrender.com
- Backend URL: https://quiz-app-springboot-shivam-y-yadav-3.onrender.com

## Setup Instructions

1. Clone the repository
2. Start MongoDB service
3. Run backend:
   - Navigate to `backend/`
   - Build and run with Maven:
     ```bash
     mvn spring-boot:run
     ```
4. Run frontend:
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

- Backend:
  ```bash
  mvn clean package
  java -jar target/quiz-app.jar
  ```
- Frontend:
  ```bash
  npm run build
  ```