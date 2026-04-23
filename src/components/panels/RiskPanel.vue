<template>
  <section class="panel-card panel">
    <div class="panel-header">
      <div>
        <h3 class="panel-title">安全风险</h3>
        <div class="panel-subtitle">重点关注</div>
      </div>
    </div>
    <div class="risk-total">{{ summary.total }}</div>
    <div class="risk-grid">
      <button class="risk-item" @click="$emit('focus-category', 'infrared')">
        <span>巡检点</span>
        <strong>{{ summary.infrared }}</strong>
      </button>
      <button class="risk-item" @click="$emit('focus-category', 'device')">
        <span>设施设备</span>
        <strong>{{ summary.device }}</strong>
      </button>
      <button class="risk-item" @click="$emit('focus-category', 'gas')">
        <span>气体异常</span>
        <strong>{{ summary.gas }}</strong>
      </button>
      <button class="risk-item" @click="$emit('focus-category', 'safeBehavior')">
        <span>安全行为</span>
        <strong>{{ summary.safeBehavior }}</strong>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  summary: {
    total: number
    infrared: number
    device: number
    gas: number
    safeBehavior: number
  }
}>()

defineEmits<{
  (event: 'focus-category', value: string): void
}>()
</script>

<style scoped lang="scss">
.panel {
  padding: 18px;
}

.risk-total {
  margin-bottom: 14px;
  font-size: 44px;
  font-family: var(--font-data);
  color: var(--accent-red);
}

.risk-grid {
  display: grid;
  gap: 10px;
}

.risk-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border: 1px solid rgba(123, 149, 180, 0.15);
  border-radius: 14px;
  background: rgba(14, 24, 42, 0.86);
  color: var(--text-main);
}

strong {
  font-size: 20px;
  color: var(--accent-titan);
}
</style>
