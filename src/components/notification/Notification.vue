<script setup lang="ts">
import { BellOutlined, MoreOutlined } from "@ant-design/icons-vue";
import {
  Badge,
  Divider,
  Dropdown,
  List,
  Menu,
  Pagination,
  Popover,
  TypographyText,
  TypographyTitle,
} from "ant-design-vue";
import { computed, onMounted, ref, watch } from "vue";
import NotificationHeader from "./NotificationHeader.vue";
import { FcmNotificationPayload, useNotification } from "../../composables/useNotification/useNotification";
import useGetAllNotification from "../../composables/useGetAllNotification/useGetAllNotification";
import type {
  NotificationProps,
  NotificationEmits,
  BellSlotProps,
  HeaderSlotProps,
  ListSlotProps,
  EmptySlotProps,
  HeaderActionSlotProps,
  PaginationSlotProps,
} from "./types";
import { PartnerCodeEnum } from "../../enums/PartnerCodeEnum";
import { LanguageCodeEnum } from "../../enums/LanguageCodeEnum";
import { ProjectCodeEnum } from "../../enums/ProjectCodeEnum";
import { NotificationDataPayload } from "../../composables/useNotification/types";

withDefaults(defineProps<NotificationProps>(), {
  title: "Thông báo",
  emptyText: "Không có thông báo",
  clearAllText: "Xóa tất cả",
  markAllAsReadText: "Đánh dấu tất cả đã đọc",
  showClearAll: true,
  showMarkAllAsRead: true,
  maxHeight: "500px",
  width: "300px",
  pageSize: 5,
  showPagination: true,
});

const emit = defineEmits<NotificationEmits>();

defineSlots<{
  bell: (props: BellSlotProps) => any;
  header: (props: HeaderSlotProps) => any;
  list: (props: ListSlotProps) => any;
  empty: (props: EmptySlotProps) => any;
  headerAction: (props: HeaderActionSlotProps) => any;
  pagination: (props: PaginationSlotProps) => any;
}>();

const {
  listNotification,
  countReadAllNotification,
  requestPermissionAndGetToken,
  initializeFCM,
  resetCountReadAllNotification,
  markAsReadNotification,
  markAllAsReadNotification,
  removeNotification,
  clearAllNotification,
} = useNotification();

const {
  isGetAllLoading,
  paginatedNotifications,
  setNotificationRequest,
  fetchAllNotification,
  fetchPaginatedNotifications,
} = useGetAllNotification();

const isBellShaking = ref(false);
const currentPage = ref(1);

const sortedListNotification = computed(() => {
  return [...listNotification].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});

