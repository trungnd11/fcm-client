# FCM Service Worker Manager

Script quản lý Firebase Cloud Messaging Service Worker cho dự án Vue 3.

## Tính năng

- ✅ Tạo service worker tự động với cấu hình Firebase
- ✅ Validate service worker hiện có
- ✅ Quản lý cấu hình Firebase
- ✅ Hỗ trợ custom config file
- ✅ Tích hợp với npm scripts
- ✅ CLI command `fcm-rslib` để dễ dàng sử dụng

## Cách sử dụng

### 1. Sử dụng CLI command (Khuyến nghị)

```bash
# Khởi tạo FCM service worker (generate + validate)
fcm-rslib init-worker

# Tạo service worker với cấu hình mặc định
fcm-rslib generate

# Validate service worker hiện có
fcm-rslib validate

# Tạo/cập nhật file cấu hình Firebase
fcm-rslib config

# Hiển thị help
fcm-rslib help
```

### 2. Sử dụng pnpm scripts

```bash
# Khởi tạo FCM service worker
pnpm run fcm:init

# Tạo service worker với cấu hình mặc định
pnpm run fcm:generate

# Validate service worker hiện có
pnpm run fcm:validate

# Tạo/cập nhật file cấu hình Firebase
pnpm run fcm:config
```

### 3. Sử dụng trực tiếp script

```bash
# Hiển thị help
node scripts/fcm-worker.js help

# Tạo service worker
node scripts/fcm-worker.js generate

# Tạo service worker với output path tùy chỉnh
node scripts/fcm-worker.js generate --output ./public/sw.js

# Validate service worker
node scripts/fcm-worker.js validate

# Validate service worker với path tùy chỉnh
node scripts/fcm-worker.js validate --output ./public/sw.js

# Tạo file cấu hình Firebase
node scripts/fcm-worker.js update-config

# Sử dụng file cấu hình tùy chỉnh
node scripts/fcm-worker.js update-config --config ./my-firebase-config.json
```

## Cấu hình Firebase

### Cấu hình mặc định

Script sử dụng cấu hình Firebase mặc định từ dự án hiện tại:

```json
{
  "apiKey": "AIzaSyANUdxcxppINSZkayH4nGn4t-lOTg3B7N4",
  "authDomain": "my-landing-page-e7c7e.firebaseapp.com",
  "projectId": "my-landing-page-e7c7e",
  "storageBucket": "my-landing-page-e7c7e.firebasestorage.app",
  "messagingSenderId": "999813447171",
  "appId": "1:999813447171:web:4d47bb99b3fa66909a9836",
  "measurementId": "G-43J14KHN0W"
}
```

### Sử dụng cấu hình tùy chỉnh

1. Tạo file JSON với cấu hình Firebase của bạn:

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

2. Sử dụng với script:

```bash
node scripts/fcm-worker.js generate --config ./my-config.json
```

## Service Worker Features

Service worker được tạo ra bao gồm:

- 🔥 Firebase App và Messaging initialization
- 📱 Background message handling
- 🔔 Push notification display
- 📡 BroadcastChannel communication
- 🔄 Fallback postMessage communication
- 📝 Comprehensive logging

## File Output

Service worker được tạo tại: `./public/firebase-messaging-sw.js`

## Validation

Script validate kiểm tra các thành phần cần thiết:

- ✅ Firebase App Import
- ✅ Firebase Messaging Import  
- ✅ Firebase Initialize
- ✅ Messaging Instance
- ✅ Background Message Handler
- ✅ Show Notification

## Troubleshooting

### Lỗi thường gặp

1. **Config file not found**: Đảm bảo đường dẫn file config chính xác
2. **Service worker not found**: Kiểm tra đường dẫn output
3. **Permission denied**: Đảm bảo quyền ghi file

### Debug

Thêm logging chi tiết:

```bash
DEBUG=1 node scripts/fcm-worker.js generate
```

## Tích hợp với CI/CD

Thêm vào pipeline build:

```yaml
# .github/workflows/deploy.yml
- name: Generate FCM Service Worker
  run: npm run fcm:generate

- name: Validate FCM Service Worker  
  run: npm run fcm:validate
``` 