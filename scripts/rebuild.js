const { rebuild } = require("electron-rebuild");
const path = require("path");

async function rebuildSharp() {
  try {
    await rebuild({
      buildPath: process.cwd(),
      electronVersion: "30.5.1",
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
