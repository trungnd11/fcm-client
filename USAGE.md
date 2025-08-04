# FCM RSLib Usage Guide

## Installation

```bash
npm install fcm-rslib
# hoặc
pnpm add fcm-rslib
```

## Setup

### 1. Import CSS

```javascript
import "fcm-rslib/dist/index.css";
```

### 2. Cách sử dụng với Ant Design Vue

#### Option A: Sử dụng Plugin (Khuyến nghị)

```javascript
import { createApp } from "vue";
import { FcmPlugin } from "fcm-rslib";
import App from "./App.vue";

const app = createApp(App);
app.use(FcmPlugin);
app.mount("#app");
```

#### Option B: Sử dụng Provider Component

```vue
<template>
  <div>
    <NotificationProvider />
  </div>
</template>

<script setup>
import { NotificationProvider } from "fcm-rslib";
</script>
```

#### Option C: Sử dụng trực tiếp (Cần Ant Design Vue đã được setup)

```vue
<template>
  <div>
    <Notification />
  </div>
</template>

<script setup>
import { Notification } from "fcm-rslib";
</script>
```

### 3. Sử dụng Hook

```vue
<script setup>
import { useNotification } from "fcm-rslib";

const { listNotification, initializeFCM } = useNotification();

onMounted(() => {
  initializeFCM();
});
</script>
```

## Troubleshooting

### Lỗi Ant Design Components

Nếu gặp lỗi với Ant Design components, hãy đảm bảo:

1. **Sử dụng Plugin**: `app.use(FcmPlugin)`
2. **Hoặc sử dụng Provider**: `<NotificationProvider />`
3. **Hoặc setup Ant Design Vue trước**: `app.use(Antd)`

### Lỗi CSS

Đảm bảo đã import CSS:

```javascript
import "fcm-rslib/dist/index.css";
```
