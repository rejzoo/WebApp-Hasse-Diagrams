# Hasse Diagrams Backend

This is the backend service for the Hasse Diagrams application. The service is built using Spring Boot and uses PostgreSQL as its database. Both the application and the database are containerized with Docker, and Docker Compose is used for orchestration.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Building the Application](#building-the-application)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)

## Overview

This project consists of:
- A Spring Boot application that is built using Maven.
- A PostgreSQL database.
- Docker and Docker Compose configuration for containerizing and running both services.

The application is configured to connect to the PostgreSQL database via environment variables. Sensitive information is managed using an environment file (.env) that is not tracked by version control.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)

## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rejzoo/WebApp-Hasse-Diagrams.git
   cd hassediagrams-be

2. **Set up your environment file:**
Create a .env file in the project root with the following contents (adjust values as needed):
   ```bash
    POSTGRES_USER=user
    POSTGRES_PASSWORD=user_password
    POSTGRES_DB=db_name
    SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/db_name
    SPRING_DATASOURCE_USERNAME=user
    SPRING_DATASOURCE_PASSWORD=user_password
*Note: Ensure that .env is listed in your .gitignore to avoid committing sensitive information.*

## Building the Application
The application uses a multi-stage Dockerfile. To build the Docker image for the Spring Boot application, run:
    
```bash
docker build -t hasse-app .
```

This command will:

- Use Maven to build the application.
- Package the Spring Boot app into a lightweight JRE image.

## Running the Application

With the Docker image built and the environment file in place, you can start both the Spring Boot application and the PostgreSQL database using Docker Compose.

Run the following command in the project root:

```bash
docker-compose up -d
```

This will:

- Start the PostgreSQL container with the credentials specified in the .env file.
- Start the Spring Boot container (hasse-app) and link it to the PostgreSQL container.
- Map ports 8080 (for the application) and 5432 (for PostgreSQL) to your host machine.

To verify that the containers are running, use:
```bash
docker ps
```

Access the application at http://localhost:8080.

## Environment Variables
The following environment variables are used to configure the database connection and should be defined in your .env file:

- POSTGRES_USER: PostgreSQL username.
- POSTGRES_PASSWORD: PostgreSQL password.
- POSTGRES_DB: Name of the PostgreSQL database.
- SPRING_DATASOURCE_URL: JDBC URL for the PostgreSQL connection (use the service name postgres as the host).
- SPRING_DATASOURCE_USERNAME: Username for connecting to PostgreSQL.
- SPRING_DATASOURCE_PASSWORD: Password for connecting to PostgreSQL.