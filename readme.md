# Note AI Maker

Note AI Maker is a web-based note-taking application that combines a modern landing page with an interactive canvas for creating, managing, and enhancing notes.  

- Landing page is built with **HeroUI**, **Shadcn**, **MagicUI**, and **Tailwind CSS**.  
- Canvas at `/canvas` uses **React Flow** for drag-and-drop note organization and supports full CRUD operations.  
- AI-powered features like **grammar improvement** and **summarization** via the **OpenRouter API**.  
- Real-time updates via **Socket.IO**.  
- Backend built with **Express** and **MongoDB**, using a randomId for basic authorization.  
- Deployed on **Vercel (Frontend)** and **Render (Backend)**.

---

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Real-Time Features](#real-time-features)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Features

- **Landing Page**: Built using HeroUI, Shadcn, MagicUI, and Tailwind CSS.
- **Note-Making Canvas**:
  - Interactive canvas at `/canvas` using React Flow.
  - Supports full CRUD: Create, Read, Update, Delete.
- **AI-Powered Enhancements**:
  - Grammar improvement.
  - Summarization.
  - Enhancement via OpenRouter API.
- **Real-Time Updates**:
  - Drag/drop position synced with Socket.IO.
- **Authorization**:
  - No login required; randomId acts as `userId`.
- **Deployment**:
  - Frontend on Vercel, Backend on Render.

---

## 🛠 Tech Stack

### Frontend

- React (TypeScript)
- React Flow
- Tailwind CSS
- HeroUI, Shadcn, MagicUI
- Vite
- Socket.IO Client

### Backend

- Express (TypeScript)
- MongoDB
- Socket.IO Server
- OpenRouter API

---

## 📁 Project Structure

### Frontend (`client/`)

client/
├── src/
│ ├── components/ # Reusable components
│ ├── pages/ # LandingPage, CanvasPage
│ ├── hooks/ # Custom hooks
│ ├── utils/ # Helper utilities
│ └── types/ # TypeScript types
├── public/
├── .env
├── vite.config.ts
├── tsconfig.json
└── package.json

shell
Copy
Edit

### Backend (`server/`)

server/
├── src/
│ ├── config/ # DB connection config
│ ├── controllers/ # Route logic
│ ├── middlewares/ # userMiddleware for randomId auth
│ ├── models/ # Mongoose models
│ ├── routes/ # API endpoints
│ ├── sockets/ # Socket.IO logic
│ └── utils/ # Helpers
├── dist/
├── index.ts # Entry point
├── .env
├── tsconfig.json
└── package.json

yaml
Copy
Edit

---

## 🧰 Setup Instructions

### ✅ Prerequisites

- Node.js v16+
- MongoDB (local or Atlas)
- OpenRouter API Key

---

## 🎨 Frontend Setup

```bash
git clone <repository-url>
cd client
npm install
Create .env in client/:

env
Copy
Edit
VITE_BACKEND_URL=http://localhost:3000/api
VITE_BACKEND_URL_SOCKET=http://localhost:3000
Start the frontend:

bash
Copy
Edit
npm run dev
Access: http://localhost:5173

🖥️ Backend Setup
bash
Copy
Edit
cd server
npm install
Create .env in server/:

env
Copy
Edit
OPENROUTER_API_KEY=your-api-key
FRONTEND_URL=http://localhost:5173
MONGOURI=your-mongodb-connection-string
Start the backend:

bash
Copy
Edit
npm start
API: http://localhost:3000

🔐 Environment Variables
Frontend (client/.env)
Variable	Description	Example
VITE_BACKEND_URL	Backend API URL	http://localhost:3000/api
VITE_BACKEND_URL_SOCKET	Socket.IO connection URL	http://localhost:3000

Backend (server/.env)
Variable	Description	Example
OPENROUTER_API_KEY	API key for OpenRouter	your-api-key
FRONTEND_URL	CORS origin for frontend	http://localhost:5173
MONGOURI	MongoDB connection string	mongodb://localhost:27017/notes

📡 API Routes
Base path: /api/notes

Method	Endpoint	Description
GET	/api/notes	Get all notes
POST	/api/notes	Create a new note
GET	/api/notes/:id	Get a note by ID
PUT	/api/notes/:id	Update a note by ID
DELETE	/api/notes/:id	Delete a note by ID
POST	/api/notes/:id/enhance	Enhance note (AI features)
GET	/api/notes/details	API details

Example Response: GET /api/notes/details
json
Copy
Edit
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
🔄 Real-Time Features
Socket.IO for Live Position Sync
When a note is dragged:

Frontend emits position update via Socket.IO.

Backend broadcasts update to all clients.

Frontend uses VITE_BACKEND_URL_SOCKET to connect.

Backend logic is in server/src/sockets.

🚀 Deployment
Frontend (Vercel)
Push client/ to GitHub.

Import repo in Vercel.

Set env vars:

ini
Copy
Edit
VITE_BACKEND_URL=https://your-backend.onrender.com/api
VITE_BACKEND_URL_SOCKET=https://your-backend.onrender.com
Deploy: Your URL → https://your-app.vercel.app

Backend (Render)
Push server/ to GitHub.

Create Render Web Service.

Set env vars:

ini
Copy
Edit
OPENROUTER_API_KEY=your-api-key
FRONTEND_URL=https://your-app.vercel.app
MONGOURI=your-prod-mongo-uri
Deploy: Your URL → https://your-backend.onrender.com

🤝 Contributing
Fork the repo.

Create a feature branch:

bash
Copy
Edit
git checkout -b feature/your-feature
Commit changes:

bash
Copy
Edit
git commit -m "Add your feature description"
Push to fork:

bash
Copy
Edit
git push origin feature/your-feature
Open a Pull Request.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

yaml
Copy
Edit

---

### ✅ How to use:

1. Copy the above content.
2. Paste it directly into your `README.md`.
3. Make sure to replace placeholders like `<repository-url>`, `your-api-key`, `your-mongodb-connection-string`, and deployed URLs with your actual values.

Let me know if you want a downloadable file or GitHub badge integration!