watch(countReadAllNotification, (newCountReadAllNotification, oldCountReadAllNotification) => {
  if (newCountReadAllNotification > oldCountReadAllNotification) {
    shakeBell();
  }
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
  const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "Vừa xong";
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngày trước`;
}

function handleBellClick() {
  resetCountReadAllNotification();
  currentPage.value = 1;
  setNotificationRequest({
    PartnerCode: PartnerCodeEnum.MY_F88,
    ProjectCode: ProjectCodeEnum.MY_F88_SYSTEM,
    Language: LanguageCodeEnum.VI,
    PageNumber: currentPage.value,
    PageSize: 5,
  });
  fetchAllNotification();
  fetchPaginatedNotifications();
  emit("bell-click");
}

function handleNotificationRead(item: FcmNotificationPayload<NotificationDataPayload>, action: "read" | "mark-read") {
  if (!item.messageId) return;

  if (item.data?.Link && action === "read") {
    window.open(item.data.Link, "_blank");
  }

  markAsReadNotification(item.messageId);
  emit("notification-read", item.messageId);
}

function handleNotificationRemove(messageId: string) {
  removeNotification(messageId);
  emit("notification-remove", messageId);
}

function handleClearAll() {
  clearAllNotification();
  emit("clear-all");
}

function handleMarkAllAsRead() {
  markAllAsReadNotification();
  emit("mark-all-read");
}

function handlePageChange(page: number, size: number) {
  currentPage.value = page;
  setNotificationRequest({
    PartnerCode: PartnerCodeEnum.MY_F88,
    ProjectCode: ProjectCodeEnum.MY_F88_SYSTEM,
    Language: LanguageCodeEnum.VI,
    PageNumber: page,
    PageSize: size,
  });
  fetchAllNotification();
  fetchPaginatedNotifications();
  emit("page-change", page, size);
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
        <slot name="bell" :count="countReadAllNotification" :is-shaking="isBellShaking" :on-click="handleBellClick">
          <Badge :count="countReadAllNotification" :overflow-count="9">
            <BellOutlined
              :class="{ 'bell-shake': isBellShaking }"
              :style="{ fontSize: '24px', cursor: 'pointer' }"
              @click="handleBellClick"
            />
          </Badge>
        </slot>
      </template>

      <template #content>
        <div class="notification-wrapper">
          <slot name="header" :title="title">
            <NotificationHeader
              :title="title"
              :clear-all-text="clearAllText"
              :mark-all-as-read-text="markAllAsReadText"
              :sorted-list-notification="sortedListNotification"
              @clear-all="handleClearAll"
              @mark-all-as-read="handleMarkAllAsRead"
            />
          </slot>
          <Divider />
          <div class="notification-content" :style="{ maxHeight }">
            <!-- Notification list slot with default fallback -->
            <slot
              name="list"
              :notifications="listNotification"
              :read-notification="handleNotificationRead"
              :remove-notification="handleNotificationRemove"
              :get-time-ago="getTimeAgo"
            >
              <List :loading="isGetAllLoading" :dataSource="listNotification" :locale="{ emptyText: emptyText }">
                <template #renderItem="{ item }">
                  <div class="notification-item" @click="handleNotificationRead(item, 'read')">
                    <div class="notification-item-content">
                      <TypographyTitle :level="5">{{ item.notification.title }}</TypographyTitle>
                      <TypographyText>{{ item.notification.body }}</TypographyText>
                    </div>
                    <div class="notification-item-action">
                      <TypographyText>{{ getTimeAgo(item.createdAt) }}</TypographyText>
                      <Dropdown :trigger="['click']" placement="bottomRight" class="notification-menu" @click.stop>
                        <template #overlay>
                          <Menu>
                            <Menu.Item
                              key="mark-read"
                              :disabled="item.isRead"
                              @click.stop="handleNotificationRead(item, 'mark-read')"
                            >
                              <span>Đánh dấu đã đọc</span>
                            </Menu.Item>
                            <Menu.Item key="delete" @click.stop="handleNotificationRemove(item.messageId)">
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
              </List>
            </slot>

            <Divider v-if="showMarkAllAsRead || showClearAll" />
            <div v-if="sortedListNotification.length > 0" class="notification-footer">
              <!-- Pagination -->
              <slot
                name="pagination"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="paginatedNotifications?.TotalRecords"
                :on-change="handlePageChange"
              >
                <div v-if="showPagination" class="notification-pagination">
                  <Pagination
                    v-model:current="currentPage"
                    size="small"
                    show-less-items
                    :page-size="pageSize"
                    :total="paginatedNotifications?.TotalRecords"
                    @change="handlePageChange"
                  />
                </div>
              </slot>
            </div>
          </div>
        </div>
      </template>
    </Popover>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.notification-header {
  @apply flex justify-between items-center p-4;
}

.notification-header-action {
  @apply cursor-pointer;

  &:hover {
    @apply text-gray-500;
  }
}

.header-action-buttons {
  @apply flex flex-col gap-2;
}

.notification-content {
  @apply w-[500px] overflow-y-auto;
}

.notification-empty {
  @apply p-8 text-center text-gray-500;
}

.notification-item-unread {
  @apply w-2 h-2 bg-green-600 rounded-full absolute top-1/2 transform -translate-y-1/2;
}

.notification-item {
  @apply p-2 pl-4 flex justify-between gap-4 relative cursor-pointer;

  &:hover {
    @apply bg-gray-100;
  }
}

.notification-item-content {
  @apply pl-6;
}

.notification-item-action {
  @apply relative flex items-center gap-4;
}

.notification-menu {
  @apply opacity-100;
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
  @apply flex items-center justify-center p-4;
}

.footer-buttons {
  @apply flex justify-end gap-4;
}

.footer-buttons > .ant-btn {
  @apply !p-0;
}

.notification-pagination {
  @apply flex justify-end;
}

.notification-pagination > .ant-pagination.ant-pagination-mini {
  @apply flex items-center justify-center gap-1;
}

.notification-pagination > .ant-pagination.ant-pagination-mini > li > button.ant-pagination-item-link {
  @apply flex items-center justify-center;
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
  background-image: linear-gradient(40deg, #4d9c41 0%, #54de5d 60%, #19911d 100%);
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
