<template>
  <div class="popup-card">
    <div class="popup-head">
      <strong>{{ robot.id }} 实时状态</strong>
      <span :class="statusClass">{{ robot.label }}</span>
    </div>

    <div class="stats">
      <div class="stat-card"><span>运行状态</span><strong :class="statusClass">{{ robot.label }}</strong></div>
      <div class="stat-card"><span>机器人类型</span><strong>{{ robot.robotType }}</strong></div>
      <div class="stat-card wide"><span>当前任务</span><strong>{{ taskName }}</strong></div>
      <div class="stat-card wide battery-card">
        <span>剩余电量 / 剩余里程</span>
        <div class="battery-row">
          <strong>{{ robot.battery }}% / {{ remainMileage }}km</strong>
          <div class="battery-bar"><div class="battery-fill" :style="{ width: `${robot.battery}%` }"></div></div>
        </div>
      </div>
      <div class="stat-card"><span>当前巡检点</span><strong>{{ activeNodeName }}</strong></div>
      <div class="stat-card"><span>速度</span><strong>{{ robot.speedKmh.toFixed(1) }}km/h</strong></div>
      <div class="stat-card"><span>今日里程</span><strong>{{ todayMileage }}km</strong></div>
      <div class="stat-card"><span>总里程</span><strong>{{ totalMileage }}km</strong></div>
    </div>

    <div class="camera-card">
      <div class="camera-head">
        <span>云台实时视角</span>
        <span class="live-dot">LIVE</span>
      </div>
      <div class="camera-screen" :style="{ backgroundImage: `url(${task?.bgImg || fallbackImage})` }">
        <div class="crosshair"></div>
        <div class="screen-meta">{{ robot.id }} | CAM-01 | {{ timeText }}</div>
      </div>
    </div>

    <div class="attachment-block">
      <div class="block-title">挂件检测</div>
      <div class="attachment-grid">
        <div v-for="metric in attachmentMetrics" :key="metric.label" class="attachment-item">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
        </div>
      </div>
    </div>

    <button class="toolbar-btn active" @click="$emit('open-control', robot.id)">前往调度台</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { InspectionPointViewModel, RobotViewModel, Task } from '@/features/cockpit/types'

const props = defineProps<{
  robot: RobotViewModel
  task?: Task | null
  point?: InspectionPointViewModel | null
}>()

defineEmits<{
  (event: 'open-control', robotId: string): void
}>()

const statusClass = computed(() => {
  if (props.robot.bizStatus === 'charging') return 'status-charging'
  if (props.robot.bizStatus === 'returning') return 'status-warn'
  return 'status-safe'
})

const taskName = computed(() => props.task?.taskName || props.robot.task)
const activeNodeName = computed(() => props.task?.timeline.nodes.find((item) => item.status === 'active')?.name || '待命')
const remainMileage = computed(() => Math.round((props.robot.battery / 100) * 120))
const todayMileage = computed(() => Math.max(18, Math.round((props.robot.battery / 100) * 42)))
const totalMileage = computed(() => ({ 'R-07': 4820, 'R-12': 3960, 'R-02': 2740, 'R-11': 3210, 'R-05': 3920 }[props.robot.id] ?? 0))
const attachmentMetrics = computed(() => Object.values(props.point?.monitorPoints[0]?.metrics ?? {}).slice(0, 4))
const fallbackImage = 'linear-gradient(135deg, #152338, #2f4866)'
const now = new Date()
const timeText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
</script>

<style scoped lang="scss">
.popup-card {
  padding: 0;
  border-radius: 8px;
  background: rgba(10, 16, 26, 0.96);
  border: 1px solid var(--accent-titan);
  min-width: 330px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.55), 0 0 20px rgba(197, 168, 123, 0.08);
}

.popup-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-subtle);
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 10px 14px 0;
}

span {
  color: var(--text-sub);
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.stat-card.wide {
  grid-column: span 2;
}

.stat-card strong {
  color: var(--text-main);
  font-family: var(--font-data);
  font-size: 12px;
}

.battery-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.battery-bar {
  flex: 1;
  height: 7px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.battery-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ef4444, #f59e0b, #22c55e);
}

.camera-card,
.attachment-block {
  border-top: 1px solid var(--border-subtle);
  padding: 10px 14px;
}

.camera-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 11px;
}

.live-dot {
  color: #fca5a5;
  font-family: var(--font-data);
}

.camera-screen {
  position: relative;
  height: 138px;
  border: 1px solid var(--border-focus);
  background-size: cover;
  background-position: center;
}

.crosshair {
  position: absolute;
  inset: 0;
}

.crosshair::before,
.crosshair::after {
  content: '';
  position: absolute;
  background: rgba(255,255,255,0.25);
}

.crosshair::before {
  left: 50%;
  top: 24%;
  bottom: 24%;
  width: 1px;
}

.crosshair::after {
  top: 50%;
  left: 24%;
  right: 24%;
  height: 1px;
}

.screen-meta {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 8px;
  padding: 4px 6px;
  font-size: 10px;
  font-family: var(--font-data);
  background: rgba(10, 16, 26, 0.85);
}

.block-title {
  margin-bottom: 6px;
  font-size: 11px;
}

.attachment-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.attachment-item {
  padding: 8px;
  border-radius: 4px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
}

.attachment-item strong {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  font-family: var(--font-data);
}

.toolbar-btn {
  margin: 0 14px 14px;
}
</style>
