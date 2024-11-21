# Use an official OpenJDK runtime as a base image
FROM openjdk:11-jre-slim

# Set the working directory
WORKDIR /code

# Install any necessary dependencies (if needed)
RUN apt-get update && apt-get install -y maven

# Command to compile and run the Java code
CMD ["java", "-cp", "/code", "Main"]
