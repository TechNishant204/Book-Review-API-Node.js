# Book Review API

A RESTful API for a Book Review system built with Node.js and Express.

## Features

- JWT-based user authentication
- Book management (create, get all, get by ID)
- Book reviews (create, update, delete)
- Book search functionality
- Pagination support

## Tech Stack

- Node.js with Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Express-validator for input validation

## Database Schema

### User Model

- `_id`: ObjectId
- `username`: String (required, unique)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `createdAt`: Date
- `updatedAt`: Date

### Book Model

- `_id`: ObjectId
- `title`: String (required)
- `author`: String (required)
- `genre`: String (required)
- `publishYear`: Number (required)
- `description`: String (required)
- `addedBy`: ObjectId (reference to User)
- `createdAt`: Date
- `updatedAt`: Date
- `averageRating`: Virtual (calculated)
- `reviews`: Virtual (populated)

### Review Model

- `_id`: ObjectId
- `book`: ObjectId (reference to Book)
- `user`: ObjectId (reference to User)
- `rating`: Number (required, 1-5)
- `comment`: String (required)
- `createdAt`: Date
- `updatedAt`: Date

## Installation & Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on the example provided and update the values
4. Start the server:
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## API Endpoints

### Authentication

- **POST /signup** - Register a new user

  ```
  curl -X POST http://localhost:3000/signup \
    -H "Content-Type: application/json" \
    -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
  ```

- **POST /login** - Authenticate a user

  ```
  curl -X POST http://localhost:3000/login \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "password": "password123"}'
  ```

### Books

- **GET /books** - Get all books (with pagination and filters)

  ```
  # Basic
  curl http://localhost:3000/books

  # With pagination
  curl http://localhost:3000/books?page=1&limit=10

  # With filters
  curl http://localhost:3000/books?author=Tolkien&genre=Fantasy
  ```

- **GET /books/:id** - Get book details by ID

  ```
  curl http://localhost:3000/books/60a1b2c3d4e5f6a7b8c9d0e1
  ```

- **POST /books** - Add a new book (authenticated)

  ```
  curl -X POST http://localhost:3000/books \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d '{"title": "The Lord of the Rings", "author": "J.R.R. Tolkien", "genre": "Fantasy", "publishYear": 1954, "description": "Epic fantasy novel"}'
  ```

### Reviews

- **POST /books/:id/reviews** - Submit a review (authenticated)

  ```
  curl -X POST http://localhost:3000/books/60a1b2c3d4e5f6a7b8c9d0e1/reviews \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d '{"rating": 5, "comment": "Amazing book!"}'
  ```

- **PUT /reviews/:id** - Update a review (authenticated)

  ```
  curl -X PUT http://localhost:3000/reviews/60a1b2c3d4e5f6a7b8c9d0e1 \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d '{"rating": 4, "comment": "Very good book!"}'
  ```

- **DELETE /reviews/:id** - Delete a review (authenticated)

  ```
  curl -X DELETE http://localhost:3000/reviews/60a1b2c3d4e5f6a7b8c9d0e1 \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
  ```

### Search

- **GET /search** - Search books by title or author

  ```
  curl http://localhost:3000/search?query=tolkien&page=1&limit=10
  ```

## Design Decisions

1. **MongoDB**: Chosen for its flexibility and ease of use with Node.js applications.
2. **JWT Authentication**: Provides a stateless, secure way to authenticate users.
3. **Pagination**: Implemented to improve performance when dealing with large datasets.
4. **Validation**: Used express-validator for input validation to ensure data integrity.
5. **Error Handling**: Comprehensive error handling for better debugging and user experience.
6. **Middleware**: Custom middleware for JWT authentication.
7. **Virtual Fields**: Used for calculated fields like averageRating to reduce database operations.
8. **Compound Index**: Created on Review model (book + user) to ensure one review per user per book.
9. **Text Index**: Created on Book model (title + author) for efficient search functionality.

## Future Improvements

1. Add role-based access control (admin, moderator, user)
2. Implement more advanced search with filters
3. Add sorting options
4. Add book categories and tags
5. Implement rate limiting to prevent abuse
6. Add unit and integration tests
7. Implement cache mechanism for frequently accessed data
8. Improve error handling and logging
