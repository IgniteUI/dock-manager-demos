# Dock Manager Demos

A simple gallery of demos for **Ignite UI Dock Manager**. The main app lists projects under `projects/`, and each demo can also run standalone.

---

## Prerequisites

* **Node.js** (LTS recommended)
* **npm**

---

## Quick Start (Samples Browser)

install dev dependencies
```bash
npm install
```

Run the dev server
```bash
npm run dev
```

This starts the main samples browser that discovers demos in `projects/` and serves them via the app shell.

---

## Run a Single Demo

Example: run the **stream-manager** demo

```bash
cd projects/stream-manager
```
```bash
npm install
```
```bash
npm run dev
```

---

## Add a New Demo

1. **Create a project folder**

    * Add a new directory: `projects/<project-id>`
    * Include a minimal Vite app (`index.html`, `src/`, `package.json`).
    * **Use the folder name as the project id** (must match the `id` you register below).

2. **Register your project** in `src/project-config.ts` so it appears in the main app navigation.

   ```ts
   export const projects: ProjectConfig[] = [
     {
       id: 'my-project',
       name: 'My Project',
       icon: 'smanager',
     }
   ];
   ```

    * **id**: used for router navigation and the `<iframe>` source.
    * **name**: label used in the navigation drawer.
    * **icon**: navigation icon. If omitted, a default icon is used.

   You have two options for icons:

   #### Option A — Use an igc-icon
    this icon is colored by the navigation-drawer component

    * Add the icon in `src/icons/icons.ts` and register it in `src/data/icon-registry.ts`.
    * Then set `icon: '<icon-name>'` in your project entry.

   #### Option B — Use a custom full‑color SVG logo

    1. Add your SVG string to `src/assets/icons.ts`:

       ```ts
       export const MY_LOGO = '<svg>...</svg>';
       ```
    2. Import and use it in `src/project-config.ts`:

       ```ts
       import { MY_LOGO } from '../assets/icons'; // adjust path as needed
 
       export const projects: ProjectConfig[] = [
         {
           id: 'my-project',
           name: 'My Project',
           icon: MY_LOGO,
         }
       ];
       ```

3. **Add a minimal Vite config** in your demo folder (so standalone runs work correctly):

   ```ts
   // vite.config.ts
   import { defineConfig } from 'vite';

   export default defineConfig({
     base: './',
   });
   ```
