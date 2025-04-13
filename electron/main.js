import { app, BrowserWindow, dialog, shell } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { ipcMain } from "electron";
import fs from "node:fs";
import sharp from "sharp";
import heicConvert from "heic-convert";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Rest of your code...
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
    resizable: true,
    minWidth: 500,
    minHeight: 600,
    center: true,
  });
  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
function getUniqueOutputPath(baseDir, baseName, ext) {
  let candidate = path.join(baseDir, `${baseName}.${ext}`);
  let counter = 1;
  while (fs.existsSync(candidate)) {
    candidate = path.join(baseDir, `${baseName} (${counter}).${ext}`);
    counter++;
  }
  return candidate;
}
ipcMain.handle(
  "convert-images",
  async (_, { paths, outputFormat, outputDir }) => {
    const results = [];
    const mainWindow = BrowserWindow.getAllWindows()[0];
    for (let i = 0; i < paths.length; i++) {
      const inputPath = paths[i];
      const ext = path.extname(inputPath).toLowerCase();
      const baseName = path.parse(inputPath).name;
      const targetDir = outputDir || path.dirname(inputPath);
      const outputPath = getUniqueOutputPath(targetDir, baseName, outputFormat);
      try {
        const buffer = fs.readFileSync(inputPath);
        let inputBuffer = buffer;
        if (ext === ".heic" || ext === ".heif") {
          const converted = await heicConvert({
            buffer,
            format: "JPEG",
            quality: 1,
          });
          inputBuffer = Buffer.from(converted);
        }
        await sharp(inputBuffer).toFormat(outputFormat).toFile(outputPath);
        results.push(outputPath);
      } catch (error) {
        console.error(`Failed to convert ${inputPath}:`, error);
      }
      // Send progress update to renderer process
      const percent = Math.round(((i + 1) / paths.length) * 100);
      mainWindow?.webContents.send("conversion-progress", percent);
    }
    return results;
  },
);
ipcMain.handle("select-output-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
    title: "Select Output Folder",
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});
ipcMain.handle("open-folder", async (_, folderPath) => {
  if (fs.existsSync(folderPath)) {
    await shell.openPath(folderPath);
  }
});
ipcMain.handle("open-external-url", async (_event, url) => {
  await shell.openExternal(url);
});
