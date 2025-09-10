import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let DEFAULT_FIREBASE_CONFIG = {};
let DEFAULT_VAPID_KEY = "";
let DEFAULT_BROADCAST_CHANNEL = "fcm-notifications";

// Load default config from JSON
try {
  const defaultPath = join(__dirname, "..", "src", "config", "firebase-message.json");
  if (existsSync(defaultPath)) {
    const defaultContent = readFileSync(defaultPath, "utf8");
    const defaultJson = JSON.parse(defaultContent);

    DEFAULT_FIREBASE_CONFIG = defaultJson.firebase || {};
    DEFAULT_VAPID_KEY = defaultJson.vapidKey || "";
    DEFAULT_BROADCAST_CHANNEL = defaultJson.broadcastChannelName || "fcm-notifications";
  }
} catch (err) {
  console.warn(`⚠️  Error reading default config: ${err.message}`);
}

function loadConfig() {
  const configPath = join(__dirname, "..", "src", "config", "firebase-message.json");

  if (existsSync(configPath)) {
    try {
      const configContent = readFileSync(configPath, "utf8");
      const config = JSON.parse(configContent);

      if (config.firebase) {
        return {
          firebase: config.firebase,
          vapidKey: config.vapidKey || DEFAULT_VAPID_KEY,
          broadcastChannelName: config.broadcastChannelName || DEFAULT_BROADCAST_CHANNEL,
        };
      }

      return {
        firebase: config,
        vapidKey: config.vapidKey || DEFAULT_VAPID_KEY,
        broadcastChannelName: config.broadcastChannelName || DEFAULT_BROADCAST_CHANNEL,
      };
    } catch (error) {
      console.warn(`⚠️  Error reading config file: ${error.message}`);
    }
  }

  // fallback to default config
  return {
    firebase: DEFAULT_FIREBASE_CONFIG,
    vapidKey: DEFAULT_VAPID_KEY,
    broadcastChannelName: DEFAULT_BROADCAST_CHANNEL,
  };
}

export { loadConfig, DEFAULT_FIREBASE_CONFIG, DEFAULT_VAPID_KEY, DEFAULT_BROADCAST_CHANNEL };
