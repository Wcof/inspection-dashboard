<template>
  <section class="panel-card panel">
    <div class="panel-header">
      <div>
        <h3 class="panel-title">巡检总览</h3>
        <div class="panel-subtitle">任务覆盖与设备检测</div>
      </div>
    </div>
    <SummaryGrid :items="items" columns="two-columns" />
  </section>
</template>

<script setup lang="ts">
import SummaryGrid from '@/components/cards/SummaryGrid.vue'

defineProps<{
  items: Array<{ label: string; value: string; meta: string }>
}>()
</script>

<style scoped lang="scss">
.panel {
  padding: 18px;
}
</style>
