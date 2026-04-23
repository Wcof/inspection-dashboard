<template>
  <div class="popup-card">
    <div class="popup-head">
      <strong>{{ ap.name }}</strong>
      <span :class="ap.status === 'danger' ? 'status-danger' : 'status-safe'">{{ ap.status === 'danger' ? '离线风险' : '正常' }}</span>
    </div>
    <div class="metric-list">
      <div class="metric-item"><span>信号</span><strong>{{ ap.signal }}</strong></div>
      <div class="metric-item"><span>频段</span><strong>{{ ap.band }}</strong></div>
      <div class="metric-item"><span>信道</span><strong>{{ ap.channel }}</strong></div>
      <div class="metric-item"><span>在线时长</span><strong>{{ ap.uptime }}</strong></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApDevice } from '@/features/cockpit/types'

defineProps<{
  ap: ApDevice
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
