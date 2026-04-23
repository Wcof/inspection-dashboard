import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl'
import { DEFAULT_VIEW, MAP_STYLE_URL, SITE_IMAGE_COORDS, SITE_VIEW_BOUNDS } from '@/features/cockpit/constants/map'
import { siteMapUrl } from '@/mocks/cockpit.mock'
import { useMapLayers } from './useMapLayers'

export const useCockpitMap = (containerRef: Ref<HTMLElement | null>) => {
  const map = ref<MapLibreMap | null>(null)
  const { businessFeatures, routeFeatures, alertFeatures } = useMapLayers()

  onMounted(() => {
    if (!containerRef.value) return
    const currentMap = new maplibregl.Map({
      container: containerRef.value,
      style: MAP_STYLE_URL,
      center: DEFAULT_VIEW.center,
      zoom: DEFAULT_VIEW.zoom,
      pitch: DEFAULT_VIEW.pitch,
      bearing: DEFAULT_VIEW.bearing,
      dragRotate: false
    })
    map.value = currentMap

    currentMap.on('load', () => {
      const size = 60
      const pulsingDot: any = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        context: null as CanvasRenderingContext2D | null,
        onAdd() {
          const canvas = document.createElement('canvas')
          canvas.width = size
          canvas.height = size
          this.context = canvas.getContext('2d')
        },
        render() {
          const duration = 2000
          const t = (performance.now() % duration) / duration
          const radius = (size / 2) * 0.2
          const outerRadius = (size / 2) * 0.6 * t + radius
          const ctx = this.context
          if (!ctx) return false
          ctx.clearRect(0, 0, size, size)
          ctx.beginPath()
          ctx.arc(size / 2, size / 2, outerRadius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 107, 120, ${0.6 - t * 0.6})`
          ctx.fill()
          ctx.beginPath()
          ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2)
          ctx.fillStyle = '#ff6b78'
          ctx.fill()
          this.data = ctx.getImageData(0, 0, size, size).data as unknown as Uint8Array
          currentMap.triggerRepaint()
          return true
        }
      }
      if (!currentMap.hasImage('pulsing-dot')) {
        currentMap.addImage('pulsing-dot', pulsingDot as never, { pixelRatio: 2 })
      }

      currentMap.setMaxBounds([
        [SITE_VIEW_BOUNDS[0][0] - 0.0024, SITE_VIEW_BOUNDS[0][1] - 0.0016],
        [SITE_VIEW_BOUNDS[1][0] + 0.0024, SITE_VIEW_BOUNDS[1][1] + 0.0016]
      ])

      currentMap.addSource('site-background', {
        type: 'image',
        url: siteMapUrl,
        coordinates: SITE_IMAGE_COORDS
      })
      currentMap.addSource('business-layers', { type: 'geojson', data: businessFeatures.value })
      currentMap.addSource('patrol-paths', { type: 'geojson', data: routeFeatures.value })
      currentMap.addSource('alerts', { type: 'geojson', data: alertFeatures.value })

      currentMap.addLayer({ id: 'site-background-layer', type: 'raster', source: 'site-background' } as never)
      currentMap.addLayer({ id: 'route-backbone', type: 'line', source: 'patrol-paths', filter: ['==', ['get', 'type'], 'backbone'], paint: { 'line-color': '#3b4b5e', 'line-width': 1, 'line-opacity': 0.5 } } as never)
      currentMap.addLayer({ id: 'route-plan-all', type: 'line', source: 'patrol-paths', filter: ['==', ['get', 'type'], 'plan-all'], paint: { 'line-color': '#8ca0b9', 'line-width': 1.6, 'line-dasharray': [1, 2.2], 'line-opacity': 0.42 } } as never)
      currentMap.addLayer({ id: 'route-active', type: 'line', source: 'patrol-paths', filter: ['==', ['get', 'type'], 'active'], paint: { 'line-color': '#c5a87b', 'line-width': 3, 'line-opacity': 0.9 } } as never)
      currentMap.addLayer({ id: 'route-future', type: 'line', source: 'patrol-paths', filter: ['==', ['get', 'type'], 'future'], paint: { 'line-color': '#6f9dcc', 'line-width': 2, 'line-dasharray': [1, 2], 'line-opacity': 0.8 } } as never)
      currentMap.addLayer({ id: 'route-target', type: 'line', source: 'patrol-paths', filter: ['==', ['get', 'type'], 'target-line'], paint: { 'line-color': '#ff6b78', 'line-width': 2, 'line-dasharray': [2, 2], 'line-opacity': 0.6 } } as never)
      currentMap.addLayer({ id: 'pts-target', type: 'circle', source: 'business-layers', filter: ['==', ['get', 'type'], 'target'], paint: { 'circle-radius': 7, 'circle-color': ['match', ['get', 'status'], 'warn', '#f7bd54', 'danger', '#ff6b78', 'pending', '#59a8ff', '#2ed49b'], 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2 } } as never)
      currentMap.addLayer({ id: 'pts-dock', type: 'circle', source: 'business-layers', filter: ['==', ['get', 'type'], 'dock'], paint: { 'circle-radius': 8, 'circle-color': ['match', ['get', 'status'], 'charging', '#59a8ff', '#2ed49b'], 'circle-stroke-color': '#08101d', 'circle-stroke-width': 2 } } as never)
      currentMap.addLayer({ id: 'pts-ap', type: 'circle', source: 'business-layers', filter: ['==', ['get', 'type'], 'ap'], paint: { 'circle-radius': 6, 'circle-color': ['match', ['get', 'status'], 'danger', '#ff6b78', '#2ed49b'] } } as never)
      currentMap.addLayer({ id: 'pts-robot', type: 'circle', source: 'business-layers', filter: ['==', ['get', 'type'], 'robot'], paint: { 'circle-radius': 9, 'circle-color': ['match', ['get', 'bizStatus'], 'charging', '#59a8ff', 'returning', '#f7bd54', '#2ed49b'], 'circle-stroke-width': 3, 'circle-stroke-color': '#f5f7fb' } } as never)
      currentMap.addLayer({ id: 'pts-target-label', type: 'symbol', source: 'business-layers', filter: ['==', ['get', 'type'], 'target'], layout: { 'text-field': ['get', 'labelText'], 'text-size': 10.5, 'text-offset': [0, 1.35], 'text-anchor': 'top', 'text-allow-overlap': true }, paint: { 'text-color': '#e2e8f0', 'text-halo-color': 'rgba(5,8,14,0.95)', 'text-halo-width': 1.2 } } as never)
      currentMap.addLayer({ id: 'pts-robot-label', type: 'symbol', source: 'business-layers', filter: ['==', ['get', 'type'], 'robot'], layout: { 'text-field': ['get', 'labelText'], 'text-size': 11, 'text-offset': [0, 1.4], 'text-anchor': 'top', 'text-allow-overlap': true }, paint: { 'text-color': '#e2e8f0', 'text-halo-color': 'rgba(5,8,14,0.95)', 'text-halo-width': 1.2 } } as never)
      currentMap.addLayer({ id: 'pts-dock-label', type: 'symbol', source: 'business-layers', filter: ['==', ['get', 'type'], 'dock'], layout: { 'text-field': ['get', 'labelText'], 'text-size': 10.5, 'text-offset': [0, 1.35], 'text-anchor': 'top', 'text-allow-overlap': true }, paint: { 'text-color': '#9ac7ff', 'text-halo-color': 'rgba(5,8,14,0.95)', 'text-halo-width': 1.2 } } as never)
      currentMap.addLayer({ id: 'pts-ap-label', type: 'symbol', source: 'business-layers', filter: ['==', ['get', 'type'], 'ap'], layout: { 'text-field': ['get', 'labelText'], 'text-size': 10.5, 'text-offset': [0, 1.35], 'text-anchor': 'top', 'text-allow-overlap': true }, paint: { 'text-color': '#dbeafe', 'text-halo-color': 'rgba(5,8,14,0.95)', 'text-halo-width': 1.2 } } as never)
      currentMap.addLayer({ id: 'alert-points', type: 'circle', source: 'alerts', paint: { 'circle-radius': 10, 'circle-color': '#ff6b78', 'circle-opacity': 0.24, 'circle-stroke-color': '#ff6b78', 'circle-stroke-width': 1.5 } } as never)
      currentMap.addLayer({ id: 'layer-with-pulsing-dot', type: 'symbol', source: 'alerts', layout: { 'icon-image': 'pulsing-dot', 'icon-allow-overlap': true } } as never)
    })
  })

  watch(businessFeatures, (value) => {
    const source = map.value?.getSource('business-layers') as maplibregl.GeoJSONSource | undefined
    source?.setData(value)
  })

  watch(routeFeatures, (value) => {
    const source = map.value?.getSource('patrol-paths') as maplibregl.GeoJSONSource | undefined
    source?.setData(value)
  })

  watch(alertFeatures, (value) => {
    const source = map.value?.getSource('alerts') as maplibregl.GeoJSONSource | undefined
    source?.setData(value)
  })

  onBeforeUnmount(() => {
    map.value?.remove()
  })

  return {
    map
  }
}
