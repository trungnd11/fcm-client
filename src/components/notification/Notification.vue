<script setup lang="ts">
import { onMounted, watch, computed } from 'vue';
import { Popover, List, Badge, TypographyText, TypographyTitle, Divider, Button } from 'ant-design-vue';
import { BellOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { useNotification } from '../../useNotification';

const { listNotification, initializeFCM, countReadAllNotification, resetCountReadAllNotification, readNotification, removeNotification, clearAllNotification } = useNotification();

const sortedListNotification = computed(() => {
  return listNotification.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});

watch(listNotification, (newVal) => {
  console.log(newVal);
});

function getTimeAgo(createdAt: string) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Vừa xong';
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngày trước`;
};

onMounted(() => {
  initializeFCM();
});
</script>

<template>
  <div class="notification-container">
    <Popover placement="bottomRight" trigger="click" :width="300">
      <Badge :count="countReadAllNotification" :overflow-count="9">
        <BellOutlined :style="{ fontSize: '40px', cursor: 'pointer' }" @click="resetCountReadAllNotification" />
      </Badge>

      <template #content>
        <div class="notification-wrapper">
          <div class="notification-header">
          <TypographyTitle :level="4" class="notification-title">Thông báo</TypographyTitle>
        </div>
        <Divider />
        <div class="notification-content">
          <List :dataSource="sortedListNotification">
            <template #renderItem="{ item }">
              <div class="notification-item" @click="readNotification(item.messageId)">
                <div class="notification-item-content">
                  <TypographyTitle :level="5">{{ item.notification.title }}</TypographyTitle>
                  <TypographyText>{{ item.notification.body }}</TypographyText>
                </div>
                <div class="notification-item-time">
                  <TypographyText>{{ getTimeAgo(item.createdAt) }}</TypographyText>
                  <CloseOutlined :style="{ cursor: 'pointer', color: 'red', fontSize: '16px', display: 'none', position: 'absolute', right: '-24px', top: '50%', transform: 'translateY(-50%)' }" @click="removeNotification(item.messageId)" />
                </div>
                <div v-if="!item.isRead" class="notification-item-unread" />
              </div>
            </template>
          </List>
        </div>
        <div v-if="sortedListNotification.length > 0" class="notification-footer">
          <Button type="link" @click="clearAllNotification">Xóa tất cả</Button>
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
  max-height: 400px;
  overflow-y: auto;
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

    .anticon-close {
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
    .anticon-close {
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
</style>