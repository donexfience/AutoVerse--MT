Note AI Maker
Note AI Maker is a web-based note-taking application that combines a modern landing page with an interactive canvas for creating, managing, and enhancing notes. The landing page is built with HeroUI, Shadcn, MagicUI, and Tailwind CSS, while the canvas, accessible at /canvas, uses React Flow for drag-and-drop note organization and supports full CRUD operations. The app includes AI-powered enhancements like grammar improvement and summarization, powered by the OpenRouter API. Real-time note position updates are enabled via Socket.IO, and the backend, built with Express and MongoDB, uses a randomId for authorization instead of traditional authentication. The frontend is deployed on Vercel, and the backend on Render.

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
Real-Time Features
Deployment
Contributing
License
Features
Landing Page: A sleek, responsive landing page at / built with HeroUI, Shadcn, MagicUI, and Tailwind CSS to introduce the application.
Note-Making Canvas: An interactive canvas at /canvas powered by React Flow, allowing users to create, drag, and organize notes with full CRUD (Create, Read, Update, Delete) functionality.
AI-Powered Enhancements:
Grammar improvement for note content.
Summarization of notes.
Detailed note enhancement features via the OpenRouter API.
Real-Time Updates: Note positions on the canvas are synchronized in real-time across all connected clients using Socket.IO.
Authorization: No prior authentication required; uses a randomId as a userId for basic authorization.
Deployment: Frontend hosted on Vercel, backend on Render.
Tech Stack
Frontend
React: Core framework with TypeScript for building the UI.
React Flow: Library for the drag-and-drop note-making canvas.
HeroUI, Shadcn, MagicUI: UI component libraries for the landing page.
Tailwind CSS: Utility-first CSS framework for styling.
Socket.IO Client: Enables real-time communication with the backend.
Vite: Build tool for fast development and production builds.
Backend
Express: Node.js framework for the REST API, written in TypeScript.
MongoDB: NoSQL database for storing notes.
Socket.IO: Server-side real-time communication for note position updates.
OpenRouter API: External API for AI-powered note enhancements.
Project Structure
The project is split into two main directories: client (frontend) and server (backend).

Frontend (client/)
text

Collapse

Wrap

Copy
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
Key pages: / (landing page) and /canvas (note-making canvas).
Integrates React Flow for the canvas and Socket.IO for real-time updates.
Backend (server/)
text

Collapse

Wrap

Copy
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
Handles API routes, real-time updates, and AI enhancements.
Setup Instructions
Prerequisites
Node.js (v16 or higher)
MongoDB (local or cloud instance, e.g., MongoDB Atlas)
OpenRouter API Key (sign up at OpenRouter to obtain a key)
Frontend Setup
Clone the repository and navigate to the frontend directory:
bash

Collapse

Wrap

Run

Copy
git clone <repository-url>
cd client
Install dependencies:
bash

Collapse

Wrap

Run

Copy
npm install
Create a .env file in the client directory with the following:
text

Collapse

Wrap

Copy
VITE_BACKEND_URL=http://localhost:3000/api
VITE_BACKEND_URL_SOCKET=http://localhost:3000
Start the development server:
bash

Collapse

Wrap

Run

Copy
npm run dev
Access the app at http://localhost:5173.
Backend Setup
Navigate to the backend directory:
bash

Collapse

Wrap

Run

Copy
cd server
Install dependencies:
bash

Collapse

Wrap

Run

Copy
npm install
Create a .env file in the server directory with the following:
text

Collapse

Wrap

Copy
OPENROUTER_API_KEY=your-api-key
FRONTEND_URL=http://localhost:5173
MONGOURI=your-mongodb-connection-string
Start the backend server:
bash

Collapse

Wrap

Run

Copy
npm start
The API will be available at http://localhost:3000.
Environment Variables
Frontend (client/.env)

Variable	Description	Example
VITE_BACKEND_URL	Backend API base URL	http://localhost:3000/api
VITE_BACKEND_URL_SOCKET	Backend Socket.IO URL	http://localhost:3000
Backend (server/.env)

Variable	Description	Example
OPENROUTER_API_KEY	API key for OpenRouter AI features	your-api-key
FRONTEND_URL	Frontend URL for CORS	http://localhost:5173
MONGOURI	MongoDB connection string	mongodb://localhost:27017/notes
API Routes
The backend provides the following endpoints under the /api/notes base path, managed by the NoteRoutes class:


Method	Endpoint	Description
GET	/api/notes/	Retrieve all notes
POST	/api/notes/	Create a new note
GET	/api/notes/:id	Get a note by ID
PUT	/api/notes/:id	Update a note by ID
DELETE	/api/notes/:id	Delete a note by ID
POST	/api/notes/:id/enhance	Enhance a note with AI features
GET	/api/notes/details	Get API details and endpoints
Authorization
All routes except /api/notes/details are protected by userMiddleware, which assigns a randomId as a userId for basic authorization.
Example Response: GET /api/notes/details
json

Collapse

Wrap

Copy
{
  "message": "NOTE API is running!",
  "version": "1.0.5",
  "endpoints": {
    "notes": {
      "GET /api/notes": "get notes from server",
      "POST /api/notes": "create a notes to server",
      "PUT /api/notes/:id": "update a note from server",
      "DELETE /api/notes/:id": "delete a notes from server",
      "POST /api/notesезды:": "enhance a note from server",
      "GET /api/notes/:id": "get a note by id from server"
    }
  }
}
Real-Time Features
Socket.IO: Used for real-time synchronization of note positions on the canvas.
How It Works:
When a user drags a note, the frontend emits the new position to the backend via Socket.IO (connected through VITE_BACKEND_URL_SOCKET).
The backend broadcasts the update to all connected clients, ensuring real-time consistency across sessions.
Implementation: Backend logic resides in server/src/sockets/, while the frontend uses the Socket.IO client library.
Deployment
Frontend (Vercel)
Push the client directory to a GitHub repository.
Import the repository into Vercel.
Set environment variables in the Vercel dashboard:
VITE_BACKEND_URL: https://your-backend.onrender.com/api
VITE_BACKEND_URL_SOCKET: https://your-backend.onrender.com
Deploy the app. The live URL will be something like https://your-app.vercel.app.
Backend (Render)
Push the server directory to a GitHub repository.
Create a new web service on Render and link the repository.
Set environment variables in the Render dashboard:
OPENROUTER_API_KEY: Your OpenRouter API key
FRONTEND_URL: https://auto-verse-mt.vercel.app/
MONGOURI: Production MongoDB connection string
Deploy the app. The live URL will be something like https://autoverse-mt.onrender.com
Note: Ensure environment variables reflect the deployed URLs, not local development settings.

Contributing
Fork the repository.
Create a feature branch:
bash

Collapse

Wrap

Run

Copy
git checkout -b feature/your-feature
Commit your changes:
bash

Collapse

Wrap

Run

Copy
git commit -m "Add your feature description"
Push to your fork:
bash

Collapse

Wrap

Run

Copy
git push origin feature/your-feature
Open a pull request.
License
This project is licensed under the MIT License. See the LICENSE file for details.