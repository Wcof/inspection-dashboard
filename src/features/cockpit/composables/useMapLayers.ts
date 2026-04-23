import { computed } from 'vue'
import type { Feature, FeatureCollection, LineString, Point } from 'geojson'
import { useCockpitStore } from '@/features/cockpit/store/cockpit'

export const useMapLayers = () => {
  const store = useCockpitStore()
  const shortenPointName = (name: string) => {
    const core = String(name).replace(/区|点|#|高压柜|冷凝塔|主门|入闸|换热阀/g, '')
    const simple = core.trim() || name
    return simple.length > 4 ? simple.slice(0, 4) : simple
  }
  const pointVisitStats = (pointId: string) => {
    const point = store.raw.inspectionPoints.find((item) => item.id === pointId)
    const base = point?.status === 'pending' ? 0 : point?.status === 'running' ? 2 : 3
    const normal = 2 + base
    const temporary = point?.status === 'warn' || point?.status === 'danger' ? 2 : 1
    return { total: normal + temporary, normal, temporary }
  }

  const businessFeatures = computed<FeatureCollection<Point>>(() => {
    const features: Feature<Point>[] = []

    if (store.mapUi.robots) {
      store.vm.robots.forEach((robot) => {
        features.push({
          type: 'Feature',
          properties: {
            type: 'robot',
            id: robot.id,
            labelText: `${robot.id} ${robot.speedKmh.toFixed(0)}km/h\n${robot.task.replace(/^.\区\|/, '').slice(0, 8)}`,
            bizStatus: robot.bizStatus
          },
          geometry: { type: 'Point', coordinates: robot.coords }
        })
      })
    }

    if (store.mapUi.points) {
      store.vm.points.filter((point) => store.mapUi.pointAreas[point.areaKey]).forEach((point) => {
        const visit = pointVisitStats(point.id)
        const statusLabel = point.status === 'running' ? '已巡' : point.status === 'pending' ? '未巡' : '异常'
        features.push({
          type: 'Feature',
          properties: {
            type: 'target',
            id: point.id,
            labelText: `${shortenPointName(point.name)}\n今计${visit.total} / 已巡${visit.normal} / ${statusLabel}`,
            status: point.status
          },
          geometry: { type: 'Point', coordinates: point.coords }
        })
      })
    }

    if (store.mapUi.docks) {
      store.vm.docks.forEach((dock) => {
        features.push({
          type: 'Feature',
          properties: {
            type: 'dock',
            id: dock.id,
            labelText: `${dock.id} 充${dock.chargingCount} 停${dock.parkedCount}`,
            status: dock.status
          },
          geometry: { type: 'Point', coordinates: dock.coords }
        })
      })
    }

    store.vm.apDevices.filter((ap) => store.mapUi.pointAreas[ap.area]).forEach((ap) => {
      features.push({
        type: 'Feature',
        properties: { type: 'ap', id: ap.id, labelText: `${ap.id}\n${ap.signal}`, status: ap.status },
        geometry: { type: 'Point', coordinates: ap.coords }
      })
    })

    return { type: 'FeatureCollection', features }
  })

  const routeFeatures = computed<FeatureCollection<LineString>>(() => {
    const features: Feature<LineString>[] = []
    if (!store.mapUi.route) return { type: 'FeatureCollection', features }

    features.push({
      type: 'Feature',
      properties: { type: 'backbone' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [121.470008, 31.230816],
          [121.477872, 31.230816]
        ]
      }
    })

    const tasks = Object.values(store.raw.tasks)
    const inGlobal = store.focusTarget.type === 'global'

    const pushTaskRoute = (task: (typeof tasks)[number]) => {
      if (task.path.length > 1) {
        features.push({
          type: 'Feature',
          properties: { type: 'active' },
          geometry: { type: 'LineString', coordinates: task.path }
        })
      }
      const planAll = [...task.path, ...task.futurePath.slice(1)]
      if (planAll.length > 1) {
        features.push({
          type: 'Feature',
          properties: { type: 'plan-all' },
          geometry: { type: 'LineString', coordinates: planAll }
        })
      }
      if (task.futurePath.length > 1) {
        features.push({
          type: 'Feature',
          properties: { type: 'future' },
          geometry: { type: 'LineString', coordinates: task.futurePath }
        })
      }
      if (task.targetLine.length > 1) {
        features.push({
          type: 'Feature',
          properties: { type: 'target-line' },
          geometry: { type: 'LineString', coordinates: task.targetLine }
        })
      }
    }

    if (inGlobal) {
      tasks.forEach(pushTaskRoute)
    } else if (store.currentTask) {
      pushTaskRoute(store.currentTask)
    }

    return { type: 'FeatureCollection', features }
  })

  const alertFeatures = computed<FeatureCollection<Point>>(() => ({
    type: 'FeatureCollection',
    features: store.vm.alerts.map((alert) => ({
      type: 'Feature',
      properties: { id: alert.id, type: 'alert' },
      geometry: { type: 'Point', coordinates: alert.coords }
    }))
  }))

  return {
    businessFeatures,
    routeFeatures,
    alertFeatures
  }
}
