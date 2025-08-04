import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default Firebase configuration (same as src/config.ts)
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyANUdxcxppINSZkayH4nGn4t-lOTg3B7N4",
  authDomain: "my-landing-page-e7c7e.firebaseapp.com",
  projectId: "my-landing-page-e7c7e",
  storageBucket: "my-landing-page-e7c7e.firebasestorage.app",
  messagingSenderId: "999813447171",
  appId: "1:999813447171:web:4d47bb99b3fa66909a9836",
  measurementId: "G-43J14KHN0W",
};

const DEFAULT_VAPID_KEY =
  "BAnMUfFvWEf8QHCBIyHisHmMKp5PURUnn-6tFlM-5uJVZwjcRCnWkYRJuX8fL44imIRMFu3iFWwifc8jdcfAJ0U";

function loadConfig() {
  // Try to read from src/config/firebase-message.json first
  const configPath = join(
    __dirname,
    "..",
    "src",
    "config",
    "firebase-message.json"
  );

  if (existsSync(configPath)) {
    try {
      const configContent = readFileSync(configPath, "utf8");
      const config = JSON.parse(configContent);

      // If config has new structure (with firebase object)
      if (config.firebase) {
        return {
          firebase: config.firebase,
          vapidKey: config.vapidKey || DEFAULT_VAPID_KEY,
          broadcastChannelName:
            config.broadcastChannelName || "fcm-notifications",
        };
      }

      // If config has old structure (direct firebase config)
      return {
        firebase: config,
        vapidKey: config.vapidKey || DEFAULT_VAPID_KEY,
        broadcastChannelName:
          config.broadcastChannelName || "fcm-notifications",
      };
    } catch (error) {
      console.warn(`⚠️  Error reading config file: ${error.message}`);
    }
  }

  // Fallback to default config
  return {
    firebase: DEFAULT_FIREBASE_CONFIG,
    vapidKey: DEFAULT_VAPID_KEY,
    broadcastChannelName: "fcm-notifications",
  };
}

export { loadConfig, DEFAULT_FIREBASE_CONFIG, DEFAULT_VAPID_KEY };
