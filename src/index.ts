import "ant-design-vue/dist/reset.css";
import "./style.css";
import { useNotification } from "./composables/useNotification";
import Notification from "./components/notification/Notification.vue";
import {
  initializeConfig,
  setConfig,
  getConfig,
  loadConfigFromFile,
  type FCMConfig,
} from "./config";
import type {
  BellSlotProps,
  HeaderSlotProps,
  ListSlotProps,
  EmptySlotProps,
  FooterSlotProps,
  NotificationProps,
  NotificationEmits,
} from "./components/notification/types";

export {
  useNotification,
  Notification,
  initializeConfig,
  setConfig,
  getConfig,
  loadConfigFromFile,
};
export type {
  FCMConfig,
  BellSlotProps,
  HeaderSlotProps,
  ListSlotProps,
  EmptySlotProps,
  FooterSlotProps,
  NotificationProps,
  NotificationEmits,
};
