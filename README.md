# Library Management System

A full-stack Library Management System built with **Java Spring Boot** and **React**. I created this project to practice building a complete web application using a REST API, JWT authentication, role-based authorization, and a MySQL database.

The application allows users to browse available books, borrow and return them, and view their borrowing history. Administrators can manage books, users, and borrowing records through an admin dashboard.

---

## Tech Stack

| Layer | Technologies |
|--------|--------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios |
| Backend | Java 21, Spring Boot 3, Spring Security, Spring Data JPA, JWT, Maven, Lombok |
| Database | MySQL 8 |

---

## Features

### User Features

- User registration and login
- JWT authentication
- Browse available books
- Search books by title or author
- Sort and paginate book listings
- Borrow and return books
- View borrowing history
- Automatic due dates
- Overdue tracking and fine calculation

### Admin Features

- Manage books (Create, Update, Delete)
- View all registered users
- View borrowing history
- View active loans
- Monitor library statistics

---

## Project Structure

```text
library-management-system/
│
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── dto/
│   ├── security/
│   ├── config/
│   ├── exception/
│   └── utils/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── context/
│   ├── hooks/
│   └── routes/
│
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Java JDK 21
- Maven
- Node.js (v20 or newer)
- npm
- MySQL 8

---

## Database Setup

Create a new database:

```sql
CREATE DATABASE library_db;
```

Update your database username and password in your environment variables before running the backend.

---

## Environment Variables

### Backend

Create a `.env` file inside the `backend` folder.

```env
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/library_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRATION_MS=86400000

BORROW_DEFAULT_DAYS=14

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend

Create a `.env` file inside the `frontend` folder.

```env
VITE_API_URL=http://localhost:8080
```

---

## Running the Project

### Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start on:

```
http://localhost:8080
```

---

### Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

## Default Accounts

When the application starts for the first time, sample accounts are created automatically.

| Username | Password | Role |
|----------|----------|------|
| admin | Admin123! | ADMIN |
| demo | DemoUser123! | USER |

---

## API Overview

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| POST | /api/auth/logout |

---

### Books

| Method | Endpoint |
|---------|----------|
| GET | /api/books |
| GET | /api/books/{id} |
| POST | /api/books |
| PUT | /api/books/{id} |
| DELETE | /api/books/{id} |

---

### Borrowing

| Method | Endpoint |
|---------|----------|
| POST | /api/borrow/{bookId} |
| POST | /api/return/{bookId} |
| GET | /api/borrow/my-books |
| GET | /api/borrow/history |

---

### User Profile

| Method | Endpoint |
|---------|----------|
| GET | /api/users/me |

---

### Admin

| Method | Endpoint |
|---------|----------|
| GET | /api/admin/users |
| GET | /api/admin/analytics |
| GET | /api/admin/borrow-records |
| GET | /api/admin/borrow-records/active |
| GET | /api/admin/books/inventory |

---

## Authentication

This project uses **Spring Security** with **JWT authentication**.

- Users receive a JWT after logging in.
- The frontend stores the token.
- Every protected request includes the JWT in the Authorization header.
- Spring Security validates the token before processing requests.
- Admin-only endpoints are protected using role-based authorization.

Passwords are securely stored using BCrypt hashing.
