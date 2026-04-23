export const MAP_STYLE_URL = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

export const SITE_IMAGE_COORDS: [[number, number], [number, number], [number, number], [number, number]] = [
  [121.4688, 31.2356],
  [121.4794, 31.2356],
  [121.4794, 31.2264],
  [121.4688, 31.2264]
]

export const SITE_VIEW_BOUNDS: [[number, number], [number, number]] = [
  [SITE_IMAGE_COORDS[0][0], SITE_IMAGE_COORDS[2][1]],
  [SITE_IMAGE_COORDS[1][0], SITE_IMAGE_COORDS[0][1]]
]

export const DEFAULT_VIEW = {
  center: [121.4741, 31.231] as [number, number],
  zoom: 17.15,
  pitch: 0,
  bearing: 0
}

export const siteCoord = (x: number, y: number): [number, number] => {
  const left = SITE_IMAGE_COORDS[0][0]
  const right = SITE_IMAGE_COORDS[1][0]
  const top = SITE_IMAGE_COORDS[0][1]
  const bottom = SITE_IMAGE_COORDS[2][1]

  return [
    Number((left + (right - left) * x).toFixed(6)),
    Number((top - (top - bottom) * y).toFixed(6))
  ]
}
