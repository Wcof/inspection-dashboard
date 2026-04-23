<template>
  <section class="panel-card map-panel">
    <MapToolbar
      :search-open="toolbar.searchOpen"
      :display-open="toolbar.displayControlOpen"
      :keyword="toolbar.keyword"
      :search-type="toolbar.type"
      :map-ui="mapUi"
      @toggle-search="$emit('toggle-search')"
      @toggle-display="$emit('toggle-display')"
      @update:keyword="$emit('update:keyword', $event)"
      @update:type="$emit('update:type', $event)"
      @toggle-layer="$emit('toggle-layer', $event)"
      @toggle-area="$emit('toggle-area', $event)"
      @search="$emit('search')"
      @open-control="$emit('open-control')"
      @go-cockpit="$emit('go-cockpit')"
      @reset="$emit('reset')"
    />

    <div ref="mapRef" class="map-container"></div>

    <div
      v-if="activeType !== 'global' && popupPosition.visible"
      class="map-popup-anchor"
      :style="{ left: `${popupPosition.left}px`, top: `${popupPosition.top}px` }"
    >
      <RobotPopup v-if="activeType === 'robot' && activeRobot" :robot="activeRobot" :task="currentTask" :point="currentPoint" @open-control="$emit('open-robot-control', $event)" />
      <InspectionPointPopup v-else-if="activeType === 'inspectionPoint' && activePoint" :point="activePoint" />
      <DockPopup v-else-if="activeType === 'dock' && activeDock" :dock="activeDock" />
      <ApPopup v-else-if="activeType === 'ap' && activeAp" :ap="activeAp" />
    </div>

    <div v-if="hoverCard.visible" class="hover-card" :style="{ left: `${hoverCard.x}px`, top: `${hoverCard.y}px` }">
      <div class="hover-title">{{ hoverCard.title }}</div>
      <div class="hover-body">{{ hoverCard.body }}</div>
    </div>

    <div class="overlay-panel bottom-right">
      <div class="focus-card">
        <div class="panel-subtitle">当前任务</div>
        <h3>{{ currentTask.taskName }}</h3>
        <div class="task-meta">
          <span>阶段 {{ currentTask.stage }}</span>
          <span>进度 {{ currentTask.prog }}</span>
          <span>ETA {{ currentTask.eta }}</span>
        </div>
        <button class="toolbar-btn active" @click="$emit('open-evidence')">查看巡检影像</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import MapToolbar from '@/components/map/MapToolbar.vue'
import RobotPopup from '@/components/map/RobotPopup.vue'
import InspectionPointPopup from '@/components/map/InspectionPointPopup.vue'
import DockPopup from '@/components/map/DockPopup.vue'
import ApPopup from '@/components/map/ApPopup.vue'
import type { AlertViewModel, ApDevice, CockpitFocusTarget, DockViewModel, InspectionPointViewModel, MapLayerVisibility, RobotViewModel, Task } from '@/features/cockpit/types'
import { useCockpitMap } from '@/features/cockpit/composables/useCockpitMap'
import { useMapInteractions } from '@/features/cockpit/composables/useMapInteractions'
import { DEFAULT_VIEW } from '@/features/cockpit/constants/map'

const props = defineProps<{
  toolbar: { searchOpen: boolean; displayControlOpen: boolean; keyword: string; type: string }
  mapUi: MapLayerVisibility
  focusTarget: CockpitFocusTarget
  robots: RobotViewModel[]
  points: InspectionPointViewModel[]
  docks: DockViewModel[]
  apDevices: ApDevice[]
  alerts: AlertViewModel[]
  currentRobot: RobotViewModel | null
  currentPoint: InspectionPointViewModel | null
  currentDock: DockViewModel | null
  currentAp: ApDevice | null
  currentTask: Task
}>()

const emit = defineEmits<{
  (event: 'toggle-search'): void
  (event: 'toggle-display'): void
  (event: 'update:keyword', value: string): void
  (event: 'update:type', value: string): void
  (event: 'toggle-layer', key: keyof Omit<MapLayerVisibility, 'pointAreas'>): void
  (event: 'toggle-area', area: string): void
  (event: 'search'): void
  (event: 'open-control'): void
  (event: 'go-cockpit'): void
  (event: 'reset'): void
  (event: 'open-evidence'): void
  (event: 'open-robot-control', robotId: string): void
}>()

const mapRef = ref<HTMLElement | null>(null)
const { map } = useCockpitMap(mapRef)
const interactions = useMapInteractions()
const hoverCard = ref({ visible: false, x: 0, y: 0, title: '', body: '' })
const hoverTarget = ref<{ type: 'robot' | 'inspectionPoint' | 'dock' | 'ap' | null; id: string | null }>({ type: null, id: null })
const popupPosition = ref({ visible: false, left: 0, top: 0 })

