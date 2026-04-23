<template>
  <CockpitShell>
    <template #header>
      <CockpitHeader
        :title="store.vm.header.title"
        :subtitle="store.vm.header.subtitle"
        :context="store.headerContext"
        :weather="store.raw.weather"
        :safety-days="store.vm.summary.safetyDays"
        :clock="clockText()"
      />
      <div class="message-marquee panel-card">
        <div class="message-track">
          <span v-for="item in marqueeItems" :key="item.id" :class="item.type === 'alert' ? 'msg-alert' : ''">{{ item.text }}</span>
          <span v-for="item in marqueeItems" :key="`${item.id}-dup`" :class="item.type === 'alert' ? 'msg-alert' : ''">{{ item.text }}</span>
        </div>
      </div>
    </template>

    <template #left>
      <OperationOverviewPanel
        :start="store.dateRange.start"
        :end="store.dateRange.end"
        :total-robots="store.vm.summary.totalRobots"
        :total-runtime-hours="store.vm.summary.totalRuntimeHours"
        :today-tasks="store.vm.summary.todayTasks"
        :executed-task-total="store.vm.summary.executedTaskTotal"
        @update:start="store.dateRange.start = $event"
        @update:end="store.dateRange.end = $event"
      />
      <InspectionSummaryPanel :items="store.leadership.planSummary" />
      <RobotSummaryPanel
        :items="store.leadership.robotSummary"
        :gas-items="gasItems"
        :gimbal-items="gimbalItems"
        total-mileage="18650km"
      />
    </template>

    <MapStage
      :toolbar="store.toolbarState"
      :map-ui="store.mapUi"
      :focus-target="store.focusTarget"
      :robots="store.vm.robots"
      :points="store.vm.points"
      :docks="store.vm.docks"
      :ap-devices="store.vm.apDevices"
      :alerts="store.vm.alerts"
      :current-robot="store.currentRobot"
      :current-point="store.currentPoint"
      :current-dock="store.currentDock"
      :current-ap="currentAp"
      :current-task="store.currentTask"
      @toggle-search="store.toolbarState.searchOpen = !store.toolbarState.searchOpen; store.toolbarState.displayControlOpen = false"
      @toggle-display="store.toolbarState.displayControlOpen = !store.toolbarState.displayControlOpen; store.toolbarState.searchOpen = false"
      @update:keyword="store.toolbarState.keyword = $event"
      @update:type="store.toolbarState.type = $event"
      @toggle-layer="store.toggleMapLayer($event)"
      @toggle-area="store.togglePointArea($event)"
      @search="doSearch"
      @open-control="store.openModal('robotControl')"
      @go-cockpit="store.resetView()"
      @reset="store.resetView()"
      @open-evidence="store.openModal('evidence', { image: store.currentTask.bgImg })"
      @open-robot-control="store.openModal('robotControl', { robotId: $event })"
    />

    <TaskTimeline :task="store.currentTask" @select-node="handleTimelineSelect" />

    <template #right>
      <RiskPanel :summary="store.riskSummary" @focus-category="handleRiskFocus" />
      <BroadcastPanel :items="store.vm.broadcasts" :pinned="pinnedMessage" @select="handleBroadcastSelect" />
      <FacilitySummaryPanel
        :items="store.leadership.facilitySummary"
        :facility-total="65"
        :env-focus-point="store.currentPoint.name"
        :env-items="store.leadership.envSummary"
        @open-metric="openEnvMetric"
      />
      <DockSummaryPanel :docks="store.vm.docks" @select="store.setFocus('dock', $event)" />
    </template>
  </CockpitShell>

  <AlertModal
    :visible="store.modalState.alert"
    :alert="store.currentAlert"
    @close="store.closeModal('alert')"
    @confirm="store.confirmAlert"
    @clear="store.clearAlert"
    @undo="store.undoAlert"
    @open-evidence="store.openModal('evidence', { image: store.currentAlert?.bgImg })"
  />
  <EvidenceModal
    :visible="store.modalState.evidence"
    :title="evidenceTitle"
    :meta="store.headerContext"
    :image="evidenceImage"
    @close="store.closeModal('evidence')"
  />
  <EnvMetricModal :visible="store.modalState.envMetric" :title="envMetricTitle" :rows="envRows" @close="store.closeModal('envMetric')" />
  <RobotControlModal :visible="store.modalState.robotControl" :robot="controlRobot" @close="store.closeModal('robotControl')" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CockpitShell from '@/components/layout/CockpitShell.vue'
