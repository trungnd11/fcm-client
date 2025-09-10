#!/usr/bin/env node
import { config as loadEnv } from "dotenv";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONFIG_FILE = join(process.cwd(), "src", "config", "firebase-message.json");

loadEnv();

export function overrideConfig(configPath = CONFIG_FILE) {
  if (!existsSync(configPath)) {
    console.warn(`⚠️  Config file not found: ${configPath}`);
    return;
  }

  try {
    const raw = readFileSync(configPath, "utf8");
    const config = JSON.parse(raw);

    const updatedConfig = handleUpdateConfig(config);

    writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2), "utf8");
    console.log(`✅ Config updated with environment variables: ${configPath}`);
  } catch (error) {
    console.error(`❌ Failed to update config: ${error.message}`);
  }
}

export function handleUpdateConfig(config) {
  return {
    ...config,
    firebase: {
      ...config.firebase,
      apiKey: process.env.FIREBASE_API_KEY || config.firebase?.apiKey,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || config.firebase?.authDomain,
      projectId: process.env.FIREBASE_PROJECT_ID || config.firebase?.projectId,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || config.firebase?.storageBucket,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || config.firebase?.messagingSenderId,
      appId: process.env.FIREBASE_APP_ID || config.firebase?.appId,
    },
    vapidKey: process.env.FIREBASE_VAPID_KEY || config.vapidKey,
    broadcastChannelName: process.env.BROADCAST_CHANNEL_NAME || config.broadcastChannelName,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  overrideConfig();
}
