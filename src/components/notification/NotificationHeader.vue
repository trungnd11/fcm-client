<script setup lang="ts">
import { computed } from "vue";
import { Dropdown, Menu, TypographyTitle } from "ant-design-vue";
import { LoadingOutlined, SettingOutlined } from "@ant-design/icons-vue";
import useDeleteAllNotification from "../../composables/useDeleteAllNotification/useDeleteAllNotification";
import { isEmptyArray } from "../../utils/arrayUtil";
import { FcmNotificationPayload, NotificationDataPayload } from "../../composables/useNotification/types";

export interface NotificationHeaderProps {
  title: string;
  clearAllText: string;
  markAllAsReadText: string;
  sortedListNotification: FcmNotificationPayload<NotificationDataPayload>[];
}

const props = defineProps<NotificationHeaderProps>();

const emit = defineEmits<{
  (e: "clear-all"): void;
  (e: "mark-all-as-read"): void;
}>();

const { isLoading: isLoadingDeleteAllNotification } = useDeleteAllNotification();

const disabledMarkAllAsRead = computed(() => {
  return props.sortedListNotification.every((n) => n.isRead) || isEmptyArray(props.sortedListNotification);
});

const disabledClearAll = computed(() => {
  return isEmptyArray(props.sortedListNotification) || isLoadingDeleteAllNotification.value;
});

function handleClearAll() {
  emit("clear-all");
}

function handleMarkAllAsRead() {
  emit("mark-all-as-read");
}
</script>

<template>
  <div class="notification-header">
    <slot name="header" :title="title">
      <TypographyTitle :level="4" class="notification-title">
        {{ title }}
      </TypographyTitle>
    </slot>
    <div class="notification-header-action">
      <Dropdown :trigger="['hover']" placement="bottomRight" @click.stop>
        <template #overlay>
          <div class="header-action-buttons">
            <Menu>
              <Menu.Item key="mark-read" :disabled="disabledMarkAllAsRead" @click.stop="handleMarkAllAsRead">
                <span>{{ markAllAsReadText }}</span>
              </Menu.Item>
              <Menu.Item key="delete" :disabled="disabledClearAll" @click.stop="handleClearAll">
                <span :class="{ 'text-red-500': !disabledClearAll }">{{ clearAllText }}</span>
                <template #icon>
                  <LoadingOutlined v-if="isLoadingDeleteAllNotification" />
                </template>
              </Menu.Item>
            </Menu>
          </div>
        </template>

        <SettingOutlined class="cursor-pointer text-gray-500 text-base" />
      </Dropdown>
    </div>
  </div>
</template>
