<template>
  <section class="panel-card panel">
    <div class="panel-header">
      <div>
        <h3 class="panel-title">充电站概览</h3>
        <div class="panel-subtitle">补能节点状态</div>
      </div>
    </div>
    <div class="dock-grid">
      <button v-for="dock in docks" :key="dock.id" class="dock-card" @click="$emit('select', dock.id)">
        <div class="dock-head">
          <strong>{{ dock.id }}</strong>
          <span :class="dock.status === 'charging' ? 'status-charging' : 'status-safe'">
            {{ dock.status === 'charging' ? '充电中' : '空闲' }}
          </span>
        </div>
        <div class="dock-name">{{ dock.name }}</div>
        <div class="dock-meta">队列 {{ dock.queueCount }} / 满电未离站 {{ dock.fullNotLeave }}</div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DockViewModel } from '@/features/cockpit/types'

defineProps<{
  docks: DockViewModel[]
}>()

defineEmits<{
  (event: 'select', dockId: string): void
}>()
</script>

<style scoped lang="scss">
.panel {
  padding: 18px;
  flex: 1;
}

.dock-grid {
  display: grid;
  gap: 10px;
}

.dock-card {
  padding: 14px;
  text-align: left;
  border-radius: 14px;
  background: rgba(12, 22, 39, 0.82);
  border: 1px solid rgba(121, 145, 181, 0.14);
  color: var(--text-main);
}

.dock-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.dock-name {
  margin-bottom: 6px;
}

.dock-meta {
  color: var(--text-dim);
  font-size: 12px;
}
</style>
