<template>
  <section class="panel-card timeline-shell">
    <div class="tl-header">
      <span>{{ task.timeline.title }}</span>
      <span>当前聚焦 {{ currentNode?.name || task.timeline.nodes[0]?.name }}</span>
    </div>
    <div class="flow-track">
      <div class="f-line"></div>
      <button
        v-for="node in task.timeline.nodes"
        :key="`${node.time}-${node.name}`"
        class="f-node"
        :class="node.status"
        :style="{ left: node.pos }"
        @click="$emit('select-node', node)"
      >
        <div class="f-point" :class="{ 'pop-pulse': node.status === 'danger' }"></div>
        <div class="f-info">
          <div class="time">{{ node.time }}</div>
          <div class="name">{{ node.name }}</div>
          <div class="res">{{ node.res || '待执行' }}</div>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task, TimelineNode } from '@/features/cockpit/types'

const props = defineProps<{
  task: Task
}>()

defineEmits<{
  (event: 'select-node', node: TimelineNode): void
}>()

const currentNode = computed(() => props.task.timeline.nodes.find((item) => item.status === 'active'))
</script>

<style scoped lang="scss">
.timeline-shell {
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  width: 55%;
  max-width: 980px;
  padding: 16px 24px;
  border-radius: 4px;
  z-index: 20;
}

.tl-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-sub);
  margin-bottom: 16px;
}

.tl-header span:first-child {
  color: var(--accent-titan);
}

.flow-track {
  position: relative;
  height: 84px;
  margin: 0 40px;
}

.f-line {
  position: absolute;
  top: 12px;
  width: 100%;
  height: 2px;
  background: rgba(255,255,255,0.1);
}

.f-node {
  position: absolute;
  top: 8px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  background: transparent;
  border: 0;
  color: var(--text-main);
}

.f-point {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--text-sub);
  border: 2px solid var(--bg-deep);
  z-index: 2;
  position: relative;
}

.f-info {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.time,
.res {
  color: var(--text-dim);
  font-size: 11px;
}

.name {
  font-weight: 700;
  font-size: 11px;
}

.f-node.safe .f-point {
  background: var(--status-safe);
  box-shadow: 0 0 6px var(--status-safe);
}

.f-node.warn .f-point {
  background: var(--status-warn);
}

.f-node.danger .f-point {
  background: var(--status-danger);
}

.f-node.active .f-point {
  width: 14px;
  height: 14px;
  background: var(--bg-deep);
  border-color: var(--accent-titan);
}

.f-node.active::before {
  content: "";
  position: absolute;
  top: -7px;
  width: 24px;
  height: 24px;
  border: 1px dashed var(--accent-titan);
  border-radius: 50%;
  animation: spin 4s linear infinite;
}

.f-node.future .f-point {
  background: transparent;
  border-color: var(--text-dim);
}

.pop-pulse {
  animation: pop-pulse 2s infinite ease-out;
}

@keyframes pop-pulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
  100% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

@media (max-width: 1200px) {
  .timeline-shell {
    position: static;
    transform: none;
    width: auto;
    margin-top: 16px;
  }

  .flow-track {
    height: auto;
    margin: 0;
    display: grid;
    gap: 12px;
  }

  .f-line {
    display: none;
  }

  .f-node {
    position: static;
    transform: none;
    width: auto;
    align-items: flex-start;
    padding: 12px;
    border-radius: 12px;
    background: rgba(12, 22, 39, 0.82);
    border: 1px solid rgba(121, 145, 181, 0.14);
  }

  .f-info {
    align-items: flex-start;
    text-align: left;
  }
}
</style>
