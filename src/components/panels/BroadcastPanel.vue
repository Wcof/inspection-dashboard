<template>
  <section class="panel-card panel">
    <div class="panel-header">
      <div>
        <h3 class="panel-title">信息播报</h3>
        <div class="panel-subtitle">告警置顶</div>
      </div>
    </div>
    <div class="pin">{{ pinned }}</div>
    <BroadcastTicker :items="items" @select="$emit('select', $event)" />
  </section>
</template>

<script setup lang="ts">
import BroadcastTicker from '@/components/broadcast/BroadcastTicker.vue'
import type { BroadcastItem } from '@/features/cockpit/types'

defineProps<{
  items: BroadcastItem[]
  pinned: string
}>()

defineEmits<{
  (event: 'select', id: string): void
}>()
</script>

<style scoped lang="scss">
.panel {
  padding: 18px;
}

.pin {
  margin-bottom: 14px;
  padding: 14px;
  border-radius: 14px;
  color: #ffe3e6;
  background: rgba(83, 24, 35, 0.42);
  border: 1px solid rgba(255, 107, 120, 0.24);
}
</style>
