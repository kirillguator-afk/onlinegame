# METRO CASH - Premium P2P Gaming Node

A modern, responsive web application for P2P card games (Blackjack and Durak), built with React, Vite, Tailwind CSS, and TypeScript. Designed for deployment on GitHub Pages.

## Features
- **Telegram Web App Integration**: Seamless authentication via Telegram.
- **P2P Gaming Node Simulation**: Play Blackjack and Durak against an AI opponent with a simulated P2P network feel.
- **Modern UI**: Glassmorphism, 3D card effects, and interactive background animations.
- **Responsive Design**: Works perfectly on mobile and desktop.

## Development

```bash
npm install
npm run dev
```

## Deployment to GitHub Pages

This project is configured to be easily deployed to GitHub Pages.

1.  Update the `base` in `vite.config.ts` if deploying to a subpath (e.g., `base: '/my-repo-name/'`).
2.  Run the build command:
    ```bash
    npm run build
    ```
3.  Deploy the `dist` folder to your `gh-pages` branch. You can use the `gh-pages` npm package or GitHub Actions.

**Using GitHub Actions:**
Create a file `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Install and Build
        run: |
          npm ci
          npm run build
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
```
