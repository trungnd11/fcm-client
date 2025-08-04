# Notification Component Slots Usage

The `Notification` component now supports slots for maximum customization flexibility.

## Available Slots

### 1. `bell` Slot

Customize the bell icon and badge.

**Props:**

- `count`: Number of unread notifications
- `isShaking`: Boolean indicating if bell is shaking
- `onClick`: Function to reset notification count

**Default:** Ant Design Badge with BellOutlined icon

```vue
<template>
  <Notification>
    <template #bell="{ count, isShaking, onClick }">
      <!-- Custom bell implementation -->
      <div
        :class="{ 'custom-bell-shake': isShaking }"
        @click="onClick"
        class="custom-bell"
      >
        <span class="notification-count">{{ count }}</span>
        🔔
      </div>
    </template>
  </Notification>
</template>
```

### 2. `header` Slot

Customize the notification header.

**Props:**

- `title`: Header title text

**Default:** TypographyTitle with "Notifications"

```vue
<template>
  <Notification>
    <template #header="{ title }">
      <div class="custom-header">
        <h3>{{ title }}</h3>
        <span class="notification-subtitle">Your messages</span>
      </div>
    </template>
  </Notification>
</template>
```

### 3. `list` Slot

Customize the entire notification list.

**Props:**

- `notifications`: Array of sorted notifications
- `readNotification`: Function to mark notification as read
- `removeNotification`: Function to remove notification
- `getTimeAgo`: Function to format time

**Default:** Ant Design List with default styling

```vue
<template>
  <Notification>
    <template
      #list="{
        notifications,
        readNotification,
        removeNotification,
        getTimeAgo,
      }"
    >
      <div class="custom-notification-list">
        <div
          v-for="notification in notifications"
          :key="notification.messageId"
          class="custom-notification-item"
          @click="readNotification(notification.messageId)"
        >
          <div class="notification-content">
            <h4>{{ notification.notification.title }}</h4>
            <p>{{ notification.notification.body }}</p>
            <small>{{ getTimeAgo(notification.createdAt) }}</small>
          </div>
          <button @click.stop="removeNotification(notification.messageId)">
            🗑️
          </button>
          <div v-if="!notification.isRead" class="unread-indicator"></div>
        </div>
      </div>
    </template>
  </Notification>
</template>
```

### 4. `empty` Slot

Customize the empty state when no notifications exist.

**Props:**

- `text`: Empty state text

**Default:** Centered text with "No notifications"

```vue
<template>
  <Notification>
    <template #empty="{ text }">
      <div class="custom-empty-state">
        <div class="empty-icon">📭</div>
        <p>{{ text }}</p>
        <small>Check back later for updates</small>
      </div>
    </template>
  </Notification>
</template>
```

### 5. `footer` Slot

Customize the footer with clear all button.

**Props:**

- `clearAll`: Function to clear all notifications
- `text`: Clear all button text

**Default:** Link button with "Clear all"

```vue
<template>
  <Notification>
    <template #footer="{ clearAll, text }">
      <div class="custom-footer">
        <button @click="clearAll" class="clear-all-btn">
          {{ text }}
        </button>
        <span class="footer-info">Click to clear all notifications</span>
      </div>
    </template>
  </Notification>
</template>
```

## Component Props

You can also customize the component using props:

```vue
<template>
  <Notification
    title="My Notifications"
    empty-text="No messages yet"
    clear-all-text="Clear All Messages"
    :show-clear-all="true"
    max-height="500px"
    width="400px"
  />
</template>
```

## Complete Example

```vue
<template>
  <Notification
    title="Messages"
    empty-text="No messages"
    clear-all-text="Clear all messages"
    :show-clear-all="true"
    max-height="600px"
    width="350px"
  >
    <!-- Custom bell -->
    <template #bell="{ count, isShaking, onClick }">
      <div
        :class="{ 'bell-animation': isShaking }"
        @click="onClick"
        class="custom-bell"
      >
        <span class="badge" v-if="count > 0">{{ count }}</span>
        <i class="fas fa-bell"></i>
      </div>
    </template>

    <!-- Custom header -->
    <template #header="{ title }">
      <div class="custom-header">
        <h3>{{ title }}</h3>
        <div class="header-actions">
          <button>Settings</button>
        </div>
      </div>
    </template>

    <!-- Custom list -->
    <template
      #list="{
        notifications,
        readNotification,
        removeNotification,
        getTimeAgo,
      }"
    >
      <div class="custom-list">
        <div
          v-for="notification in notifications"
          :key="notification.messageId"
          class="custom-item"
          @click="readNotification(notification.messageId)"
        >
          <div class="item-content">
            <h4>{{ notification.notification.title }}</h4>
            <p>{{ notification.notification.body }}</p>
            <time>{{ getTimeAgo(notification.createdAt) }}</time>
          </div>
          <button
            @click.stop="removeNotification(notification.messageId)"
            class="remove-btn"
          >
            ×
          </button>
          <div v-if="!notification.isRead" class="unread-dot"></div>
        </div>
      </div>
    </template>

    <!-- Custom empty state -->
    <template #empty="{ text }">
      <div class="custom-empty">
        <div class="empty-icon">📬</div>
        <p>{{ text }}</p>
      </div>
    </template>

    <!-- Custom footer -->
    <template #footer="{ clearAll, text }">
      <div class="custom-footer">
        <button @click="clearAll" class="clear-btn">
          {{ text }}
        </button>
      </div>
    </template>
  </Notification>
</template>

<style scoped>
.custom-bell {
  position: relative;
  cursor: pointer;
  font-size: 24px;
  padding: 8px;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.bell-animation {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.custom-list {
  max-height: 400px;
  overflow-y: auto;
}

.custom-item {
  padding: 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
}

.custom-item:hover {
  background-color: #f5f5f5;
}

.item-content {
  flex: 1;
}

.item-content h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.item-content p {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #666;
}

.item-content time {
  font-size: 11px;
  color: #999;
}

.remove-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #1890ff;
  border-radius: 50%;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.custom-empty {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.custom-footer {
  padding: 16px;
  text-align: center;
}

.clear-btn {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.clear-btn:hover {
  background: #ff7875;
}
</style>
```

## Benefits of Using Slots

1. **Maximum Flexibility**: Customize any part of the component
2. **Consistent API**: All slots provide the same data and functions
3. **Default Fallbacks**: Component works out of the box without slots
4. **Type Safety**: All slot props are properly typed
5. **Easy Migration**: Existing usage continues to work
