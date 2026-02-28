import { rebuild } from "electron-rebuild";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const electronVersion = require("electron/package.json").version;

async function rebuildSharp() {
  try {
    await rebuild({
      buildPath: process.cwd(),
      electronVersion,
      force: true,
      types: ["prod", "optional"],
      onlyModules: ["sharp"],
      arch: "arm64",
      platform: "darwin",
    });
    console.log("Sharp rebuild complete");
  } catch (err) {
    console.error("Sharp rebuild failed:", err);
    process.exit(1);
  }
}

rebuildSharp();
