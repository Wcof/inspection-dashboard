<template>
  <header class="panel-card cockpit-header">
    <div class="brand-block">
      <div class="brand-icon"></div>
      <div>
        <div class="brand-sub">{{ subtitle }}</div>
        <h1>{{ title }}</h1>
      </div>
    </div>

    <div class="header-center">
      <div class="header-label">运行上下文</div>
      <div class="context">{{ context }}</div>
    </div>

    <div class="header-right">
      <div class="weather">
        <span class="tag">园区天气</span>
        <span>{{ weather.condition }} {{ weather.temp }}°C {{ weather.wind }} 湿度{{ weather.humidity }}%</span>
      </div>
      <div class="kpi">
        <span class="kpi-label">连续安全天数</span>
        <strong>{{ safetyDays }}</strong>
      </div>
      <div class="clock">{{ clock }}</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { WeatherSnapshot } from '@/features/cockpit/types'

defineProps<{
  title: string
  subtitle: string
  context: string
  weather: WeatherSnapshot
  safetyDays: string
  clock: string
}>()
</script>

<style scoped lang="scss">
.cockpit-header {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1.2fr;
  align-items: center;
  gap: 20px;
  padding: 18px 22px;
  margin-bottom: 18px;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-icon {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  background:
    linear-gradient(135deg, rgba(197, 168, 123, 0.95), rgba(111, 157, 204, 0.95));
  box-shadow: 0 12px 30px rgba(111, 157, 204, 0.25);
}

h1 {
  margin: 4px 0 0;
  font-size: 28px;
}

.brand-sub,
.header-label {
  color: var(--text-dim);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.header-center {
  text-align: center;
}

.context {
  margin-top: 8px;
  color: var(--accent-titan);
  font-size: 15px;
  letter-spacing: 0.1em;
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}

.weather,
.kpi,
.clock {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(12, 22, 40, 0.88);
  border: 1px solid rgba(122, 146, 181, 0.16);
}

.weather {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-sub);
  font-size: 13px;
}

.tag {
  color: var(--accent-titan);
}

.kpi-label {
  margin-right: 8px;
  color: var(--text-dim);
}

.clock {
  font-family: var(--font-data);
  font-size: 20px;
}

@media (max-width: 1180px) {
  .cockpit-header {
    grid-template-columns: 1fr;
  }

  .header-center {
    text-align: left;
  }

  .header-right {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
