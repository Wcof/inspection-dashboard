<template>
  <div class="popup-card">
    <div class="popup-head">
      <strong>{{ dock.name }}</strong>
      <span :class="dock.status === 'charging' ? 'status-charging' : 'status-safe'">
        {{ dock.status === 'charging' ? '充电中' : '空闲' }}
      </span>
    </div>
    <div class="metric-list">
      <div class="metric-item"><span>当前机器人</span><strong>{{ dock.bot }}</strong></div>
      <div class="metric-item"><span>上次补能</span><strong>{{ dock.lastRobot }}</strong></div>
      <div class="metric-item"><span>队列</span><strong>{{ dock.queueCount }}</strong></div>
      <div class="metric-item"><span>电压</span><strong>{{ dock.voltage }}</strong></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DockViewModel } from '@/features/cockpit/types'

defineProps<{
  dock: DockViewModel
}>()
</script>

<style scoped lang="scss">
.popup-card {
  padding: 16px;
  border-radius: 18px;
  background: rgba(8, 16, 30, 0.94);
  border: 1px solid var(--border-focus);
  min-width: 300px;
}

.popup-head,
.metric-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.metric-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

span {
  color: var(--text-sub);
}
</style>
