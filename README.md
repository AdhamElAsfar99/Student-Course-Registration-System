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

## Publish On Render

Render is the easiest option for a public working link because it can run the Node backend and serve the built React frontend from the same service.

1. Push the repo to a public GitHub repository.
2. Sign in to Render and choose New Web Service.
3. Connect the GitHub repository.
4. Leave the environment as Node and use the root folder of this repo.
5. Use the build command from `render.yaml` or set it manually to `npm install && npm --prefix client install && npm run build`.
6. Use `npm start` as the start command.
7. Create the service and wait for the build to finish.
8. Open the Render URL and test registration submissions.

The deployed site will be live at the Render domain shown after deployment.

### Important note

This project uses JSON files for storage. That is perfect for an exam/demo setup, but some hosts reset file storage when the service restarts or redeploys. If you need permanent production data, switch the data layer to a real database later.
