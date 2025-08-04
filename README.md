# fcm-rslib

A Vue 3 library for Firebase Cloud Messaging integration with CLI tools.

## Quick Start

### 1. Install

```bash
pnpm install
```

### 2. Setup CLI (Development)

```bash
# Setup CLI locally for development
pnpm run fcm:setup

# This will link the package globally so you can use:
fcm-rslib init-worker
```

### 3. Initialize FCM Service Worker

```bash
# Using CLI (recommended)
fcm-rslib init-worker

# Or using pnpm script
pnpm run fcm:init
```

This will automatically:

- ✅ Generate Firebase service worker
- ✅ Copy to `./public/firebase-messaging-sw.js`
- ✅ Validate the generated service worker
- ✅ Show next steps

### 3. Use in your Vue app

```vue
<script setup>
import { useFcm } from "fcm-rslib";

const { token, permission, requestPermission, onMessage } = useFcm();

// Request notification permission
await requestPermission();

// Listen to foreground messages
onMessage((payload) => {
  console.log("Received message:", payload);
});
</script>
```

## CLI Commands

```bash
# Initialize FCM service worker
fcm-rslib init-worker

# Generate service worker
fcm-rslib generate

# Validate service worker
fcm-rslib validate

# Update Firebase config
fcm-rslib config

# Show help
fcm-rslib help
```

## Development

Build the library:

```bash
pnpm build
```

Build the library in watch mode:

```bash
pnpm dev
```

## Documentation

- 📖 [Development Guide](./scripts/README.md) - For contributors
- 📚 [Usage Guide](./USAGE.md) - For users installing as dependency
