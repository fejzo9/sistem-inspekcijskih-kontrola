# Full Stack Auth App - Backend

This is the Spring Boot backend for the Full Stack Auth App.

## Prerequisites
- Java 17 or higher
- PostgreSQL (running on port 5432)
- Gradle (optional, wrapper included)

## Setup
1.  Ensure PostgreSQL is running and create a database named `auth_db`.
    ```sql
    CREATE DATABASE auth_db;
    ```
2.  Update `src/main/resources/application.properties` with your database credentials if different from default (`postgres`/`postgres`).

## Running the Application
To start the server:
```bash
./gradlew bootRun
```
The server will start on `http://localhost:8080`.

## API Endpoints
- **POST** `/api/auth/signup`: Register a new user.
- **POST** `/api/auth/signin`: Authenticate and get JWT.
- **GET** `/api/test/user`: Protected resource (requires Bearer token).
