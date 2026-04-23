<template>
  <section class="panel-card panel">
    <div class="panel-header">
      <div>
        <h3 class="panel-title">设施设备概览</h3>
        <div class="panel-subtitle">设施设备总数 {{ facilityTotal }}</div>
      </div>
    </div>
    <SummaryGrid :items="items" columns="two-columns" />
    <div class="subsection">
      <div class="subheader">
        <span class="panel-subtitle">环境检测</span>
        <strong>{{ envFocusPoint }}</strong>
      </div>
      <div class="summary-grid two-columns">
        <button v-for="item in envItems" :key="item.key" class="env-card" @click="$emit('open-metric', item.key)">
          <span class="s-label">{{ item.label }}</span>
          <strong>{{ item.maxValue }}</strong>
          <span class="s-meta">机器 {{ item.machine }} / 远端 {{ item.remote }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SummaryGrid from '@/components/cards/SummaryGrid.vue'

defineProps<{
  items: Array<{ label: string; value: string; meta: string }>
  facilityTotal: number
  envFocusPoint: string
  envItems: Array<{ key: string; label: string; machine: number; remote: number; maxValue: string }>
}>()

defineEmits<{
  (event: 'open-metric', key: string): void
}>()
</script>

<style scoped lang="scss">
.panel {
  padding: 18px;
}

.subsection {
  margin-top: 16px;
}

.subheader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.env-card {
  padding: 14px;
  text-align: left;
  border-radius: 14px;
  border: 1px solid rgba(121, 145, 181, 0.14);
  background: rgba(12, 22, 39, 0.82);
  color: var(--text-main);
}

strong {
  display: block;
  margin: 6px 0;
  font-family: var(--font-data);
  font-size: 22px;
}
</style>
