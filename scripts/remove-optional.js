// scripts/remove-optional.js
const fs = require("fs");
const path = require("path");

exports.default = async function (context) {
  const appDir = context.appOutDir;
  const nodeModules = path.join(appDir, "resources", "app", "node_modules");

  const toRemove = [
    "@msgpackr-extract/msgpackr-extract-darwin-arm64",
    "@msgpackr-extract/msgpackr-extract-darwin-x64",
    "@msgpackr-extract/msgpackr-extract-linux-arm",
    "@msgpackr-extract/msgpackr-extract-linux-arm64",
  ];

  toRemove.forEach((pkg) => {
    const target = path.join(nodeModules, pkg);
    if (fs.existsSync(target)) {
      console.log(`🗑 Removing optional package: ${pkg}`);
      fs.rmSync(target, { recursive: true, force: true });
    }
  });
};
