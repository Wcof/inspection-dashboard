<template>
  <div class="broadcast-list">
    <button
      v-for="item in items"
      :key="item.id"
      class="broadcast-item"
      :class="item.type"
      @click="$emit('select', item.id)"
    >
      {{ item.text }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { BroadcastItem } from '@/features/cockpit/types'

defineProps<{
  items: BroadcastItem[]
}>()

defineEmits<{
  (event: 'select', id: string): void
}>()
</script>

<style scoped lang="scss">
.broadcast-list {
  display: grid;
  gap: 10px;
  max-height: 256px;
  overflow: auto;
}

.broadcast-item {
  padding: 12px 14px;
  border-radius: 12px;
  text-align: left;
  border: 1px solid rgba(118, 144, 180, 0.14);
  background: rgba(12, 22, 39, 0.82);
  color: var(--text-sub);
}

.broadcast-item.alert {
  color: #ffd5d9;
  border-color: rgba(255, 107, 120, 0.28);
}
</style>
