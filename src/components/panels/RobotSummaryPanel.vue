<template>
  <section class="panel-card panel">
    <div class="panel-header">
      <div>
        <h3 class="panel-title">机器人总览</h3>
        <div class="panel-subtitle">机器人总里程 {{ totalMileage }}</div>
      </div>
    </div>
    <SummaryGrid :items="items" columns="two-columns" />
    <div class="subsection">
      <div class="panel-subtitle subheader">气体感应器</div>
      <SummaryGrid :items="gasItems" columns="three-columns" />
    </div>
    <div class="subsection">
      <div class="panel-subtitle subheader">云台</div>
      <SummaryGrid :items="gimbalItems" columns="three-columns" />
    </div>
  </section>
</template>

<script setup lang="ts">
import SummaryGrid from '@/components/cards/SummaryGrid.vue'

defineProps<{
  items: Array<{ label: string; value: string; meta: string }>
  gasItems: Array<{ label: string; value: string; meta: string }>
  gimbalItems: Array<{ label: string; value: string; meta: string }>
  totalMileage: string
}>()
</script>

<style scoped lang="scss">
.panel {
  padding: 18px;
}

.subsection + .subsection {
  margin-top: 14px;
}

.subheader {
  margin: 16px 0 10px;
}
</style>