const findCoordsForTarget = (type: string, id: string | null) => {
  if (!id) return null
  if (type === 'robot') return props.robots.find((robot) => robot.id === id)?.coords ?? null
  if (type === 'inspectionPoint') return props.points.find((point) => point.id === id)?.coords ?? null
  if (type === 'dock') return props.docks.find((dock) => dock.id === id)?.coords ?? null
  if (type === 'ap') return props.apDevices.find((ap) => ap.id === id)?.coords ?? null
  return null
}

const updatePopupPosition = () => {
  const currentMap = map.value
  if (!currentMap || activeType.value === 'global') {
    popupPosition.value.visible = false
    return
  }
  const targetId =
    activeType.value === 'robot' ? activeRobot.value?.id :
    activeType.value === 'inspectionPoint' ? activePoint.value?.id :
    activeType.value === 'dock' ? activeDock.value?.id :
    activeType.value === 'ap' ? activeAp.value?.id :
    null
  const coords = findCoordsForTarget(activeType.value, targetId ?? null)
  if (!coords) {
    popupPosition.value.visible = false
    return
  }
  const projected = currentMap.project(coords)
  let left = projected.x + 20
  let top = projected.y - 180
  const mapWidth = currentMap.getContainer().clientWidth
  const mapHeight = currentMap.getContainer().clientHeight
  const popupWidth = 340
  const popupHeight = 420
  if (left + popupWidth > mapWidth - 12) left = projected.x - popupWidth - 20
  if (top < 12) top = 12
  if (top + popupHeight > mapHeight - 12) top = Math.max(12, mapHeight - popupHeight - 12)
  popupPosition.value = { visible: true, left, top }
}

onMounted(() => {
  const bindClick = (layerId: string, handler: (id: string) => void) => {
    map.value?.on('click', layerId, (event) => {
      const id = String(event.features?.[0]?.properties?.id ?? '')
      if (id) handler(id)
    })
  }

  map.value?.on('load', () => {
    bindClick('pts-robot', interactions.onRobotClick)
    bindClick('pts-target', interactions.onPointClick)
    bindClick('pts-dock', interactions.onDockClick)
    bindClick('pts-ap', interactions.onApClick)
    bindClick('alert-points', interactions.onAlertClick)
    const hoverLayers = ['pts-robot', 'pts-target', 'pts-dock', 'pts-ap', 'alert-points']
    const hoverLookup = (type: string, id: string) => {
      if (type === 'robot') {
        const found = props.robots.find((robot) => robot.id === id) ?? null
        return found ? { title: `${found.id} · ${found.label}`, body: `${found.task} · 电量 ${found.battery}%` } : null
      }
      if (type === 'target') {
        const found = props.points.find((point) => point.id === id) ?? null
        return found ? { title: found.name, body: `状态 ${found.status} · 进度 ${found.progress}` } : null
      }
      if (type === 'dock') {
        const found = props.docks.find((dock) => dock.id === id) ?? null
        return found ? { title: found.name, body: `队列 ${found.queueCount} · 电压 ${found.voltage}` } : null
      }
      if (type === 'ap') {
        const found = props.apDevices.find((ap) => ap.id === id) ?? null
        return found ? { title: found.name, body: `${found.signal} · ${found.band}` } : null
      }
      if (type === 'alert') {
        const found = props.alerts.find((alert) => alert.id === id) ?? null
        return found ? { title: `${found.loc} 告警`, body: found.defect } : null
      }
      return null
    }

    hoverLayers.forEach((layerId) => {
      map.value?.on('mouseenter', layerId, () => {
        if (map.value) {
          map.value.getCanvas().style.cursor = 'pointer'
        }
      })
      map.value?.on('mouseleave', layerId, () => {
        if (map.value) {
          map.value.getCanvas().style.cursor = ''
        }
        hoverCard.value.visible = false
        hoverTarget.value = { type: null, id: null }
      })
      map.value?.on('mousemove', layerId, (event) => {
        const feature = event.features?.[0]
        const id = String(feature?.properties?.id ?? '')
        const type = String(feature?.properties?.type ?? '')
        const target = hoverLookup(type, id)
        if (!target) {
          hoverCard.value.visible = false
          return
        }
        hoverTarget.value = {
          type: type === 'target' ? 'inspectionPoint' : (type as 'robot' | 'dock' | 'ap'),
          id
        }
        hoverCard.value = {
          visible: true,
          x: event.point.x + 24,
          y: event.point.y + 24,
          title: target.title,
          body: target.body
        }
      })
    })

    map.value?.on('click', (event) => {
      const features = map.value?.queryRenderedFeatures(event.point, { layers: ['pts-robot', 'pts-target', 'pts-dock', 'pts-ap', 'alert-points'] }) ?? []
      if (!features.length) interactions.onBlankClick()
    })
    map.value?.on('move', () => {
      updatePopupPosition()
    })
  })
})

