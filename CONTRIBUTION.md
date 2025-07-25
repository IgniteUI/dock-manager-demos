
## How to Add a New App to the Project
Follow this step-by-step guide to add a new app to the project, register it in the router, and display it in the navigation drawer.

### Step 1: Add a New View Component
1. Create a new folder for your app view inside the `views` directory. For example:
``` 
   src/views/my-new-app/
```
1. Create a new TypeScript file for the app view. For example:
``` 
   my-new-app-view.ts
```
1. Define a for your new app view. Use the following structure: `LitElement`
``` typescript
   import { html, LitElement } from 'lit';
   import { customElement } from 'lit/decorators.js';

   @customElement('my-new-app-view')
   export class MyNewAppView extends LitElement {
       render() {
           return html`<h1>Welcome to My New App!</h1>`;
       }
   }
```
1. Ensure the component is imported correctly in the application ( or related files). `app.ts`

### Step 2: Add a Route for the New App
1. Open the file. `app-routing.ts`
2. Add a new route object for your app. For example:
``` typescript
   import './views/my-new-app/my-new-app-view.ts';

   export const routes = [
       { path: '/', component: 'home-view' },
       { path: '/my-new-app', component: 'my-new-app-view' },
       // other routes...
   ];
```
### Step 3: Update Navigation Drawer Items
1. Open the file inside the `data` directory. `navigation-items.ts`
2. Add a new navigation item for your app. For example:
``` typescript
   export const navigationItems: INavItem[] = [
       {
           label: 'Home',
           icon: 'home',
           route: '/',
           collection: 'material',
       },
       {
           label: 'My New App',
           icon: 'app',
           route: '/my-new-app',
           collection: 'material',
       },
       // other navigation items...
   ];
```
1. Ensure the route for the navigation item matches the route in . `app-routing.ts`

### Step 4: Test Router and Navigation
1. Run the application.
2. Open the navigation drawer and verify that your new app is displayed as a menu item.
3. Click on the menu item to test the navigation to your new app view.

### Optional: Customize Styling
1. If necessary, create a new SCSS or CSS file for styling your app view. For example:
``` 
   my-new-app-view.scss
```
1. Import the styles into your component:
``` typescript
   import styles from './my-new-app-view.scss?inline';

   static styles = unsafeCSS(styles);
```
### Summary
- **New View Component**: Create a new view file for your app.
- **Routing Configuration**: Register it in the . `app-routing.ts`
- **Navigation Drawer**: Add your app to to display it in the drawer. `navigation-items.ts`
-
- Test the setup and ensure everything functions as intended.
