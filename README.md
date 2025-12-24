# Quiz Web Application

A real-time multiplayer quiz application built with React, Node.js, and Socket.io.

## Features
- Create and join rooms with codes.
- Up to 12 players per room.
- Real-time gameplay with timed questions (30s).
- Live scoring based on speed.

## Project Structure
- `client/`: React frontend (Vite).
- `server/`: Node.js Express backend with Socket.io.

## How to Run

### Prerequisites
- Node.js installed.

### Setup
1. Install dependencies for client:
   ```bash
   cd client
   npm install
   ```
2. Install dependencies for server:
   ```bash
   cd server
   npm install
   ```

### Running the App
You can use the VS Code Tasks provided:
1. Press `Ctrl+Shift+P` -> `Tasks: Run Task` -> `Run Server`
2. Press `Ctrl+Shift+P` -> `Tasks: Run Task` -> `Run Client`

Or run manually in two terminals:
- **Server**: `cd server && npm start` (or `npx nodemon index.js`)
- **Client**: `cd client && npm run dev`

Open [http://localhost:5173](http://localhost:5173) to play.