const activeType = computed(() => {
  if (hoverCard.value.visible && hoverTarget.value.type) return hoverTarget.value.type
  if (props.focusTarget.type !== 'global') return props.focusTarget.type
  return 'global'
})
const activeRobot = computed(() => hoverTarget.value.type === 'robot' ? props.robots.find((robot) => robot.id === hoverTarget.value.id) ?? props.currentRobot : props.currentRobot)
const activePoint = computed(() => hoverTarget.value.type === 'inspectionPoint' ? props.points.find((point) => point.id === hoverTarget.value.id) ?? props.currentPoint : props.currentPoint)
const activeDock = computed(() => hoverTarget.value.type === 'dock' ? props.docks.find((dock) => dock.id === hoverTarget.value.id) ?? props.currentDock : props.currentDock)
const activeAp = computed(() => hoverTarget.value.type === 'ap' ? props.apDevices.find((ap) => ap.id === hoverTarget.value.id) ?? props.currentAp : props.currentAp)

watch(
  () => props.mapUi,
  (mapUi) => {
    const currentMap = map.value
    if (!currentMap) return
    const setVisibility = (layerId: string, visible: boolean) => {
      if (currentMap.getLayer(layerId)) {
        currentMap.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none')
      }
    }
    setVisibility('pts-robot', mapUi.robots)
    setVisibility('pts-target', mapUi.points)
    setVisibility('pts-dock', mapUi.docks)
    setVisibility('pts-ap', mapUi.points)
    setVisibility('alert-points', mapUi.points)
    setVisibility('layer-with-pulsing-dot', mapUi.points)
    setVisibility('route-backbone', mapUi.route && mapUi.robots && mapUi.points)
    setVisibility('route-plan-all', mapUi.route && mapUi.robots && mapUi.points)
    setVisibility('route-active', mapUi.route && mapUi.robots && mapUi.points)
    setVisibility('route-future', mapUi.route && mapUi.robots && mapUi.points)
    setVisibility('route-target', mapUi.route && mapUi.robots && mapUi.points)
    setVisibility('pts-robot-label', mapUi.labels && mapUi.robots)
    setVisibility('pts-target-label', mapUi.labels && mapUi.points)
    setVisibility('pts-dock-label', mapUi.labels && mapUi.docks)
    setVisibility('pts-ap-label', mapUi.labels && mapUi.points)
  },
  { deep: true, immediate: true }
)

watch(
  () => props.focusTarget,
  (focusTarget) => {
    const currentMap = map.value
    if (!currentMap) return
    if (focusTarget.type === 'global') {
      currentMap.easeTo({ center: DEFAULT_VIEW.center, zoom: DEFAULT_VIEW.zoom, pitch: DEFAULT_VIEW.pitch, bearing: DEFAULT_VIEW.bearing })
      return
    }
    const coords =
      focusTarget.type === 'robot' ? props.currentRobot?.coords :
      focusTarget.type === 'inspectionPoint' ? props.currentPoint?.coords :
      focusTarget.type === 'dock' ? props.currentDock?.coords :
      focusTarget.type === 'ap' ? props.currentAp?.coords :
      null
    if (coords) {
      currentMap.easeTo({ center: coords, zoom: 18.2, pitch: 0, bearing: 0 })
    }
    window.setTimeout(updatePopupPosition, 380)
  },
  { deep: true, immediate: true }
)

watch([activeType, activeRobot, activePoint, activeDock, activeAp], () => {
  updatePopupPosition()
})

void emit
</script>

<style scoped lang="scss">
.map-panel {
  position: relative;
  min-height: 580px;
  overflow: hidden;
}

.map-container {
  min-height: 580px;
}

.map-popup-anchor {
  position: absolute;
  z-index: 15;
}

.hover-card {
  position: absolute;
  z-index: 25;
  max-width: 280px;
  pointer-events: none;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(197, 168, 123, 0.35);
  background: rgba(8, 16, 30, 0.92);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
}

.hover-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
}

.hover-body {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-sub);
}

.overlay-panel.bottom-right {
  right: 18px;
  bottom: 18px;
  width: 360px;
}

.focus-card {
  padding: 16px;
  border-radius: 18px;
  background: rgba(8, 16, 30, 0.94);
  border: 1px solid var(--border-focus);
}

.focus-card h3 {
  margin: 6px 0 10px;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
  color: var(--text-sub);
}

@media (max-width: 1100px) {
  .overlay-panel.bottom-right {
    position: static;
    width: auto;
    margin: 16px;
  }
}
</style>
