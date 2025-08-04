#!/usr/bin/env node

/* global process */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function showHelp() {
  console.log(`
🔥 FCM RSLib CLI

Usage: fcm-rslib <command> [options]

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

Examples:
  fcm-rslib init-worker
  fcm-rslib generate --output ./public/sw.js
  fcm-rslib validate
  fcm-rslib config --config ./src/config/firebase-message.json
  fcm-rslib setup

For more information, visit: https://github.com/your-repo/fcm-rslib
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
    console.log(
      "📁 Service worker location: ./public/firebase-messaging-sw.js"
    );
    console.log("\n📖 Next steps:");
    console.log("   1. Register the service worker in your app");
    console.log("   2. Request notification permission");
    console.log("   3. Get FCM token and send to your server");
  } catch (error) {
    console.error(
      "\n❌ Failed to initialize FCM Service Worker:",
      error.message
    );
    process.exit(1);
  }
}

async function setup() {
  console.log("🔧 Setting up FCM RSLib...\n");

  try {
    // Check if config file exists
    const configPath = "./src/config/firebase-message.json";
    if (!existsSync(configPath)) {
      console.log("📝 Creating Firebase config file...");

      // Ensure src/config directory exists
      const configDir = "./src/config";
      if (!existsSync(configDir)) {
        mkdirSync(configDir, { recursive: true });
        console.log("   ✅ Created directory: src/config");
      }

      await runWorkerScript("update-config", ["--config", configPath]);
    } else {
      console.log("✅ Firebase config file already exists");
    }

    // Generate service worker
    console.log("\n📝 Generating service worker...");
    await runWorkerScript("generate");

    // Validate service worker
    console.log("\n🔍 Validating service worker...");
    await runWorkerScript("validate");

    // Create usage example
    console.log("\n📝 Creating usage example...");
    createUsageExample();

    console.log("\n✅ FCM RSLib setup completed successfully!");
    console.log("\n📁 Generated files:");
    console.log(
      "   - ./src/config/firebase-message.json (Firebase configuration)"
    );
    console.log("   - ./public/firebase-messaging-sw.js (Service worker)");
    console.log("   - ./fcm-usage-example.js (Usage example)");

    console.log("\n📖 Next steps:");
    console.log(
      "   1. Update src/config/firebase-message.json with your Firebase project details"
    );
    console.log("   2. Register the service worker in your app");
    console.log("   3. Import and use fcm-rslib in your Vue app");
    console.log("   4. Check fcm-usage-example.js for implementation details");
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
    process.exit(1);
  }
}

function createUsageExample() {
  const exampleContent = `// FCM RSLib Usage Example
import { useNotification, initializeConfig } from 'fcm-rslib';

// 1. Initialize with your config (optional - will use default if not provided)
initializeConfig({
  firebase: {
    apiKey: 'your-api-key',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abcdef',
  },
  vapidKey: 'your-vapid-key',
  storageKey: 'my-app-notifications',
  broadcastChannelName: 'my-app-channel',
  customEventName: 'my-app-notification',
});

// 2. Use in your Vue component
export default {
  setup() {
    const { 
      requestPermissionAndGetToken, 
      initializeFCM, 
      listNotification,
      countReadAllNotification,
      resetCountReadAllNotification,
      readNotification,
      removeNotification,
      clearAllNotification
    } = useNotification();

    // Initialize FCM
    initializeFCM();

    // Request permission and get token
    const handleRequestPermission = async () => {
      await requestPermissionAndGetToken();
    };

    // Listen for custom events
    window.addEventListener('my-app-notification', (event) => {
      console.log('Received notification:', event.detail);
    });

    return {
      listNotification,
      countReadAllNotification,
      resetCountReadAllNotification,
      readNotification,
      removeNotification,
      clearAllNotification,
      handleRequestPermission,
    };
  },
};
`;

  writeFileSync("./fcm-usage-example.js", exampleContent, "utf8");
  console.log("   ✅ Created fcm-usage-example.js");
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (
    !command ||
    command === "help" ||
    command === "--help" ||
    command === "-h"
  ) {
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
        console.log('\nRun "fcm-rslib help" for available commands.');
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
