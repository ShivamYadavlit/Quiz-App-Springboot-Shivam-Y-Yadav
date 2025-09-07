# Use OpenJDK 21 as base image (matches project configuration)
FROM openjdk:21-jdk-slim

# Set metadata
LABEL maintainer="Quiz App Team" \
      version="1.0" \
      description="Quiz Application Backend with Spring Boot"

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN groupadd -r quizapp && useradd -r -g quizapp quizapp

# Copy Maven wrapper and pom.xml first (for better layer caching)
COPY --chown=quizapp:quizapp .mvn/ .mvn/
COPY --chown=quizapp:quizapp mvnw pom.xml ./

# Make Maven wrapper executable
RUN chmod +x ./mvnw

# Download dependencies (for better caching) - this layer will be cached unless pom.xml changes
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY --chown=quizapp:quizapp src ./src

# Build the application
RUN ./mvnw clean package -DskipTests -Dmaven.javadoc.skip=true

# Switch to non-root user
USER quizapp

# Expose port 8080
EXPOSE 8080

# Set environment variables for production
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-Xmx512m -Xms256m" \
    SERVER_PORT=8080

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application with optimized JVM settings
CMD ["sh", "-c", "java $JAVA_OPTS -jar target/Quiz-App-0.0.1-SNAPSHOT.jar"]