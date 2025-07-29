# FCM RSLib - Usage Guide

Hướng dẫn sử dụng FCM RSLib khi cài đặt như dependency trong dự án khác.

## Installation

```bash
# Using npm
npm install fcm-rslib

# Using pnpm
pnpm add fcm-rslib

# Using yarn
yarn add fcm-rslib
```

## Quick Start

### 1. Initialize FCM Service Worker

```bash
# Using CLI command
npx fcm-rslib init-worker

# Or using pnpm
pnpm exec fcm-rslib init-worker

# Or using yarn
yarn exec fcm-rslib init-worker
```

### 2. Use in your Vue app

```vue
<script setup>
import { useFcm } from 'fcm-rslib'

const { 
  token, 
  permission, 
  requestPermission, 
  onMessage 
} = useFcm()

// Request notification permission
await requestPermission()

// Listen to foreground messages
onMessage((payload) => {
  console.log('Received message:', payload)
})
</script>
```

## CLI Commands

Khi cài đặt như dependency, bạn có thể sử dụng CLI thông qua `npx`, `pnpm exec`, hoặc `yarn exec`:

```bash
# Initialize FCM service worker
npx fcm-rslib init-worker

# Generate service worker
npx fcm-rslib generate

# Validate service worker
npx fcm-rslib validate

# Update Firebase config
npx fcm-rslib config

# Show help
npx fcm-rslib help
```

## Package.json Scripts

Bạn cũng có thể thêm scripts vào `package.json` của dự án:

```json
{
  "scripts": {
    "fcm:init": "fcm-rslib init-worker",
    "fcm:generate": "fcm-rslib generate",
    "fcm:validate": "fcm-rslib validate",
    "fcm:config": "fcm-rslib config"
  }
}
```

Sau đó sử dụng:

```bash
npm run fcm:init
pnpm run fcm:init
yarn fcm:init
```

## Custom Configuration

### Using Custom Firebase Config

1. Tạo file `firebase-config.json`:

```json
{
  "apiKey": "your-api-key",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abcdef",
  "measurementId": "G-XXXXXXXXXX"
}
```

2. Sử dụng với CLI:

```bash
npx fcm-rslib generate --config ./firebase-config.json
```

### Custom Output Path

```bash
npx fcm-rslib generate --output ./src/sw.js
```

## What Gets Generated

Khi chạy `fcm-rslib init-worker`, các file sau sẽ được tạo:

- `./public/firebase-messaging-sw.js` - Firebase service worker
- Service worker sẽ được tự động validate

## Integration Examples

### Vue 3 + Vite

```vue
<!-- App.vue -->
<script setup>
import { onMounted } from 'vue'
import { useFcm } from 'fcm-rslib'

const { token, requestPermission, onMessage } = useFcm()

onMounted(async () => {
  await requestPermission()
  
  onMessage((payload) => {
    console.log('Foreground message:', payload)
  })
})
</script>
```

### Vue 3 + Nuxt

```vue
<!-- plugins/fcm.client.ts -->
import { useFcm } from 'fcm-rslib'

export default defineNuxtPlugin(async () => {
  const { token, requestPermission, onMessage } = useFcm()
  
  await requestPermission()
  
  onMessage((payload) => {
    console.log('Foreground message:', payload)
  })
  
  return {
    provide: {
      fcm: { token, requestPermission, onMessage }
    }
  }
})
```

### React + Vite

```jsx
// App.jsx
import { useEffect } from 'react'
import { useFcm } from 'fcm-rslib'

function App() {
  const { token, requestPermission, onMessage } = useFcm()
  
  useEffect(() => {
    const initFcm = async () => {
      await requestPermission()
      
      onMessage((payload) => {
        console.log('Foreground message:', payload)
      })
    }
    
    initFcm()
  }, [])
  
  return <div>Your app</div>
}
```

## Troubleshooting

### Common Issues

1. **Permission denied**: Đảm bảo quyền ghi file trong thư mục dự án
2. **Service worker not found**: Kiểm tra đường dẫn output
3. **Firebase config error**: Đảm bảo cấu hình Firebase chính xác

### Debug Mode

```bash
DEBUG=1 npx fcm-rslib init-worker
```

## Support

- 📖 [Documentation](./scripts/README.md)
- 🐛 [Report Issues](https://github.com/your-repo/fcm-rslib/issues)
- 💬 [Discussions](https://github.com/your-repo/fcm-rslib/discussions) 