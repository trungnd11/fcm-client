#!/usr/bin/env node

// eslint-disable-next-line no-redeclare
/* global process */

import { execSync } from "node:child_process";
import { chmodSync, existsSync } from "node:fs";
import { join } from "node:path";

console.log("🔧 Setting up FCM RSLib CLI locally...\n");

try {
  // Check if CLI script exists
  const cliScript = join(process.cwd(), "scripts", "cli.js");

  if (!existsSync(cliScript)) {
    console.error("❌ CLI script not found. Please run this from the project root.");
    process.exit(1);
  }

  // Make CLI script executable
  chmodSync(cliScript, "755");
  console.log("✅ Made CLI script executable");

  // Create symlink or copy to make it globally accessible
  const globalBin = join(process.cwd(), "node_modules", ".bin", "fcm-notification");

  try {
    // Try to create symlink
    execSync(`ln -sf "${cliScript}" "${globalBin}"`, { stdio: "inherit" });
    console.log("✅ Created symlink for global access");
  } catch {
    // Fallback: copy the file
    execSync(`cp "${cliScript}" "${globalBin}"`, { stdio: "inherit" });
    chmodSync(globalBin, "755");
    console.log("✅ Copied CLI script for global access");
  }

  console.log("\n🎉 FCM RSLib CLI setup completed!");
  console.log("\n📖 Usage:");
  console.log("   npx fcm-notification setup");
  console.log("   npx fcm-notification generate");
  console.log("   npx fcm-notification validate");
  console.log("   npx fcm-notification help");
} catch (error) {
  console.error("❌ Setup failed:", error.message);
  process.exit(1);
}
