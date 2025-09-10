#!/usr/bin/env node

// eslint-disable-next-line no-redeclare
/* global process */

import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { overrideConfig } from "./override-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function showHelp() {
  console.log(`
🔥 FCM RSLib CLI

Usage: @f88/fcm-notification <command> [options]

Commands:
  init-worker              Initialize and generate FCM service worker
  generate                 Generate service worker file
  validate                 Validate existing service worker
  config                   Update Firebase configuration
  setup                    Setup complete FCM configuration
  help                     Show this help message

Options:
  --config <file>          Path to Firebase config file (JSON)
  --output <path>          Output path for generated service worker
  --force                  Force overwrite existing files
  
Environment Variables (override firebase-message.json):
  FIREBASE_API_KEY              Firebase Web API Key
  FIREBASE_AUTH_DOMAIN          Firebase Auth Domain
  FIREBASE_PROJECT_ID           Firebase Project ID
  FIREBASE_STORAGE_BUCKET       Firebase Storage Bucket
  FIREBASE_MESSAGING_SENDER_ID  Firebase Messaging Sender ID
  FIREBASE_APP_ID               Firebase App ID
  FIREBASE_VAPID_KEY            VAPID Key for WebPush

Examples:
  fcm-notification init-worker
  fcm-notification generate --output ./public/sw.js
  fcm-notification validate
  fcm-notification config --config ./src/config/firebase-message.json
  fcm-notification setup
`);
}

function runWorkerScript(command, args = []) {
  const workerScript = join(__dirname, "fcm-worker.js");

  return new Promise((resolve, reject) => {
    const child = spawn("node", [workerScript, command, ...args], {
      stdio: "inherit",
      cwd: process.cwd(),
      env: {
        ...process.env,
        FCM_RSLIB_INSTALLED: "true",
      },
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

async function initWorker() {
  console.log("🚀 Initializing FCM Service Worker...\n");

  try {
    // Generate service worker
    console.log("📝 Generating service worker...");
    await runWorkerScript("generate");

    // Validate the generated service worker
    console.log("\n🔍 Validating service worker...");
    await runWorkerScript("validate");

    console.log("\n✅ FCM Service Worker initialized successfully!");
    console.log("📁 Service worker location: ./public/firebase-messaging-sw.js");
    console.log("\n📖 Next steps:");
    console.log("   1. Register the service worker in your app");
    console.log("   2. Request notification permission");
    console.log("   3. Get FCM token and send to your server");
  } catch (error) {
    console.error("\n❌ Failed to initialize FCM Service Worker:", error.message);
    process.exit(1);
  }
}

async function setup() {
  console.log("🔧 Setting up @f88/fcm-notification...\n");

  try {
    console.log("\n⚙️  Applying environment overrides (if any)...");
    overrideConfig();

    // Generate service worker
    console.log("\n📝 Generating service worker...");
    await runWorkerScript("generate");

    // Validate service worker
    console.log("\n🔍 Validating service worker...");
    await runWorkerScript("validate");

    console.log("\n✅ @f88/fcm-notification setup completed successfully!");
    console.log("\n📁 Generated files:");
    console.log("   - ./public/firebase-messaging-sw.js (Service worker)");

    console.log("\n📖 Next steps:");

    console.log("   1. Register the service worker in your app");
    console.log("   2. Import and use @f88/fcm-notification in your Vue app");
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "help" || command === "--help" || command === "-h") {
    showHelp();
    return;
  }

  try {
    switch (command) {
      case "init-worker":
        await initWorker();
        break;

      case "setup":
        await setup();
        break;

      case "generate":
      case "validate":
      case "config":
        await runWorkerScript(command, args.slice(1));
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log('\nRun "fcm-notification help" for available commands.');
        process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run if this file is executed directly
// Cross-platform check for direct execution
const isDirectExecution =
  import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}` ||
  import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}` ||
  process.argv[1].includes("cli.js");

if (isDirectExecution) {
  main();
}
