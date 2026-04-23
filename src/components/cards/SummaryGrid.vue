<template>
  <div class="summary-grid" :class="columns">
    <div v-for="item in items" :key="item.label" class="summary-item">
      <span class="s-label">{{ item.label }}</span>
      <span class="s-val">{{ item.value }}</span>
      <span class="s-meta">{{ item.meta }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  items: Array<{ label: string; value: string; meta: string }>
  columns?: 'two-columns' | 'three-columns' | 'four-columns'
}>(), {
  columns: 'two-columns'
})
</script>
