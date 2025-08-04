# FCM RSLib - Consumer Guide

## 🚀 Quick Start

### 1. Installation

```bash
npm install fcm-rslib
# hoặc
pnpm add fcm-rslib
# hoặc
yarn add fcm-rslib
```

### 2. Setup (Recommended)

Sử dụng lệnh setup để tự động tạo tất cả file cần thiết:

```bash
npx fcm-rslib setup
```

Lệnh này sẽ:

- ✅ Tạo file `src/config/firebase-message.json` với config mẫu
- ✅ Generate service worker `public/firebase-messaging-sw.js`
- ✅ Validate service worker
- ✅ Tạo file `fcm-usage-example.js` với ví dụ sử dụng

### 3. Manual Setup

Nếu bạn muốn setup thủ công:

#### Step 1: Generate Service Worker

```bash
# Sử dụng config mặc định
npx fcm-rslib generate

# Hoặc với config tùy chỉnh
npx fcm-rslib generate --config ./src/config/my-firebase-config.json

# Hoặc với output path tùy chỉnh
npx fcm-rslib generate --output ./public/my-sw.js
```

#### Step 2: Create Firebase Config

Tạo file `src/config/firebase-message.json`:

```json
{
  "firebase": {
    "apiKey": "your-api-key",
    "authDomain": "your-project.firebaseapp.com",
    "projectId": "your-project-id",
    "storageBucket": "your-project.appspot.com",
    "messagingSenderId": "123456789",
    "appId": "1:123456789:web:abcdef"
  },
  "vapidKey": "your-vapid-key",
  "storageKey": "my-app-notifications",
  "broadcastChannelName": "my-app-channel",
  "customEventName": "my-app-notification"
}
```

#### Step 3: Validate Service Worker

```bash
npx fcm-rslib validate
```

## 📝 Usage in Vue App

### Basic Usage

```vue
<template>
  <div>
    <button @click="handleRequestPermission">Enable Notifications</button>

    <div v-if="countReadAllNotification > 0" class="notification-badge">
      {{ countReadAllNotification }}
    </div>

    <div v-for="notification in listNotification" :key="notification.messageId">
      <h3>{{ notification.notification?.title }}</h3>
      <p>{{ notification.notification?.body }}</p>
      <button @click="readNotification(notification.messageId)">
        Mark as Read
      </button>
    </div>
  </div>
</template>

<script setup>
import { useNotification, initializeConfig } from "fcm-rslib";

// Initialize with your config (optional)
initializeConfig({
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  },
  vapidKey: process.env.FIREBASE_VAPID_KEY,
  storageKey: "my-app-notifications",
});

const {
  requestPermissionAndGetToken,
  initializeFCM,
  listNotification,
  countReadAllNotification,
  resetCountReadAllNotification,
  readNotification,
  removeNotification,
  clearAllNotification,
} = useNotification();

// Initialize FCM
initializeFCM();

const handleRequestPermission = async () => {
  await requestPermissionAndGetToken();
};

// Listen for custom events
window.addEventListener("my-app-notification", (event) => {
  console.log("Received notification:", event.detail);
});
</script>
```

### Advanced Usage with Custom Config

```vue
<script setup>
import { useNotification, initializeConfig } from "fcm-rslib";

// Custom configuration
initializeConfig({
  firebase: {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef",
  },
  vapidKey: "your-vapid-key",
  storageKey: "my-custom-notifications",
  broadcastChannelName: "my-custom-channel",
  customEventName: "my-custom-event",
});

const { initializeFCM, listNotification } = useNotification();

// Initialize FCM
initializeFCM();
</script>
```

## 🔧 CLI Commands

### Available Commands

```bash
# Setup complete configuration
npx fcm-rslib setup

# Generate service worker
npx fcm-rslib generate [--config <file>] [--output <path>]

# Validate existing service worker
npx fcm-rslib validate [--output <path>]

# Update Firebase configuration
npx fcm-rslib config [--config <file>]

# Initialize worker (legacy command)
npx fcm-rslib init-worker

# Show help
npx fcm-rslib help
```

### Command Options

- `--config <file>`: Path to Firebase config file (JSON)
- `--output <path>`: Output path for generated service worker
- `--force`: Force overwrite existing files

## 📁 File Structure

Sau khi setup, bạn sẽ có:

```
your-project/
├── src/config/firebase-message.json  # Firebase configuration
├── public/
│   └── firebase-messaging-sw.js  # Generated service worker
├── fcm-usage-example.js          # Usage example (optional)
└── src/
    └── components/
        └── YourComponent.vue      # Your Vue component
```

## 🔄 Service Worker Registration

Đảm bảo service worker được register trong app của bạn:

```javascript
// In your main.js or app initialization
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}
```

## 🎯 Configuration Options

### Firebase Config

```typescript
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}
```

### FCM Config

```typescript
interface FCMConfig {
  firebase: FirebaseConfig;
  vapidKey: string;
  storageKey?: string; // Mặc định: 'fcm-notifications'
  broadcastChannelName?: string; // Mặc định: 'fcm-notifications'
  customEventName?: string; // Mặc định: 'fcm-notification'
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Service worker not found**

   ```bash
   npx fcm-rslib validate
   ```

2. **Invalid Firebase config**
   - Kiểm tra file `src/config/firebase-message.json`
   - Đảm bảo tất cả field required đều có

3. **Permission denied**
   - Đảm bảo đã gọi `requestPermissionAndGetToken()`
   - Kiểm tra browser console cho errors

4. **Notifications not showing**
   - Kiểm tra service worker registration
   - Verify Firebase project settings
   - Check VAPID key configuration

### Debug Mode

```bash
DEBUG=true npx fcm-rslib generate
```

## 📚 Examples

Xem file `fcm-usage-example.js` được tạo tự động để có ví dụ chi tiết về cách implement.

## 🔗 Links

- [Firebase Console](https://console.firebase.google.com/)
- [FCM Documentation](https://firebase.google.com/docs/cloud-messaging)
- [VAPID Key Generation](https://web-push-codelab.glitch.me/)
