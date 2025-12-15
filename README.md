# MERN Stack To-Do List Application

A full-stack to-do list application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- Add, edit, and delete tasks
- Mark tasks as completed
- Clean, responsive UI with Tailwind CSS
- Real-time task counter

## Tech Stack

**Frontend:**
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui components
- Lucide React icons

**Backend:**
- Node.js with Express.js
- In-memory data storage (proof of concept)
- RESTful API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Mansi-Hoch/Job-Application.git
cd Job-Application
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server (from the backend directory):
```bash
npm start
```
The backend will run on http://localhost:5000

2. In a new terminal, start the frontend (from the frontend directory):
```bash
npm run dev
```
The frontend will run on http://localhost:5173

3. Open http://localhost:5173 in your browser to use the application.

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Note

This application uses in-memory storage for the backend, which means data will be lost when the server restarts. For production use, you would need to connect to a MongoDB database
