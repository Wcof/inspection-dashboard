<template>
  <div class="popup-card">
    <div class="popup-head">
      <strong>{{ point.name }}</strong>
      <span class="status-tag">{{ statusText }}</span>
    </div>

    <div class="stats">
      <div class="stat-card"><span>巡检点名称</span><strong>{{ point.name }}</strong></div>
      <div class="stat-card"><span>今日巡检次数</span><strong>{{ visitTimes }}次</strong></div>
      <div class="stat-card"><span>时间间隔</span><strong>每2小时/次</strong></div>
      <div class="stat-card"><span>时间范围</span><strong>{{ timeRange }}</strong></div>
      <div class="stat-card wide"><span>最近采集时间</span><strong>{{ lastCollectTime }}</strong></div>
    </div>

    <div class="media-section">
      <div class="section-title">巡检信息</div>
      <div class="tab-row">
        <button class="mini-tab" :class="{ active: currentTab === 'media' }" @click="currentTab = 'media'">最新影像</button>
        <button class="mini-tab" :class="{ active: currentTab === 'alert' }" @click="currentTab = 'alert'">巡检告警</button>
      </div>
      <div class="media-frame" :style="{ backgroundImage: `url(${imageSource})`, filter: currentMode === 'thermal' ? 'saturate(4) hue-rotate(120deg) contrast(1.7)' : 'grayscale(10%) contrast(1.05)' }"></div>
      <div class="tab-row secondary">
        <button class="mini-tab" :class="{ active: currentMode === 'optical' }" @click="currentMode = 'optical'">光学视角</button>
        <button class="mini-tab" :class="{ active: currentMode === 'thermal' }" @click="currentMode = 'thermal'">热成像视角</button>
      </div>
    </div>

    <div class="metric-list">
      <div v-for="metric in metrics" :key="metric.label" class="metric-item">
        <span>{{ metric.icon }} {{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { InspectionPointViewModel } from '@/features/cockpit/types'
import { cockpitMock } from '@/mocks/cockpit.mock'

const props = defineProps<{
  point: InspectionPointViewModel
}>()

const metrics = computed(() => Object.values(props.point.monitorPoints[0]?.metrics ?? {}))
const currentTab = ref<'media' | 'alert'>('media')
const currentMode = ref<'optical' | 'thermal'>('optical')
const statusText = computed(() => (props.point.status === 'running' ? '巡检中' : props.point.status === 'pending' ? '待巡检' : '有告警'))
const visitTimes = computed(() => (props.point.status === 'pending' ? 1 : props.point.status === 'running' ? 4 : 5))
const timeRange = computed(() => (props.point.status === 'pending' ? '待巡检' : `09:50 - ${props.point.taskId === 'T-01' ? '10:32' : '09:15'}`))
const lastCollectTime = computed(() => (props.point.status === 'pending' ? '待采集' : props.point.taskId === 'T-01' ? '10:32' : '09:15'))
const alert = computed(() => cockpitMock.alerts.find((item) => item.loc.includes(props.point.id.slice(-2)) || item.coords[0] === props.point.coords[0]))
const imageSource = computed(() => (currentTab.value === 'alert' ? alert.value?.bgImg : cockpitMock.tasks[props.point.taskId]?.bgImg) || alert.value?.bgImg || '')
</script>

<style scoped lang="scss">
.popup-card {
  padding: 0;
  border-radius: 8px;
  background: rgba(10, 16, 26, 0.96);
  border: 1px solid var(--accent-titan);
  min-width: 330px;
  overflow: hidden;
}

.popup-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-subtle);
}

.status-tag {
  color: var(--accent-titan);
}

.stats,
.metric-list {
  display: grid;
  gap: 6px;
  padding: 10px 14px;
}

.stats {
  grid-template-columns: 1fr 1fr;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 6px 8px;
  border-radius: 4px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
}

.stat-card.wide {
  grid-column: span 2;
}

.media-section {
  padding: 0 14px 10px;
  border-top: 1px solid var(--border-subtle);
}

.section-title {
  margin: 10px 0 6px;
  font-size: 11px;
  color: var(--text-sub);
}

.tab-row {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.mini-tab {
  padding: 4px 10px;
  font-size: 11px;
  border-radius: 4px;
  color: var(--text-sub);
  background: transparent;
  border: 1px solid var(--border-subtle);
}

.mini-tab.active {
  color: var(--accent-titan);
  border-color: var(--border-focus);
  background: rgba(197, 168, 123, 0.1);
}

.media-frame {
  height: 136px;
  border: 1px solid var(--border-focus);
  background-size: cover;
  background-position: center;
}

.secondary {
  margin-top: 6px;
  margin-bottom: 0;
}

.metric-list {
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--border-subtle);
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 8px;
  border-radius: 4px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
}

span {
  color: var(--text-sub);
}

strong {
  color: var(--text-main);
  font-family: var(--font-data);
  font-size: 12px;
}
</style>
