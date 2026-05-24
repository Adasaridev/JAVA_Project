# backend/Dockerfile
FROM openjdk:11-jre-slim
WORKDIR /app
COPY target/account-creation-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
