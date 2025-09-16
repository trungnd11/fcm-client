<script setup lang="ts">
import { BellOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { Badge, Divider, List, Pagination, Popover } from "ant-design-vue";
import { computed, onMounted, ref, watch } from "vue";
import NotificationHeader from "./NotificationHeader.vue";
import NotificationItem from "./NotificationItem.vue";
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

const DEFAULT_PAGE_SIZE = 10;

withDefaults(defineProps<NotificationProps>(), {
  title: "Thông báo",
  emptyText: "Không có thông báo",
  clearAllText: "Xóa tất cả",
  markAllAsReadText: "Đánh dấu tất cả đã đọc",
  showClearAll: true,
  showMarkAllAsRead: true,
  maxHeight: "500px",
  width: "300px",
  pageSize: DEFAULT_PAGE_SIZE,
  showPagination: false,
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
const isLoadingMore = ref(false);
const loadMoreTrigger = ref<HTMLDivElement | null>(null);

const sortedListNotification = computed(() => {
  return [...listNotification].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});

const totalPages = computed(() => {
  if (!paginatedNotifications?.value?.TotalRecords) return Infinity;
  return Math.ceil(paginatedNotifications.value.TotalRecords / 10);
});

watch(countReadAllNotification, (newCountReadAllNotification, oldCountReadAllNotification) => {
  if (newCountReadAllNotification > oldCountReadAllNotification) {
    shakeBell();
  }
});

watch(loadMoreTrigger, (el) => {
  if (el) {
    console.log("load more trigger ready");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        handlePageChange(currentPage.value + 1, DEFAULT_PAGE_SIZE);
      }
    });
    observer.observe(el);
  }
});

function shakeBell() {
  isBellShaking.value = true;
  setTimeout(() => {
    isBellShaking.value = false;
  }, 500);
}

function handleBellClick() {
  resetCountReadAllNotification();
  if (currentPage.value >= totalPages.value) {
    emit("bell-click");
    return;
  }
  setNotificationRequest({
    PartnerCode: PartnerCodeEnum.MY_F88,
    ProjectCode: ProjectCodeEnum.MY_F88_SYSTEM,
    Language: LanguageCodeEnum.VI,
    PageNumber: currentPage.value,
    PageSize: DEFAULT_PAGE_SIZE,
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

async function handlePageChange(page: number, size: number) {
  if (isLoadingMore.value) return;
  if (page > totalPages.value) return;

  isLoadingMore.value = true;
  currentPage.value = page;
  setNotificationRequest({
    PartnerCode: PartnerCodeEnum.MY_F88,
    ProjectCode: ProjectCodeEnum.MY_F88_SYSTEM,
    Language: LanguageCodeEnum.VI,
    PageNumber: page,
    PageSize: size,
  });
  await fetchAllNotification();
  await fetchPaginatedNotifications();
  isLoadingMore.value = false;

  emit("page-change", page, size);
}

onMounted(async () => {
  requestPermissionAndGetToken();
  initializeFCM();
});
</script>

<template>
  <div class="notification-container">
    <Popover placement="bottomRight" trigger="click">
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
            >
              <List
                :loading="!isLoadingMore && isGetAllLoading"
                :dataSource="listNotification"
                :locale="{ emptyText: emptyText }"
              >
                <template #renderItem="{ item }">
                  <NotificationItem
                    :item="item"
                    @read="() => handleNotificationRead(item, 'read')"
                    @mark-read="() => handleNotificationRead(item, 'mark-read')"
                    @remove="handleNotificationRemove"
                  />
                </template>
              </List>
            </slot>
            <!-- loadMore trigger -->
            <div
              v-show="!isGetAllLoading && currentPage < totalPages"
              ref="loadMoreTrigger"
              class="notification-loading flex justify-center py-2"
            />
            <div v-if="isLoadingMore" class="flex justify-center items-center gap-2 text-gray-500 py-4">
              <LoadingOutlined spin />
              <span>Đang tải thêm...</span>
            </div>
          </div>

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
  @apply w-1.5 h-1.5 bg-green-600 rounded-full absolute top-1/2 transform -translate-y-1/2;
}

.notification-item {
  @apply p-2 flex justify-between gap-4 relative cursor-pointer;
  &:hover {
    @apply bg-gray-100;
  }
}

.notification-item-content {
  @apply pl-4 flex items-center gap-4;
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
  @apply flex items-center justify-center px-4 py-2;
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
