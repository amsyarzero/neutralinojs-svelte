import { execSync } from "child_process";
import fs from "fs";

const distPath = "./dist/"

// Check if dist/ exists, and if not, build first
if (!fs.existsSync(distPath)) {
  console.log("Building project...");
  execSync("npm run build", { stdio: "inherit" });
}

// Now run dev
console.log("Starting dev server...");
execSync("npm run dev", { stdio: "inherit" });
