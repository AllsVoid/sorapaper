import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const mode = process.argv[2];
const root = process.cwd();
const source = resolve(root, "pnpm-lock.yaml");
const stagingDirectory = resolve(root, ".sorapaper-package");
const stagedLockfile = resolve(stagingDirectory, "pnpm-lock.yaml");

if (mode === "prepare") {
  mkdirSync(stagingDirectory, { recursive: true });
  copyFileSync(source, stagedLockfile);
} else if (mode === "clean") {
  rmSync(stagingDirectory, { recursive: true, force: true });
} else {
  throw new Error(`Unknown npm package lockfile mode: ${mode ?? "missing"}`);
}
