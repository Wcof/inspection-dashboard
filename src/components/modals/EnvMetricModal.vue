<template>
  <div v-if="visible" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="modal-head">
        <div>
          <h3>{{ title }}</h3>
          <div class="panel-subtitle">近 7 天趋势</div>
        </div>
        <button class="toolbar-btn" @click="$emit('close')">关闭</button>
      </div>
      <div class="history-grid">
        <div v-for="row in rows" :key="row.date" class="history-row">
          <span>{{ row.date }}</span>
          <strong>{{ row.value }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  title: string
  rows: Array<{ date: string; value: number }>
}>()

defineEmits<{
  (event: 'close'): void
}>()
</script>

<style scoped lang="scss">
.modal-head,
.history-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.history-grid {
  display: grid;
  gap: 10px;
}

.history-row {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(12, 22, 39, 0.82);
}

.history-row span {
  color: var(--text-sub);
}
</style>
