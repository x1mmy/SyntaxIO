# SyntaxIO

A smart documentation assistant that lives in your code editor, automatically finding and explaining the technical documentation you need while coding by combining official docs, Stack Overflow, and GitHub discussions in one unified interface.


# Authentication API Documentation

## Overview

The authentication system provides user registration, login, and profile access functionality using JWT (JSON Web Token) for secure authentication.

## Endpoints

### 1. Register User

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "username": "username"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "_id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "token": "jwt_token"
    }
    ```
- **Error Response:**
  - **Code:** 400
  - **Content:** `{ "message": "User already exists" }`

### 2. Login User

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "_id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "token": "jwt_token"
    }
    ```
- **Error Response:**
  - **Code:** 401
  - **Content:** `{ "message": "Invalid credentials" }`

### 3. Get User Profile

- **URL:** `/api/auth/profile`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer jwt_token`
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "_id": "user_id",
      "email": "user@example.com",
      "username": "username"
    }
    ```
- **Error Response:**
  - **Code:** 401
  - **Content:** `{ "message": "Not authorized - No token" }`

## Authentication Flow

1. User registers with email, password, and username
2. Upon successful registration, a JWT token is returned
3. User can login with email and password to receive a new JWT token
4. The JWT token must be included in the Authorization header for protected routes
5. Token expires after 30 days

## Security Features

- Passwords are hashed using bcrypt before storage
- JWT tokens are signed with a secure secret
- Protected routes require valid JWT token
- Input validation on all endpoints
- Error handling with appropriate status codes
