# Dock Manager Demos

This project demonstrates the usage of the Ignite UI Dock Manager component through multiple sample applications. It serves as both a samples browser and individual project runner.

## Project Structure

- `src/` - Main samples browser application source files
    - `components/` - Shared UI components for the samples browser
    - `views/` - Individual sample view components
    - `app-routing.ts` - Router configuration for navigation
    - `app.ts` - Main application entry point
- `projects/` - Individual sample projects
- `downloads/` - Generated zip files for downloadable projects (created during build)
- `public/` - Static assets

## Prerequisites
- Node.js (version 18.0.0 or higher)
- npm (version 7.0.0 or higher)


## Running as Samples Browser
The main application serves as a samples browser that displays individual projects in iframes:

## Install dependencies:

```bash
npm install
```

### Start the development server:

```bash
npm run dev
```

### Building for Production
To build the samples browser application:

```bash
npm run build
```

### Preview the production build:

```bash
npm run preview
```

## Adding a New Project
Follow these steps to add a new project to the samples' browser:

### Step 1: Create a project structure

```
projects/your-project-name/
├── index.html
├── package.json
├── vite.config.js (optional)
├── src/
│   ├── your-project-name.ts
│   ├── styles/
│   └── components/
```

Create a new folder in the `projects/` directory:

```bash
mkdir projects/your-project-name
```
```bash
cd projects/your-project-name
```

### Step 2: Create package.json:
Make sure to install the latest version of Lit and igniteui-dockmanager

```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lit": "3.2.1",
    "@infragistics/igniteui-dockmanager": "^1.16.1",
  }
}

```

### step 3: Create index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Project Name</title>
</head>
<body>
    <!--  You can also add the doc-manager in the index file if you don't need a wrapping component -->
    <your-project-name></your-project-name>
    <script type="module" src="./src/your-project-name.ts"></script>
</body>
</html>
```

### Step 4: Create the Main Component
```typescript
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './your-project-name.scss?inline';
import { defineCustomElements } from '@infragistics/igniteui-dockmanager/loader';

// Initialize the dock manager
defineCustomElements();

@customElement('your-project-name')
export class YourProjectName extends LitElement {
  render() {
    return html`
     <igc-dockmanager></igc-dockmanager>
    `;
  }

  static styles = unsafeCSS(styles);
}
```

### Step 5: Create a View Component for the Samples Browser
Create a new view component in `src/views/your-project-name/your-project-name-view.ts`
NOTE - do not name your .ts file the same way as your .ts file in the  /projects folder" add "-view" to the end of the .ts file. it is important to follow the naming convention `your-project-name-view.ts`

```typescript
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('your-project-name-view')
export class YourProjectNameView extends LitElement {
 
  render() {
    return html`
      <iframe 
        src="/projects/your-project-name/" 
        title="Your Project Name Demo">
      </iframe>
    `;
  }

	static styles = unsafeCSS(styles);
}
```


