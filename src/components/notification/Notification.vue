<script setup lang="ts">
import { BellOutlined } from "@ant-design/icons-vue";
import {
  Badge,
  Button,
  Divider,
  List,
  Popover,
  TypographyText,
  TypographyTitle,
} from "ant-design-vue";
import { computed, onMounted, ref, watchEffect } from "vue";
import { useNotification } from "../../composables/useNotification";
import TrashIcon from "../icons/TrashIcon.vue";
import type { 
  NotificationProps, 
  NotificationEmits,
  BellSlotProps,
  HeaderSlotProps,
  ListSlotProps,
  EmptySlotProps,
  FooterSlotProps
} from "./types";

withDefaults(defineProps<NotificationProps>(), {
  title: "Notifications",
  emptyText: "No notifications",
  clearAllText: "Clear all",
  showClearAll: true,
  maxHeight: "400px",
  width: "300px",
});

const emit = defineEmits<NotificationEmits>();

const slots = defineSlots<{
  bell: (props: BellSlotProps) => any;
  header: (props: HeaderSlotProps) => any;
  list: (props: ListSlotProps) => any;
  empty: (props: EmptySlotProps) => any;
  footer: (props: FooterSlotProps) => any;
}>();

const {
  listNotification,
  countReadAllNotification,
  requestPermissionAndGetToken,
  initializeFCM,
  resetCountReadAllNotification,
  readNotification,
  removeNotification,
  clearAllNotification,
} = useNotification();

const isBellShaking = ref(false);

const sortedListNotification = computed(() => {
  return [...listNotification].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});

let previousLength = listNotification.length;

watchEffect(() => {
  const currentLength = listNotification.length;

  if (currentLength > previousLength) {
    shakeBell();
  }

  previousLength = currentLength;
});

function shakeBell() {
  isBellShaking.value = true;
  setTimeout(() => {
    isBellShaking.value = false;
  }, 500);
}

function getTimeAgo(createdAt: string) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMinutes = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
}

function handleBellClick() {
  resetCountReadAllNotification();
  emit("bell-click");
}

function handleNotificationRead(messageId: string) {
  readNotification(messageId);
  emit("notification-read", messageId);
}

function handleNotificationRemove(messageId: string) {
  removeNotification(messageId);
  emit("notification-remove", messageId);
}

function handleClearAll() {
  clearAllNotification();
  emit("clear-all");
}

onMounted(() => {
  requestPermissionAndGetToken();
  initializeFCM();
});
</script>

<template>
  <div class="notification-container">
    <Popover placement="bottomRight" trigger="click" :width="width">
      <!-- Bell slot with default fallback -->
      <template #default>
        <slot
          name="bell"
          :count="countReadAllNotification"
          :is-shaking="isBellShaking"
          :on-click="handleBellClick"
        >
          <Badge :count="countReadAllNotification" :overflow-count="9">
            <BellOutlined
              :class="{ 'bell-shake': isBellShaking }"
              :style="{ fontSize: '40px', cursor: 'pointer' }"
              @click="handleBellClick"
            />
          </Badge>
        </slot>
      </template>

      <template #content>
        <div class="notification-wrapper">
          <div class="notification-header">
            <slot name="header" :title="title">
              <TypographyTitle :level="4" class="notification-title">
                {{ title }}
              </TypographyTitle>
            </slot>
          </div>
          <Divider />
          <div class="notification-content" :style="{ maxHeight }">
            <!-- Notification list slot with default fallback -->
            <slot
              name="list"
              :notifications="sortedListNotification"
              :read-notification="handleNotificationRead"
              :remove-notification="handleNotificationRemove"
              :get-time-ago="getTimeAgo"
            >
              <List
                :dataSource="sortedListNotification"
                :locale="{ emptyText: emptyText }"
              >
                <template #renderItem="{ item }">
                  <div
                    class="notification-item"
                    @click="handleNotificationRead(item.messageId)"
                  >
                    <div class="notification-item-content">
                      <TypographyTitle :level="5">{{
                        item.notification.title
                      }}</TypographyTitle>
                      <TypographyText>{{
                        item.notification.body
                      }}</TypographyText>
                    </div>
                    <div class="notification-item-time">
                      <TypographyText>{{
                        getTimeAgo(item.createdAt)
                      }}</TypographyText>
                      <TrashIcon
                        :size="16"
                        className="trash-icon"
                        :style="{
                          cursor: 'pointer',
                          color: 'red',
                          display: 'none',
                          position: 'absolute',
                          right: '-24px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }"
                        @click.stop="handleNotificationRemove(item.messageId)"
                      />
                    </div>
                    <div v-if="!item.isRead" class="notification-item-unread" />
                  </div>
                </template>
              </List>
            </slot>
          </div>
          <div
            v-if="showClearAll && sortedListNotification.length > 0"
            class="notification-footer"
          >
            <slot
              name="footer"
              :clear-all="handleClearAll"
              :text="clearAllText"
            >
              <Button type="link" @click.stop="handleClearAll">
                {{ clearAllText }}
              </Button>
            </slot>
          </div>
        </div>
      </template>
    </Popover>
  </div>
</template>

<style scoped>
.notification-header {
  padding: 16px;
}

.notification-content {
  width: 500px;
  overflow-y: auto;
}

.notification-empty {
  padding: 32px;
  text-align: center;
  color: #999;
}

.notification-item-unread {
  width: 10px;
  height: 10px;
  background-color: green;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.notification-item {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  position: relative;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;

    .trash-icon {
      display: block !important;
    }
  }
}

.notification-item-content {
  padding-left: 32px;
}

.notification-item-time {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-right: 24px;

  &:hover {
    .trash-icon {
      display: block !important;
    }
  }
}

.notification-title {
  margin: 0 !important;
}

.ant-popover-inner {
  padding: 0 !important;
}

.ant-divider {
  margin: 0;
}

.notification-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
}

.notification-content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
  border-radius: 10px;
}

.notification-content::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

.notification-content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #fff;
  background-image: -webkit-gradient(
    linear,
    40% 0%,
    75% 84%,
    from(#4d9c41),
    to(#19911d),
    color-stop(0.6, #54de5d)
  );
}

@keyframes bellShake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: rotate(-5deg);
  }
  20%,
  40%,
  60%,
  80% {
    transform: rotate(5deg);
  }
}

.bell-shake {
  animation: bellShake 0.5s ease-in-out;
  transform-origin: top center;
}
</style>
