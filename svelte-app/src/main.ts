/**
 * This is what launches the app! Mostly, you don't have to touch this unless needed.
 */

import "./app.css";
import "./windowing";

import { mount } from "svelte";
import App from "./App.svelte";

import { init } from "@neutralinojs/lib";

init();

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
