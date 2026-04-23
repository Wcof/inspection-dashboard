<template>
  <div v-if="visible && alert" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="modal-head">
        <div>
          <h3>{{ alert.device }}</h3>
          <div class="panel-subtitle">{{ alert.time }} · {{ alert.loc }} · {{ alert.state }}</div>
        </div>
        <button class="toolbar-btn" @click="$emit('close')">关闭</button>
      </div>
      <div class="meta-grid">
        <div><span>缺陷详情</span><strong>{{ alert.defect }}</strong></div>
        <div><span>最近对比</span><strong>{{ alert.lastResult }} / {{ alert.comp }}</strong></div>
      </div>
      <div class="evidence-preview" :style="{ backgroundImage: `url(${alert.bgImg})` }" @click="$emit('open-evidence')"></div>
      <div class="actions">
        <button class="toolbar-btn" @click="$emit('confirm', alert.id)">确认处置</button>
        <button class="toolbar-btn" @click="$emit('clear', alert.id)">清除告警</button>
        <button class="toolbar-btn" @click="$emit('undo', alert.id)">撤销</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlertViewModel } from '@/features/cockpit/types'

defineProps<{
  visible: boolean
  alert: AlertViewModel | null
}>()

defineEmits<{
  (event: 'close'): void
  (event: 'confirm', id: string): void
  (event: 'clear', id: string): void
  (event: 'undo', id: string): void
  (event: 'open-evidence'): void
}>()
</script>

<style scoped lang="scss">
.modal-head,
.meta-grid > div,
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.meta-grid {
  display: grid;
  gap: 12px;
  margin: 16px 0;
}

.meta-grid span {
  color: var(--text-dim);
}

.evidence-preview {
  height: 240px;
  border-radius: 18px;
  background-position: center;
  background-size: cover;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 107, 120, 0.25);
}

.actions {
  gap: 10px;
  justify-content: flex-end;
}
</style>
