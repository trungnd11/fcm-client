export interface FCMConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
  vapidKey: string;
  storageKey?: string;
  broadcastChannelName?: string;
  customEventName?: string;
}

// Default config
const defaultConfig: FCMConfig = {
  firebase: {
    apiKey: "AIzaSyANUdxcxppINSZkayH4nGn4t-lOTg3B7N4",
    authDomain: "my-landing-page-e7c7e.firebaseapp.com",
    projectId: "my-landing-page-e7c7e",
    storageBucket: "my-landing-page-e7c7e.firebasestorage.app",
    messagingSenderId: "999813447171",
    appId: "1:999813447171:web:4d47bb99b3fa66909a9836",
    measurementId: "G-43J14KHN0W",
  },
  vapidKey:
    "BAnMUfFvWEf8QHCBIyHisHmMKp5PURUnn-6tFlM-5uJVZwjcRCnWkYRJuX8fL44imIRMFu3iFWwifc8jdcfAJ0U",
  storageKey: "fcm-notifications",
  broadcastChannelName: "fcm-notifications",
  customEventName: "fcm-notification",
};

// Global config instance
let globalConfig: FCMConfig = { ...defaultConfig };

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
