import { resetAxiosInstance } from "./config/axios";
import defaultConfig from "./config/firebase-message.json";

export interface FCMConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
    databaseURL?: string;
  };
  vapidKey: string;
  baseUrl?: string;
  storageKey?: string;
  broadcastChannelName?: string;
  customEventName?: string;
}

// Global config instance
export let globalConfig: FCMConfig = { ...defaultConfig };

// Function to load config from JSON file (for development/testing)
export const loadConfigFromFile = async (): Promise<FCMConfig> => {
  try {
    // Try to load from src/config/firebase-message.json
    const response = await fetch("/src/config/firebase-message.json");
    if (response.ok) {
      const fileConfig = await response.json();
      return {
        ...defaultConfig,
        ...fileConfig,
        firebase: {
          ...defaultConfig.firebase,
          ...fileConfig.firebase,
        },
      };
    }
  } catch {
    console.warn("Could not load config from file, using default config");
  }
  return defaultConfig;
};

export const setConfig = (config: Partial<FCMConfig>) => {
  globalConfig = {
    ...defaultConfig,
    ...config,
    firebase: {
      ...defaultConfig.firebase,
      ...config.firebase,
    },
  };
  if (config.baseUrl) {
    resetAxiosInstance();
  }
};

export const getConfig = (): FCMConfig => {
  return globalConfig;
};

export const initializeConfig = async (config?: Partial<FCMConfig>) => {
  if (config) {
    setConfig(config);
  } else {
    // Try to load from file if no config provided
    const fileConfig = await loadConfigFromFile();
    setConfig(fileConfig);
  }
  return globalConfig;
};
