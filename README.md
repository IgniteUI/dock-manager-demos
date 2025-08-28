# Dock Manager Demos

A samples browser and a collection of standalone projects demonstrating the Ignite UI Dock Manager. The main app hosts and navigates to projects under the `projects/` folder. Each project is a self-contained Vite app that you can also run independently.

---

## Table of Contents

* [Requirements](#requirements)
* [Repository Structure (key parts)](#repository-structure-key-parts)
* [Root npm scripts](#root-npm-scripts)
* [Quick Start](#quick-start)
* [Running the Main App](#running-the-main-app)
* [Running an Individual Project (Standalone)](#running-an-individual-project-standalone)
* [Adding a New Project](#adding-a-new-project)

    * [1) Create the project folder](#1-create-the-project-folder)
    * [2) Minimal package.json (example)](#2-minimal-packagejson-example)
    * [3) Minimal index.html (example)](#3-minimal-indexhtml-example)
    * [4) Minimal main component (example)](#4-minimal-main-component-example)
    * [5) Register the project in the main app](#5-register-the-project-in-the-main-app)
* [Packaging Projects as Downloads](#packaging-projects-as-downloads)
* [Conventions and Tips](#conventions-and-tips)
* [Troubleshooting](#troubleshooting)

---

## Requirements

### Runtime dependencies
These are installed automatically via `npm install`, but are required for the app to run:
- [lit@3.2.1](https://lit.dev/) — base framework for components
- [igniteui-webcomponents](../igniteui-webcomponents/dist/igniteui-webcomponents-0.0.0.tgz) — Ignite UI Web Components library (local package file, must be built or linked before install)
- [igniteui-theming@19.3.0-beta.3](https://www.npmjs.com/package/igniteui-theming) — SCSS theming utilities
- [@vaadin/router@2](https://vaadin.com/router) — client-side routing
- [@igniteui/material-icons-extended@3.1.0](https://www.npmjs.com/package/@igniteui/material-icons-extended) — extended icon set
- [@floating-ui/dom](https://floating-ui.com/) — positioning engine
- [sass](https://sass-lang.com/) — SASS compiler for styles

### Development dependencies
Needed when working on the repo:
- [vite@6](https://vitejs.dev/) — dev server & bundler
- [typescript@5.7](https://www.typescriptlang.org/) — type checking
- [tsx](https://www.npmjs.com/package/tsx) — run TypeScript/ESM scripts without build
- [sass-embedded](https://github.com/sass/dart-sass-embedded) — fast SCSS builds
- [marked](https://marked.js.org/) — Markdown rendering in demos
- [vite-plugin-static-copy](https://www.npmjs.com/package/vite-plugin-static-copy) — asset copying during build

## Repository Structure (key parts)

* `src/` — main app source

    * `app.ts` — main app entry
    * `app-routing.ts` — routing configuration
    * `project-config.ts` — project registry (controls routing and navigation)
    * `components/`

        * `navigation/` — navigation drawer component
        * `project-iframe/` — component that renders a project in an iframe
    * `data/` — data utilities used by the app (e.g., navigation mapping)
* `projects/` — individual, self-contained sample projects

    * `<project-id>/` — a project (Vite app) with its own `index.html`, `src/`, `package.json`, etc.
* `public/` — static assets for the main app
* `scripts/`

    * `downloads/index.ts` — generates downloadable archives for projects (prebuild step)
    * `project-manager.ts` — installs and runs all projects during development
* `vite.config.ts` — Vite config for the main app
* `package.json` — root scripts and dependencies

## Root npm scripts

```json
{
  "scripts": {
    "dev": "npm run prebuild && npm run install-projects && concurrently \"npm run dev:main\" \"npm run dev:projects\" \"npm run watch-styles\"",
    "dev:main": "vite --port 5173",
    "dev:projects": "tsx scripts/project-manager.ts dev",
    "install-projects": "tsx scripts/project-manager.ts install",
    "build": "npm run prebuild && npm run install-projects && npm run compile-styles && tsc && vite build",
    "prebuild": "tsx scripts/downloads/index.ts",
    "build:ci": "tsc && vite build --mode ci",
    "preview": "npm run prebuild && npm run build && vite preview",
    "prepare-downloads": "npm run prebuild",
    "compile-styles": "sass --load-path=node_modules src/styles/styles.scss:src/styles/styles.css",
    "watch-styles": "sass --watch --load-path=node_modules src/styles:src/styles src/styles/styles.scss:src/styles/styles.css"
  }
}
```

**What these do:**

* **prebuild**: Generates downloadable zips for projects and any other required prebuild assets.
* **install-projects**: Installs dependencies for all projects under `projects/`.
* **dev**: Runs prebuild, installs project deps, then starts:

    * the main app dev server,
    * all projects’ dev servers,
    * and a SASS watcher for main app styles.
* **build**: Runs prebuild, installs project deps, compiles styles, type-checks, and builds the main app.
* **preview**: Ensures prebuild, builds, then serves the built app locally.
* **prepare-downloads**: A convenience alias to run the same prebuild downloads step manually.

## Quick Start

Install dependencies:

```bash
npm install
```

## Running the Main App

The main app lists and navigates to all registered projects:

```bash
npm run dev
```

This will:

* Generate downloads,
* Install all projects’ dependencies,
* Start the main app on port 5173,
* Start all projects’ dev servers,
* Watch SASS for changes.

Open the printed local URL.
Use the navigation drawer to select a project.
Each project is rendered via an iframe pointing to `/projects/<project-id>/`.

## Running an Individual Project (Standalone)

Each project is a separate Vite app. You can run a single project independently:

```bash
cd projects/<your-project-id>
npm install
npm run dev
```

Build a project (optional):

```bash
cd projects/<your-project-id>
npm run build
```

> Note: The root `npm run dev` also starts all projects automatically for integrated development.

## Adding a New Project

Follow these steps to add a project under `projects/` and make it appear in the main app navigation.

### 1) Create a new folder

```
mkdir projects/<your-project-id>
```

**Recommended structure:**

```
projects/<your-project-id>/
 ├─ index.html
 ├─ package.json
 ├─ tsconfig.json
 ├─ vite.config.ts
 ├─ public/ (optional)
 └─ src/
     ├─ <your-project-id>.ts
     └─ styles/ (optional)
```

### 2) Minimal package.json (example)

```json
{
  "name": "<your-project-id>",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lit": "3.2.1",
    "igniteui-dockmanager": "^1.17.0"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "typescript": "^5.7.2"
  }
}
```

### 3) Minimal index.html (example)

```html
<!doctype html>
<html>
  <head>
    <title>Your Project</title>
  </head>
  <body>
    <your-project-id></your-project-id>
    <script type="module" src="./src/<your-project-id>.ts"></script>
  </body>
</html>
```

### 4) Minimal main component (example)

```ts
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { defineCustomElements } from 'igniteui-dockmanager/loader';

defineCustomElements();

@customElement('<your-project-id>')
export class YourProject extends LitElement {
  render() {
    return html`<igc-dockmanager></igc-dockmanager>`;
  }
}
```

### 5) Register the project in the main app

Add an entry to `src/project-config.ts`. The `id` must match your folder name under `projects/`, and `route` must be `/projects/<your-project-id>`.

Example:

```ts
{
  id: '<your-project-id>',
  name: 'Your Project Name',
  icon: 'widgets', // icon name
  component: '<your-project-id>',
  route: '/projects/<your-project-id>',
  description: 'Optional description'
}
```

That’s it:

* Navigation is generated from this config, so your project will appear automatically in the menu.
* The route `/projects/<your-project-id>` will render your project via the iframe component.

## Packaging Projects as Downloads

Project archives are generated by the prebuild step. Run it explicitly if needed:

```bash
npm run prepare-downloads
```

Typical workflow to refresh downloads and build:

```bash
npm run prepare-downloads
npm run build
```

Notes:

* The prebuild step scans `projects/` and creates archives per project for the main app to offer as downloads.
* No additional app code changes are required to expose the downloads.

## Conventions and Tips

* **Consistency:**
  Folder name = `id` = last segment of the `route`
  Example: `projects/stream-manager` → `id: "stream-manager"` → `route: "/projects/stream-manager"`

* **Icons:**
  Use valid icon names from the icon collection for the `icon` field.

* **Independent Development:**
  You can run projects standalone using their own dev server.

* **Integrated Development:**
  Use the root `npm run dev` to run the main app, all projects, and style watcher together.

* **Styles:**
  The main app uses SASS. `watch-styles` runs automatically during `npm run dev`.

## Troubleshooting

* **Project not visible in navigation:**
  Ensure you added an entry in `src/project-config.ts` with correct `id`, `name`, `icon`, and `route`.

* **Route loads but blank:**
  Check your project’s `index.html` and the module path (`./src/<your-project-id>.ts`).

* **Downloads not updating:**
  Re-run `npm run prepare-downloads`, then `npm run build`.
  Ensure the prebuild step finishes without errors.
