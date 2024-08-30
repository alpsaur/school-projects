# Use an official Maven image to build the Spring Boot application
FROM maven:3.8.5-openjdk-17 AS build

# Set the working directory to /app
WORKDIR /app

# Copy the pom.xml and the source code to the container
COPY pom.xml .
COPY src ./src

# Package the Spring Boot application
RUN mvn clean package -DskipTests

# Use an official OpenJDK runtime as a base image for running the application
FROM openjdk:17-jdk-slim

# Set the working directory to /app
WORKDIR /app

# Copy the packaged application JAR from the build stage
COPY --from=build /app/target/funSG-0.0.1-SNAPSHOT.jar ./app.jar

# Expose the application's port (adjust accordingly if different)
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]