<template>
  <section class="panel-card panel">
    <div class="panel-header">
      <div>
        <h3 class="panel-title">总体运营概览</h3>
        <div class="panel-subtitle">核心运行指标</div>
      </div>
      <div class="date-range">
        <input :value="start" type="date" @input="$emit('update:start', ($event.target as HTMLInputElement).value)" />
        <span>至</span>
        <input :value="end" type="date" @input="$emit('update:end', ($event.target as HTMLInputElement).value)" />
      </div>
    </div>
    <div class="hero-grid">
      <div class="hero-card">
        <span class="label">机器总数</span>
        <strong>{{ totalRobots }}</strong>
        <span class="meta">总运行时长 {{ totalRuntimeHours }} 小时</span>
      </div>
      <div class="hero-card">
        <span class="label">当日巡检点次</span>
        <strong>{{ todayTasks }}</strong>
        <span class="meta">累计巡检点次 {{ executedTaskTotal }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  start: string
  end: string
  totalRobots: number
  totalRuntimeHours: number
  todayTasks: number
  executedTaskTotal: number
}>()

defineEmits<{
  (event: 'update:start', value: string): void
  (event: 'update:end', value: string): void
}>()
</script>

<style scoped lang="scss">
.panel {
  padding: 18px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-dim);
}

input {
  width: 128px;
  padding: 8px 10px;
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  color: var(--text-main);
  background: rgba(10, 18, 33, 0.84);
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.hero-card {
  padding: 18px;
  border-radius: var(--radius-md);
  background: rgba(13, 24, 43, 0.84);
  border: 1px solid rgba(113, 149, 197, 0.14);
}

.label,
.meta {
  display: block;
}

.label {
  color: var(--text-sub);
  font-size: 13px;
}

strong {
  display: block;
  margin-top: 8px;
  font-size: 34px;
  font-family: var(--font-data);
}

.meta {
  margin-top: 8px;
  color: var(--text-dim);
  font-size: 12px;
}
</style>
