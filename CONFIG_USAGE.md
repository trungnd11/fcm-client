# FCM RSLib Configuration Guide

## Cách sử dụng Config

### 1. Sử dụng Config Mặc định

Nếu không truyền config, library sẽ sử dụng config mặc định:

```typescript
import { useNotification, initializeFCM } from "fcm-rslib";

// Sử dụng config mặc định
const { requestPermissionAndGetToken, initializeFCM } = useNotification();

// Khởi tạo FCM
initializeFCM();
```

### 2. Override Config khi Khởi tạo

Bạn có thể override config khi khởi tạo:

```typescript
import { useNotification, initializeConfig, type FCMConfig } from "fcm-rslib";

// Cấu hình tùy chỉnh
const customConfig: Partial<FCMConfig> = {
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
};

// Khởi tạo với config tùy chỉnh
initializeConfig(customConfig);

// Sử dụng như bình thường
const { requestPermissionAndGetToken, initializeFCM } = useNotification();
initializeFCM();
```

### 3. Thay đổi Config Runtime

Bạn có thể thay đổi config trong runtime:

```typescript
import { setConfig, getConfig } from "fcm-rslib";

// Lấy config hiện tại
const currentConfig = getConfig();

// Thay đổi một phần config
setConfig({
  storageKey: "new-storage-key",
  customEventName: "new-event-name",
});
```

### 4. Cấu trúc Config

```typescript
interface FCMConfig {
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
  storageKey?: string; // Mặc định: 'fcm-notifications'
  broadcastChannelName?: string; // Mặc định: 'fcm-notifications'
  customEventName?: string; // Mặc định: 'fcm-notification'
}
```

### 5. Ví dụ Hoàn chỉnh

```typescript
import { useNotification, initializeConfig, Notification } from "fcm-rslib";

// Khởi tạo với config tùy chỉnh
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

// Sử dụng trong component
const {
  requestPermissionAndGetToken,
  initializeFCM,
  listNotification,
  countReadAllNotification,
} = useNotification();

// Khởi tạo FCM
initializeFCM();

// Request permission
await requestPermissionAndGetToken();
```

### 6. Lưu ý

- Config được merge một cách thông minh, chỉ override những field được truyền vào
- Firebase config được merge riêng biệt để đảm bảo tất cả field cần thiết đều có
- Config được lưu globally, nên chỉ cần khởi tạo một lần
- Nếu không khởi tạo config, sẽ sử dụng config mặc định
