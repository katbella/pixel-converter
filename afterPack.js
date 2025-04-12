const path = require("path");
const fs = require("fs-extra");

module.exports = async function (context) {
  const platform = context.packager.platform;
  if (platform.name !== "mac") return;

  const appContents = path.join(
    context.appOutDir,
    "Pixel File Converter.app",
    "Contents",
  );

  // Copy to multiple locations to ensure libraries are found
  const copyLocations = [
    path.join(appContents, "Frameworks"),
    path.join(
      appContents,
      "Resources",
      "app.asar.unpacked",
      "node_modules",
      "sharp",
    ),
  ];

  const libvipsPath = path.join(
    process.cwd(),
    "node_modules",
    "@img",
    "sharp-libvips-darwin-arm64",
    "lib",
  );

  for (const location of copyLocations) {
    await fs.ensureDir(location);
    await fs.copy(libvipsPath, location);
    console.log(`✅ Copied libvips libraries to ${location}`);
  }

  // Create symlinks for compatibility
  const frameworksPath = path.join(appContents, "Frameworks");
  const files = await fs.readdir(libvipsPath);

  for (const file of files) {
    if (file.endsWith(".dylib")) {
      const source = path.join(frameworksPath, file);
      const target = `@rpath/${file}`;
      try {
        await fs.symlink(source, target);
      } catch (err) {
        console.log(
          `Note: Symlink creation failed for ${file} (this may be ok)`,
        );
      }
    }
  }
};
