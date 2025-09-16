<script lang="ts" setup>
import { Avatar, Dropdown, Menu, TypographyText, TypographyTitle } from "ant-design-vue";
import { MoreOutlined } from "@ant-design/icons-vue";
import { colors } from "../../constants/color";
import type { FcmNotificationPayload, NotificationDataPayload } from "../../composables/useNotification/types";

interface NotificationItemProps {
  item: FcmNotificationPayload<NotificationDataPayload>;
}

defineProps<NotificationItemProps>();

const emit = defineEmits<{
  (e: "read", item: FcmNotificationPayload<NotificationDataPayload>): void;
  (e: "mark-read", item: FcmNotificationPayload<NotificationDataPayload>): void;
  (e: "remove", messageId: string): void;
}>();

function getTimeAgo(createdAt: string) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "Vừa xong";
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngày trước`;
}

function getColorFromName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
</script>

<template>
  <div class="notification-item" @click="emit('read', item)">
    <div class="notification-item-content">
      <div class="notification-item-content-avatar">
        <Avatar
          v-if="item.notification?.image"
          :src="item.notification?.image"
          :style="{ backgroundColor: getColorFromName(item.notification?.title || '') }"
        />
        <Avatar v-else :style="{ backgroundColor: getColorFromName(item.notification?.title || '') }">
          {{ item.notification?.title?.charAt(0) || "?" }}
        </Avatar>
      </div>
      <div class="notification-item-content-info">
        <TypographyTitle :level="5">{{ item.notification?.title }}</TypographyTitle>
        <TypographyText>{{ item.notification?.body }}</TypographyText>
      </div>
    </div>
    <div class="notification-item-action">
      <TypographyText>{{ getTimeAgo(item.createdAt) }}</TypographyText>
      <Dropdown :trigger="['click']" placement="bottomRight" class="notification-menu">
        <template #overlay>
          <Menu>
            <Menu.Item key="mark-read" :disabled="item.isRead" @click.stop="emit('mark-read', item)">
              <span>Đánh dấu đã đọc</span>
            </Menu.Item>
            <Menu.Item key="delete" @click.stop="emit('remove', item.messageId)">
              <span class="text-red-500">Xóa</span>
            </Menu.Item>
          </Menu>
        </template>
        <MoreOutlined
          :style="{
            cursor: 'pointer',
            color: '#666',
            fontSize: '16px',
            padding: '4px',
          }"
          @click.stop
        />
      </Dropdown>
    </div>
    <div v-if="!item.isRead" class="notification-item-unread" />
  </div>
</template>
