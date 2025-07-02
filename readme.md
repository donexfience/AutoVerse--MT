Note AI Maker
Note AI Maker is a web-based note-taking application that allows users to create, manage, and enhance notes with AI-powered features. It features a modern landing page and an interactive canvas for organizing notes with drag-and-drop functionality. The application leverages real-time updates for collaborative note positioning and integrates AI tools for grammar improvement and summarization.
Table of Contents

Features
Tech Stack
Project Structure
Setup Instructions
Prerequisites
Frontend Setup
Backend Setup


Environment Variables
API Routes
Real-Time Functionality
Deployment
Contributing
License


Features

Landing Page: A responsive landing page built with HeroUI, Shadcn, MagicUI, and Tailwind CSS.
Note-Making Canvas: An interactive canvas at /canvas using React Flow for creating, dragging, and organizing notes with full CRUD (Create, Read, Update, Delete) operations.
AI-Powered Enhancements:
Grammar improvement for note content.
Summarization of notes.
Detailed note enhancement features via the OpenRouter API.


Real-Time Updates: Note positions on the canvas are synchronized in real-time across all connected clients using Socket.IO.
Authorization: Uses a randomId as a userId for basic authorization without traditional authentication.


Tech Stack
Frontend

React: Core framework for building the user interface.
Vite: Build tool for fast development and production builds.
React Flow: Library for the drag-and-drop note canvas.
HeroUI, Shadcn, MagicUI: UI component libraries for the landing page.
Tailwind CSS: Utility-first CSS framework for styling.
Socket.IO Client: For real-time communication with the backend.

Backend

Express (v4.18.2): Web framework for Node.js.
MongoDB: NoSQL database for storing notes.
Socket.IO: For real-time bidirectional event-based communication.
OpenRouter API: External API for AI-powered note enhancements.


Project Structure
The project is divided into two main directories: client (frontend) and server (backend).
Frontend (client/)
client/
├── src/                 # Source code
│   ├── components/      # Reusable React components
│   ├── pages/           # Page components (e.g., LandingPage, CanvasPage)
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
├── .env                 # Environment variables
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts


Key Pages:
/: Landing page
/canvas: Note-making canvas



Backend (server/)
server/
├── src/                 # Source code
│   ├── config/          # Configuration files (e.g., database connection)
│   ├── controllers/     # Logic for handling requests (e.g., NoteController)
│   ├── middlewares/     # Middleware (e.g., userMiddleware for authorization)
│   ├── models/          # MongoDB models (e.g., Note)
│   ├── routes/          # API route definitions (e.g., NoteRoutes)
│   ├── sockets/         # Socket.IO logic for real-time updates
│   └── utils/           # Utility functions
├── dist/                # Compiled output
├── index.ts             # Server entry point
├── .env                 # Environment variables
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts


Setup Instructions
Prerequisites

Node.js (v16 or higher)
MongoDB (local or cloud instance, e.g., MongoDB Atlas)
OpenRouter API Key (sign up at OpenRouter to obtain a key)

Frontend Setup

Clone the repository and navigate to the frontend directory:git clone <repository-url>
cd client


Install dependencies:npm install


Create a .env file in the client directory with the following:VITE_BACKEND_URL=http://localhost:3000/api
VITE_BACKEND_URL_SOCKET=http://localhost:3000


Start the development server:npm run dev


Access the app at http://localhost:5173.



Backend Setup

Navigate to the backend directory:cd server


Install dependencies:npm install


Create a .env file in the server directory with the following:OPENROUTER_API_KEY=your-api-key
FRONTEND_URL=http://localhost:5173
MONGOURI=your-mongodb-connection-string


Start the backend server:npm start


The API will be available at http://localhost:3000.




Environment Variables
Frontend (client/.env)



Variable
Description
Example



VITE_BACKEND_URL
Backend API base URL
http://localhost:3000/api


VITE_BACKEND_URL_SOCKET
Backend Socket.IO URL
http://localhost:3000


Backend (server/.env)



Variable
Description
Example



OPENROUTER_API_KEY
API key for OpenRouter AI features
your-api-key


FRONTEND_URL
Frontend URL for CORS
http://localhost:5173


MONGOURI
MongoDB connection string
mongodb://localhost:27017/notes



API Routes
The backend provides the following endpoints under the /api/notes base path:



Method
Endpoint
Description



GET
/api/notes/
Retrieve all notes


POST
/api/notes/
Create a new note


GET
/api/notes/:id
Get a note by ID


PUT
/api/notes/:id
Update a note by ID


DELETE
/api/notes/:id
Delete a note by ID


POST
/api/notes/:id/enhance
Enhance a note with AI features


GET
/api/notes/details
Get API details and endpoints



All routes except /api/notes/details are protected by userMiddleware, which assigns a randomId as a userId for basic authorization.

Example Response: GET /api/notes/details
{
  "message": "NOTE API is running!",
  "version": "1.0.5",
  "endpoints": {
    "notes": {
      "GET /api/notes": "get notes from server",
      "POST /api/notes": "create a notes to server",
      "PUT /api/notes/:id": "update a note from server",
      "DELETE /api/notes/:id": "delete a notes from server",
      "POST /api/notes/:id/enhance": "enhance a note from server",
      "GET /api/notes/:id": "get a note by id from server"
    }
  }
}


Real-Time Functionality

Socket.IO: Used for real-time synchronization of note positions on the canvas.
How It Works:
When a user drags a note, the frontend emits the new position to the backend via Socket.IO.
The backend broadcasts the update to all connected clients, ensuring real-time consistency.


Implementation: Backend logic is in server/src/sockets/, and the frontend uses the Socket.IO client library.


Deployment
Frontend (Vercel)

Push the client directory to a GitHub repository.
Import the repository into Vercel.
Set environment variables in the Vercel dashboard:
VITE_BACKEND_URL: https://your-backend.onrender.com/api
VITE_BACKEND_URL_SOCKET: https://your-backend.onrender.com


Deploy the app.

Backend (Render)

Push the server directory to a GitHub repository.
Create a new web service on Render and link the repository.
Set environment variables in the Render dashboard:
OPENROUTER_API_KEY: Your OpenRouter API key
FRONTEND_URL: https://your-app.vercel.app
MONGOURI: Production MongoDB connection string


Deploy the app.

Note: Ensure environment variables reflect the deployed URLs, not local development settings.

Contributing

Fork the repository.
Create a feature branch:git checkout -b feature/your-feature


Commit your changes:git commit -m "Add your feature description"


Push to your fork:git push origin feature/your-feature


Open a pull request.


License
This project is licensed under and distributed under the MIT License. See the LICENSE file for details.