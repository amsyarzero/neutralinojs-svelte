import Neutralino from "@neutralinojs/lib";

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
