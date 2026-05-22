# Student Course Registration System

A full-stack student course registration app built with React on the frontend and Node.js on the backend. Registration records are stored in simple JSON files so the project stays easy to understand, run, and host from a GitHub repository.

## Features

- Responsive React interface with text fields, dropdowns, checkboxes, radio buttons, and submit handling
- Node.js API for listing courses and saving registrations
- File-based storage using `data/courses.json` and `data/registrations.json`
- Duplicate registration and seat-capacity validation
- Ready to build and deploy as a single Node app after the frontend bundle is generated

## Project Structure

- `server.js` - Express API and static file server
- `data/` - JSON storage files
- `client/` - React frontend built with Vite

## Run Locally

1. Install dependencies from the project root and the client folder.
2. Start the backend and frontend in development mode.
3. Open the frontend in your browser.

### Commands

```bash
npm install
npm --prefix client install
npm run dev
```

The frontend runs on Vite and proxies API requests to the Node server.

## Build for Production

```bash
npm run build
npm start
```

The backend serves the built frontend automatically from `client/dist` when it exists.

## Notes for GitHub Hosting

- Keep this repository on GitHub as the source of truth.
- For a live public deployment, use a Node host such as Render, Railway, or Fly.io after pushing the repo.
- The JSON files make the database layer simple and portable for an exam project.
