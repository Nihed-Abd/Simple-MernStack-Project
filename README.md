# TeamTask - Task Management Application

A collaborative task management application built with the MERN stack (MongoDB, Express, React, Node.js) and Redux Toolkit for state management.

## Features

- **User Authentication**: Secure JWT-based authentication with role-based access control
- **Task Management**: Complete CRUD operations for task creation, reading, updating and deletion
- **Role-Based Permissions**:
  - **Manager Role**: Create, assign, update, and delete tasks; manage users
  - **User Role**: View and update status of assigned tasks
- **Filtering**: Filter tasks by status (à faire, en cours, terminée)
- **Responsive UI**: Modern UI that works across all devices

## Technology Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Role-based Access Control

### Frontend
- React.js
- Redux Toolkit for state management
- Responsive design with CSS/SCSS
- React Router for navigation

## Project Structure

The project is divided into two main directories: `backend` and `frontend`.

### Backend Structure
```
backend/
├── config/                  # Configuration files
│   └── db.js                # Database connection
├── controllers/             # Request handlers
│   ├── authController.js    # Authentication logic
│   ├── taskController.js    # Task CRUD operations 
│   └── userController.js    # User management
├── middleware/              # Custom middleware
│   ├── authMiddleware.js    # JWT verification
│   └── errorMiddleware.js   # Global error handling
├── models/                  # Database models
│   ├── taskModel.js         # Task schema
│   └── userModel.js         # User schema with roles
├── routes/                  # API routes
│   ├── authRoutes.js        # Login/Register routes
│   ├── taskRoutes.js        # Task CRUD routes
│   └── userRoutes.js        # User management routes
├── .env                     # Environment variables
├── .gitignore
├── package.json
└── server.js                # Entry point
```

### Frontend Structure
```
frontend/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── app/                 # Redux setup
│   │   └── store.js         # Redux store configuration
│   ├── components/          # Reusable UI components
│   ├── features/            # Redux slices by feature
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── App.js               # Main component
│   └── index.js             # Entry point
├── .env                     # Environment variables
└── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/teamtask
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```
   npm start
   ```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (protected)

### Task Routes (all protected)
- `GET /api/tasks` - Get all tasks (filtered by user role)
- `GET /api/tasks/:id` - Get a specific task
- `GET /api/tasks/status/:status` - Get tasks by status
- `POST /api/tasks` - Create a new task (manager only)
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task (manager only)

### User Routes (all protected, manager only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## User Roles and Permissions

### Manager
- Create, read, update, and delete users
- Create, read, update, and delete tasks
- Assign tasks to any user
- View all tasks in the system

### User
- View assigned tasks only
- Update the status of assigned tasks

## License
This project is licensed under the MIT License.
