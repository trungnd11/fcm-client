import { ListProps } from "ant-design-vue";
import type {
  FcmNotificationPayload,
  NotificationDataPayload,
  UseNotificationProps,
} from "../../composables/useNotification/types";

// Slot types for Notification component
export interface BellSlotProps {
  count: number;
  isShaking: boolean;
  onClick: () => void;
}

export interface HeaderSlotProps {
  title: string;
}

export interface ListSlotProps {
  notifications: FcmNotificationPayload[];
  readNotification: (item: FcmNotificationPayload<NotificationDataPayload>, action: "read" | "mark-read") => void;
  removeNotification: (messageId: string) => void;
  getTimeAgo?: (createdAt: string) => string;
}

export interface EmptySlotProps {
  text: string;
}

export interface HeaderActionSlotProps {
  clearAll: () => void;
  markAllAsRead: () => void;
  clearAllText: string;
  markAllAsReadText: string;
}

export interface PaginationSlotProps {
  currentPage?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
}

// Props interface for Notification component
export interface NotificationProps {
  title?: string;
  emptyText?: string;
  clearAllText?: string;
  markAllAsReadText?: string;
  showClearAll?: boolean;
  showMarkAllAsRead?: boolean;
  maxHeight?: string;
  width?: string;
  listProps?: ListProps;
  pageSize?: number;
  showPagination?: boolean;
  useNotificationProps?: UseNotificationProps;
}

// Emits interface for Notification component
export interface NotificationEmits {
  (e: "bell-click"): void;
  (e: "notification-read", messageId: string): void;
  (e: "notification-remove", messageId: string): void;
  (e: "clear-all"): void;
  (e: "mark-all-read"): void;
  (e: "page-change", page: number, pageSize: number): void;
}
