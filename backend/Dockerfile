# Build Stage
FROM gradle:8.5-jdk17-alpine AS builder
WORKDIR /app
COPY . .
RUN ./gradlew build -x test

# Run Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

# Render assigns port automatically via PORT env var, but Spring Boot defaults to 8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
