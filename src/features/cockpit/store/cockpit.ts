import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { cockpitMock } from '@/mocks/cockpit.mock'
import type { AlertLevel, CockpitFocusTarget, MapLayerVisibility, ModalName, ModalStateMap, ViewMode } from '@/features/cockpit/types'
import { buildViewModel, computeLeadershipSummary, computeRiskSummary } from '@/features/cockpit/services/cockpitAdapter'

const today = new Date().toISOString().slice(0, 10)

export const useCockpitStore = defineStore('cockpit', () => {
  const raw = ref(structuredClone(cockpitMock))
  const vm = computed(() => buildViewModel(raw.value))
  const leadership = computed(() => computeLeadershipSummary(raw.value))
  const riskSummary = computed(() => computeRiskSummary(vm.value.alerts))

  const viewMode = ref<ViewMode>('global')
  const currentRobotId = ref('R-07')
  const currentTaskId = ref('T-01')
  const currentAlertId = ref<string | null>(null)
  const currentDockId = ref<string | null>(null)
  const currentInspectionPointId = ref<string | null>('IP-E3')
  const currentMonitorPointId = ref<string | null>('MP-E3-ENV')
  const autoplayEnabled = ref(true)
  const autoplayIndex = ref(0)
  const envMetricKey = ref('O2')
  const dateRange = ref({ start: today, end: today })
  const toolbarState = ref({ searchOpen: false, displayControlOpen: false, keyword: '', type: 'all' })
  const mapUi = ref<MapLayerVisibility>({
    labels: true,
    robots: true,
    points: true,
    docks: true,
    route: true,
    pointAreas: { A: true, B: true, C: true }
  })
  const modalState = ref<ModalStateMap>({
    evidence: false,
    alert: false,
    envMetric: false,
    robotControl: false
  })
  const modalPayload = ref<Record<string, unknown>>({})

  const focusTarget = computed<CockpitFocusTarget>(() => {
    if (viewMode.value === 'robot') return { type: 'robot', id: currentRobotId.value }
    if (viewMode.value === 'inspectionPoint') return { type: 'inspectionPoint', id: currentInspectionPointId.value ?? 'IP-E3' }
    if (viewMode.value === 'dock') return { type: 'dock', id: currentDockId.value ?? 'D-01' }
    if (viewMode.value === 'alert') return { type: 'alert', id: currentAlertId.value ?? 'A-01' }
    return { type: 'global', id: 'global' }
  })

  const currentRobot = computed(() => vm.value.robots.find((robot) => robot.id === currentRobotId.value) ?? vm.value.robots[0])
  const currentTask = computed(() => raw.value.tasks[currentTaskId.value] ?? raw.value.tasks['T-01'])
  const currentAlert = computed(() => vm.value.alerts.find((alert) => alert.id === currentAlertId.value) ?? vm.value.alerts[0])
  const currentDock = computed(() => vm.value.docks.find((dock) => dock.id === currentDockId.value) ?? vm.value.docks[0])
  const currentPoint = computed(() => vm.value.points.find((point) => point.id === currentInspectionPointId.value) ?? vm.value.points[0])
  const headerContext = computed(() => {
    if (viewMode.value === 'robot') return `巡检追踪: ${currentRobotId.value}`
    if (viewMode.value === 'inspectionPoint') return `巡检点详情: ${currentInspectionPointId.value}`
    if (viewMode.value === 'alert') return `异常聚焦处置: ${currentAlertId.value}`
    if (viewMode.value === 'dock') return `场站设施: ${currentDockId.value}`
    if (viewMode.value === 'ap') return 'AP 设备详情'
    return '当前视角: 全局场站总览'
  })

  const setFocus = (type: ViewMode, id: string) => {
    viewMode.value = type
    if (type === 'robot') {
      currentRobotId.value = id
      const robot = vm.value.robots.find((item) => item.id === id)
      currentTaskId.value = robot?.taskId ?? currentTaskId.value
    }
    if (type === 'inspectionPoint') currentInspectionPointId.value = id
    if (type === 'alert') currentAlertId.value = id
    if (type === 'dock') currentDockId.value = id
  }

  const resetView = () => {
    viewMode.value = 'global'
    toolbarState.value.searchOpen = false
    toolbarState.value.displayControlOpen = false
  }

  const toggleMapLayer = (key: keyof Omit<MapLayerVisibility, 'pointAreas'>) => {
    mapUi.value[key] = !mapUi.value[key]
  }

  const togglePointArea = (areaKey: string) => {
    mapUi.value.pointAreas[areaKey] = !mapUi.value.pointAreas[areaKey]
    if (!Object.values(mapUi.value.pointAreas).some(Boolean)) {
      mapUi.value.pointAreas[areaKey] = true
    }
  }

  const openModal = (name: ModalName, payload?: Record<string, unknown>) => {
    modalState.value[name] = true
    modalPayload.value = payload ?? {}
  }

  const closeModal = (name: ModalName) => {
    modalState.value[name] = false
    modalPayload.value = {}
  }

  const patchAlert = (alertId: string, nextState: string, nextLevel: AlertLevel) => {
    const target = raw.value.alerts.find((alert) => alert.id === alertId)
    if (!target) return
    target.state = nextState
    target.level = nextLevel
  }

  const confirmAlert = (alertId: string) => {
    patchAlert(alertId, '已发单处置', 'warn')
    closeModal('alert')
  }

  const clearAlert = (alertId: string) => {
    patchAlert(alertId, '现场已查无异常', 'safe')
    closeModal('alert')
  }

  const undoAlert = (alertId: string) => {
    patchAlert(alertId, '待复核', 'danger')
  }

  const tickAutoplay = () => {
    const robots = vm.value.robots.filter((robot) => robot.taskId)
    if (!robots.length) return
    autoplayIndex.value = (autoplayIndex.value + 1) % robots.length
    setFocus('robot', robots[autoplayIndex.value].id)
  }

  return {
    raw,
    vm,
    leadership,
    riskSummary,
    viewMode,
    currentRobotId,
    currentTaskId,
    currentAlertId,
    currentDockId,
    currentInspectionPointId,
    currentMonitorPointId,
    mapUi,
    autoplayEnabled,
    autoplayIndex,
    modalState,
    modalPayload,
    toolbarState,
    envMetricKey,
    dateRange,
    focusTarget,
    currentRobot,
    currentTask,
    currentAlert,
    currentDock,
    currentPoint,
    headerContext,
    setFocus,
    resetView,
    toggleMapLayer,
    togglePointArea,
    openModal,
    closeModal,
    confirmAlert,
    clearAlert,
    undoAlert,
    tickAutoplay
  }
})
