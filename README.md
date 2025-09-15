# Dock Manager Demos

A simple gallery of demos for Ignite UI Dock Manager. The main app lists demos under `projects/`, and each demo can run on its own.

## Prerequisites
- Node.js (LTS recommended)
- npm

## Quick Start
```bash
npm install npm run dev
```

## Run a Single Demo
Example running the  stream-manager demo

```bash 
cd projects/stream-manager
```

```bash
npm install
```

```bash
npm run dev
```

## Add a New Demo
1) Create new project inside the projects folder `projects/<project-id>` and add a minimal Vite app (index.html, src, package.json). Your project name is the project ID that will be used inside the `src/project-config.ts`.
2) Register it in `src/project-config.ts` so it appears in the main app navigation.