import CockpitHeader from '@/components/layout/CockpitHeader.vue'
import OperationOverviewPanel from '@/components/panels/OperationOverviewPanel.vue'
import InspectionSummaryPanel from '@/components/panels/InspectionSummaryPanel.vue'
import RobotSummaryPanel from '@/components/panels/RobotSummaryPanel.vue'
import RiskPanel from '@/components/panels/RiskPanel.vue'
import BroadcastPanel from '@/components/panels/BroadcastPanel.vue'
import FacilitySummaryPanel from '@/components/panels/FacilitySummaryPanel.vue'
import DockSummaryPanel from '@/components/panels/DockSummaryPanel.vue'
import MapStage from '@/components/map/MapStage.vue'
import TaskTimeline from '@/components/timeline/TaskTimeline.vue'
import AlertModal from '@/components/modals/AlertModal.vue'
import EvidenceModal from '@/components/modals/EvidenceModal.vue'
import EnvMetricModal from '@/components/modals/EnvMetricModal.vue'
import RobotControlModal from '@/components/modals/RobotControlModal.vue'
import { useCockpitStore } from '@/features/cockpit/store/cockpit'
import { useCockpitTicker } from '@/features/cockpit/composables/useCockpitTicker'
import { useMapSearch } from '@/features/cockpit/composables/useMapSearch'

const store = useCockpitStore()
const { clockText } = useCockpitTicker()
const { doSearch } = useMapSearch()

const gasItems = computed(() => {
  const gas = store.raw.attachmentSummary.gasSensors
  return [
    { label: '气体传感器总数', value: String(gas.total), meta: '总数' },
    { label: '传感器正常', value: String(gas.normal), meta: '正常' },
    { label: '传感器异常', value: String(gas.offline), meta: '已掉线' }
  ]
})

const gimbalItems = computed(() => {
  const gimbal = store.raw.attachmentSummary.gimbals
  return [
    { label: '云台总数', value: String(gimbal.total), meta: '总数' },
    { label: '云台正常', value: String(gimbal.normal), meta: '正常' },
    { label: '云台异常', value: String(gimbal.offline), meta: '已掉线' }
  ]
})

const pinnedMessage = computed(() => store.vm.broadcasts.find((item) => item.type === 'alert')?.text ?? '暂无置顶告警')
const marqueeItems = computed(() => store.vm.broadcasts.slice(0, 4))
const currentAp = computed(() => store.vm.apDevices.find((item) => item.id === store.focusTarget.id) ?? null)
const controlRobot = computed(() => {
  const payloadRobotId = String(store.modalPayload.robotId ?? '')
  return store.vm.robots.find((robot) => robot.id === payloadRobotId) ?? store.currentRobot
})
const evidenceImage = computed(() => String(store.modalPayload.image ?? store.currentTask.bgImg))
const evidenceTitle = computed(() => store.currentAlert?.device ?? store.currentTask.taskName)
const envMetricTitle = computed(() => `${store.envMetricKey} 历史数据`)
const envRows = computed(() =>
  Array.from({ length: 7 }, (_, index) => ({
    date: new Date(Date.now() - index * 86400000).toISOString().slice(0, 10),
    value: Math.max(0, (index * 2 + store.envMetricKey.charCodeAt(0)) % 6)
  }))
)

const handleRiskFocus = (category: string) => {
  const alert = store.vm.alerts.find((item) => item.category === category)
  if (alert) {
    store.setFocus('alert', alert.id)
    store.openModal('alert', { alertId: alert.id })
  }
}

const handleBroadcastSelect = (id: string) => {
  const alertId = id.startsWith('A-') ? id : null
  if (alertId) {
    store.setFocus('alert', alertId)
    store.openModal('alert', { alertId })
  }
}

const openEnvMetric = (key: string) => {
  store.envMetricKey = key
  store.openModal('envMetric')
}

const handleTimelineSelect = (node: { alertId?: string; name: string }) => {
  if (node.alertId) {
    store.setFocus('alert', node.alertId)
    store.openModal('alert', { alertId: node.alertId })
    return
  }

  const point = store.vm.points.find((item) => item.name.includes(node.name) || node.name.includes(item.name))
  if (point) store.setFocus('inspectionPoint', point.id)
}
</script>

<style scoped lang="scss">
.message-marquee {
  position: relative;
  overflow: hidden;
  margin: -6px 0 14px;
  padding: 0;
  border-radius: 999px;
}

.message-track {
  display: inline-flex;
  gap: 32px;
  min-width: max-content;
  padding: 10px 0 10px 100%;
  color: #cfe3f7;
  animation: marquee-move 22s linear infinite;
}

.msg-alert {
  color: #fca5a5;
}

@keyframes marquee-move {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
