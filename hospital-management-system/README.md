# HealthCore

A comprehensive hospital management system built with React frontend and Spring Boot backend.

## Architecture

- **Frontend:** React 19+ with Material-UI
- **Backend:** Spring Boot 3.x with Spring Security
- **Database:** MySQL 8.0+
- **Authentication:** JWT-based authentication

## Project Structure

```
hospital-management-system/
├── frontend/          # React application
├── backend/           # Spring Boot application
└── README.md
```

## Getting Started

### Prerequisites

- Java 25+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies and run:
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on http://localhost:8080

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will start on http://localhost:3000

### Database Setup

1. Start MySQL service
2. Create database and user:
   ```sql
   CREATE DATABASE hospital_management;
   CREATE USER 'hospital_user'@'localhost' IDENTIFIED BY 'hospital_password';
   GRANT ALL PRIVILEGES ON hospital_management.* TO 'hospital_user'@'localhost';
   ```

## Features

- User authentication and authorization
- Patient registration and management
- Appointment scheduling
- Medical records management
- Billing system
- Role-based access control
- Responsive web design

## Tech Stack

### Backend
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- MySQL
- JWT Authentication

### Frontend
- React 19+
- Material-UI (MUI)
- React Router
- Axios
- Framer Motion

## Development Team

- **Product Owner:** Kularathne I.M.A.G
- **Scrum Master:** Weliweriya W.L.P.T
- **Developers:** 4 team members

## License

This project is developed for educational purposes.
