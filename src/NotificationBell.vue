<template>
  <div class="notification-bell">
    <a-badge :count="notificationCount" :dot="false" :offset="[0, 0]">
      <a-button
        type="text"
        shape="circle"
        size="large"
        @click="showNotifications"
        class="bell-button"
      >
        <template #icon>
          <BellOutlined />
        </template>
      </a-button>
    </a-badge>

    <a-drawer
      v-model:open="drawerVisible"
      title="Thông báo"
      placement="right"
      width="400"
      :closable="true"
      @close="closeDrawer"
    >
      <div class="notification-list">
        <div v-if="listNotification.length === 0" class="empty-state">
          <a-empty description="Không có thông báo nào" />
        </div>
        
        <div v-else class="notifications">
          <div
            v-for="(notification, index) in listNotification"
            :key="notification.messageId || index"
            class="notification-item"
            @click="markAsRead(index)"
          >
            <div class="notification-content">
              <div class="notification-title">
                {{ notification.notification?.title || 'Thông báo mới' }}
              </div>
              <div class="notification-body">
                {{ notification.notification?.body || 'Nội dung thông báo' }}
              </div>
              <div class="notification-meta">
                <span class="notification-time">
                  {{ formatTime(notification.messageId) }}
                </span>
                <span class="notification-from">
                  {{ notification.from }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="listNotification.length > 0" class="notification-actions">
          <a-button type="link" @click="clearAllNotifications">
            Xóa tất cả
          </a-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { BellOutlined } from '@ant-design/icons-vue';
import { useFcm } from './useFcm';

interface Props {
  maxCount?: number;
  showBadge?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  maxCount: 99,
  showBadge: true,
});

const { listNotification, requestPermissionAndGetToken, listenToForegroundMessages } = useFcm();

const drawerVisible = ref(false);

// Computed properties
const notificationCount = computed(() => {
  if (!props.showBadge) return 0;
  return Math.min(listNotification.length, props.maxCount);
});

// Methods
const showNotifications = () => {
  drawerVisible.value = true;
};

const closeDrawer = () => {
  drawerVisible.value = false;
};

const markAsRead = (index: number) => {
  // Có thể thêm logic đánh dấu đã đọc ở đây
  console.log('Marked as read:', index);
};

const clearAllNotifications = () => {
  // Xóa tất cả thông báo
  listNotification.splice(0, listNotification.length);
};

const formatTime = (messageId: string) => {
  // Sử dụng messageId để tạo timestamp (có thể thay đổi logic này)
  const timestamp = new Date().getTime();
  // Có thể sử dụng messageId để tạo unique timestamp
  const uniqueTimestamp = timestamp + messageId.length;
  const date = new Date(uniqueTimestamp);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Auto start FCM when component is mounted
const initFCM = async () => {
  try {
    await requestPermissionAndGetToken();
    listenToForegroundMessages();
  } catch (error) {
    console.error('Failed to initialize FCM:', error);
  }
};

// Initialize FCM
initFCM();
</script>

<style scoped>
.notification-bell {
  display: inline-block;
}

.bell-button {
  color: #666;
  transition: color 0.3s;
}

.bell-button:hover {
  color: #1890ff;
}

.notification-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notifications {
  flex: 1;
  overflow-y: auto;
}

.notification-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.notification-item:hover {
  background-color: #f5f5f5;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-content {
  padding: 0 8px;
}

.notification-title {
  font-weight: 500;
  color: #262626;
  margin-bottom: 4px;
  line-height: 1.4;
}

.notification-body {
  color: #595959;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
}

.notification-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #8c8c8c;
}

.notification-time {
  font-weight: 500;
}

.notification-from {
  opacity: 0.8;
}

.notification-actions {
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}
</style> 