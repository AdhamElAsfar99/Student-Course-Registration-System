# Student Course Registration System

A static student course registration app built with React. The app now stores registrations in the browser so it can be published on GitHub Pages without a backend.

## Features

- Responsive React interface with text fields, dropdowns, checkboxes, radio buttons, and submit handling
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
2. Open the `client` folder in a terminal.
3. Install dependencies with `npm install`.
4. Deploy the app with `npm run deploy`.
5. In GitHub, open repository Settings > Pages.
6. Set the source to the `gh-pages` branch and save.
7. Wait for GitHub Pages to build the site.
8. Open the live URL shown in the Pages settings.

The final link will look like `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`.
