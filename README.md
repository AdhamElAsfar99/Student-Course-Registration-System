# Student Course Registration System

A static student course registration app built with React. The app now stores registrations in the browser so it can be published on GitHub Pages without a backend.

## Features

- Responsive React interface with text fields, dropdowns, checkboxes, radio buttons, and submit handling
- Browser storage for saved registrations using `localStorage`
- Duplicate registration and seat-capacity validation
- Ready to publish directly to GitHub Pages

## Project Structure

- `client/` - React frontend built with Vite

## Run Locally

1. Install dependencies in the `client` folder.
2. Start the frontend in development mode.
3. Open the app in your browser.

### Commands

```bash
npm --prefix client install
npm --prefix client run dev
```

## Build for Production

```bash
npm --prefix client run build
```

## Publish On GitHub Pages

1. Push the repository to GitHub.
2. Push to the `main` branch.
3. Make sure the GitHub Pages source is set to the `gh-pages` branch in repository Settings > Pages.
4. Wait for the GitHub Action to build and publish the site.
5. Open the live URL shown in the Pages settings.

If you want to trigger deployment manually from your computer, run these commands inside the `client` folder:

```bash
npm install
npm run deploy
```

The final link will look like `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`.
