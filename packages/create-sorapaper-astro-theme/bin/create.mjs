#!/usr/bin/env node

import { cp, copyFile, mkdir, readdir, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import process from "node:process";

const MINIMUM_NODE_VERSION = [22, 12, 0];

function compareVersions(current, minimum) {
  for (let index = 0; index < minimum.length; index += 1) {
    if (current[index] !== minimum[index]) return current[index] - minimum[index];
  }
  return 0;
}

function printUsage() {
  console.log("Usage: npm create sorapaper-astro-theme@latest <project-directory>");
}

async function isEmptyDirectory(directory) {
  try {
    const entries = await readdir(directory);
    return entries.length === 0;
  } catch (error) {
    if (error && error.code === "ENOENT") return true;
    if (error && error.code === "ENOTDIR") return false;
    throw error;
  }
}

function getTemplateDirectory() {
  const require = createRequire(import.meta.url);
  return dirname(require.resolve("sorapaper-astro-theme/package.json"));
}

async function copyTemplate(templateDirectory, destination) {
  const lockfile = resolve(templateDirectory, ".sorapaper-package/pnpm-lock.yaml");
  const templateEntries = await readdir(templateDirectory, { withFileTypes: true });

  await mkdir(destination, { recursive: true });
  await Promise.all(
    templateEntries
      .filter((entry) => entry.name !== ".sorapaper-package" && entry.name !== "node_modules")
      .map((entry) => cp(resolve(templateDirectory, entry.name), resolve(destination, entry.name), { recursive: true }))
  );

  await copyFile(lockfile, resolve(destination, "pnpm-lock.yaml"));
}

const [major, minor, patch] = process.versions.node.split(".").map(Number);
if (compareVersions([major, minor, patch], MINIMUM_NODE_VERSION) < 0) {
  console.error("SoraPaper requires Node.js 22.12.0 or newer.");
  process.exitCode = 1;
} else {
  const arguments_ = process.argv.slice(2);
  if (arguments_.includes("--help") || arguments_.includes("-h")) {
    printUsage();
  } else if (arguments_.length !== 1 || arguments_[0].startsWith("-")) {
    printUsage();
    process.exitCode = 1;
  } else {
    const destination = resolve(arguments_[0]);

    if (!(await isEmptyDirectory(destination))) {
      console.error(`Refusing to overwrite the non-empty directory: ${destination}`);
      process.exitCode = 1;
    } else {
      const destinationExists = await stat(destination).then(() => true).catch((error) => {
        if (error && error.code === "ENOENT") return false;
        throw error;
      });

      if (!destinationExists) await mkdir(destination, { recursive: true });
      await copyTemplate(getTemplateDirectory(), destination);

      console.log(`Created SoraPaper in ${destination}`);
      console.log("\nNext steps:");
      console.log(`  cd ${destination}`);
      console.log("  pnpm install");
      console.log("  pnpm dev");
    }
  }
}
