# How to create the Neutralinojs Svelte template

This mostly serves as a guide for me, but it can be helpful for others too.

Also, this guide is only a step-by-step; to understand more, read the [Neutralinojs docs](https://neutralino.js.org/docs/).

## Helpful resources

- [**Neutralinojs docs, using frontend libraries**](https://neutralino.js.org/docs/getting-started/using-frontend-libraries): Super helpful guide on fusing Neutralinojs with a frontend library
- [**Ori's Neutralino Svelte template**](https://github.com/origamingwastaken/neutralino-svelte): The original Neutralinojs Svelte template that I used and referred to. Mega amazing 💪🏽
- ChatGPT, but only if you also understand the gist of the above documentation 😂

# Steps

## Initialising project

1. In anywhere you prefer, create a Neutralinojs project using the [neutralinojs-zero](https://github.com/neutralinojs/neutralinojs-zero) template by running this in a terminal.

   For me, I prefer the name `neutralinojs-svelte`, so that will be my app name.

```bash
neu create (app name) --template neutralinojs/neutralinojs-zero
```

2. Create a Svelte Vite project inside the newly created project.

```bash
cd neutralinojs-svelte
npm create vite@latest
```

3. An interactive menu will pop-up. Choose these values:

| Field        | Value                           |
| ------------ | ------------------------------- |
| Project name | Any name, I prefer `svelte-app` |
| Framework    | Svelte                          |
| Variant      | Typescript                      |

4. Go into the newly created Svelte project, run `npm install`.

```bash
cd svelte-app
npm install
```

## Basic Neutralinojs setup

1. Remove the `./www/` folder, as it is not needed.

> NOTE: you can copy the `icon.png` file inside to somewhere like `svelte-app/public/`, as it's the favicon.

2. Open `neutralino.config.json`. This is the config file for Neutralinojs. The important properties to configure are:

| Property      | Context              | Value                                       |
| ------------- | -------------------- | ------------------------------------------- |
| applicationId | App name             | Any e.g. `js.neutralino.svelte`             |
| version       | App version          | Any value e.g. 1.0.0                        |
| icon          | App icon             | Any path e.g. `/svelte-app/public/icon.png` |
| documentRoot  | Vite build directory | `/svelte-app/dist`                          |
| resourcesPath | Vite build directory | `/svelte-app/dist`                          |

## Configuring neu CLI

1. In `neutralino.config.json`, remove the `clientLibrary` property and value (located under the `cli` property).

2. Now, test by executing these commands:

```bash
cd ./svelte-app <-- go into the Svelte project
npm run build <-- this launches the Vite server
cd .. <-- go back to root
neu run <-- preview the Neutralinojs app
```

This should show up:

![The initial app provided by `neu run`.](neu-run.png)

## WARNING: DO NOT PRESS THE MINIMISE OR MAXIMISE BUTTON FOR NOW.

Neutralinojs has a bug in which **the application will suddenly disappear upon pressing either minimise or maximise**, forcing you to **redoing everything from beginning** (yes i'm not kidding).

The way to fix it is to attach window events, which will be discussed in the part afterwards.

## Adding the neutralinojs API

1. Inside `./svelte-app/`, install `@neutralinojs/lib` from npm.

```bash
cd ./svelte-app
npm install @neutralinojs/lib
```

2. In `neutralino.config.json`, add this property to the `window` property:

```json
"window": {
    // other properties...
    "injectGlobals": true
}
```

This injects the global Neutralinojs variables needed into the app, so it can function.

3. In `./svelte-app/src/main.ts`, add the `init` function from `@neutralinojs/lib`.

```ts
import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { init } from "@neutralinojs/lib"; // add this

init(); // and this
// MUST be before app initialisation

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
```

To test the API, let's fix the minimise-maximise problem.

### Fix the minimise-maximise problem

1. In `neutralino.config.json`, allow window, events, and debug API access.

```json
  "nativeAllowList": ["app.*", "events.*", "window.*", "debug.*"],
```

> NOTE: This allows for all functions under a namespace. You can be more specific and only allow certain functions e.g. `"window.maximize"`

2. Inside anywhere in `./svelte-app/` (preferably in `svelte-app/src`), create a Typescript file e.g. `windowing.ts`.

3. Add these lines inside `windowing.ts` (thanks Ori! 🙇🏽‍♂️):

```ts
import Neutralino from "@neutralinojs/lib"; // cannot import specifics as `Neutralino.window` will clash with `window` property

// check for maximise, minimise, and window close event
Neutralino.events
  .on("windowMaximize", () => {
    Neutralino.window.maximize();
  })
  .catch(console.error);

Neutralino.events
  .on("windowMinimize", () => {
    Neutralino.window.minimize();
  })
  .catch(console.error);

Neutralino.events
  .on("windowClose", () => {
    Neutralino.app.exit(0).catch(console.error);
  })
  .catch(console.error)
  .then(() => {
    Neutralino.debug.log("Attached window closer").catch(console.error);
  });
```

This ensures that all three buttons (maximise, minimise, close) are handled properly (and also allow you to customise them too).

4. In `./svelte-app/src/main.ts`, add this `import` line:

```ts
import { mount } from "svelte";
import "./app.css";
import "./windowing"; // this one
import App from "./App.svelte";
import { init } from "@neutralinojs/lib";
```

5. Test by running these commands again:

```bash
cd ./svelte-app
npm run build
cd ..
neu run
```

## Configuring hot module replacement (HMR) feature

Those four commands above are a doozy, yeah? `cd` this <sub>cdeez nuts</sub> , `build` that. Let's enable the HMR feature so you only need to run one command and make the app refresh with every change you make.

1. Inside `./svelte-app/`, make a file called `run-dev.js` or anything similar.

```js
import { execSync } from "child_process";
import fs from "fs";

const distPath = "./dist/";

if (!fs.existsSync(distPath)) {
  console.log("Building project...");
  execSync("npm run build", { stdio: "inherit" });
}

// Now run dev
console.log("Starting dev server...");
execSync("npm run dev", { stdio: "inherit" });
```

This will check if `./svelte-app/dist/` exists first. If no, it runs `npm run build` first, then `npm run dev`; else it skips straight to `npm run dev`.

3. In `neutralino.config.json`, under the `cli` property, add these:

```json
"cli" : {
    // other properties...

    "frontendLibrary": {
      "patchFile": "/svelte-app/dist/index.html", // point towards the Svelte index.html file
      "devUrl": "http://localhost:5173", // Vite server URL
      "projectPath": "/svelte-app/", // Svelte/Vite project path
      "initCommand": "npm install", // dependency install command
      "devCommand": "node run-dev.js", // `neu run` runs this, and HMR also runs this with every change
      "buildCommand": "npm run build" // `neu build` runs this
    }
}
```

2. Instead of running the four commands above, **simply execute `neu run`**.

   The app will now open; now you can change anything inside `./svelte-app/src/App.svelte`, and the app will change immediately to reflect that 🎉

3. To build the app, **execute `neu build`**. This will build two files inside `./dist`:
   - executables for Windows, macOS, and Linux
   - `resources.neu`, which contains the app UI and functionality
