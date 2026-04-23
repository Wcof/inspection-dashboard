export type ViewMode = 'global' | 'robot' | 'inspectionPoint' | 'alert' | 'dock' | 'ap'
export type RobotStatus = 'safe' | 'warn' | 'danger' | 'charging'
export type PointStatus = 'running' | 'pending' | 'warn' | 'danger' | 'completed'
export type AlertLevel = 'safe' | 'warn' | 'danger'
export type DockStatus = 'safe' | 'charging'
export type ModalName = 'evidence' | 'alert' | 'envMetric' | 'robotControl'

export interface MetricHistory {
  icon: string
  label: string
  value: string
  history: string[]
}

export interface MonitorPoint {
  id: string
  name: string
  progress: string
  metrics: Record<string, MetricHistory>
}

export interface InspectionPoint {
  id: string
  name: string
  status: PointStatus
  progress: string
  taskId: string
  coords: [number, number]
  monitorPoints: MonitorPoint[]
}

export interface Robot {
  id: string
  status: RobotStatus
  label: string
  task: string
  battery: number
  coords: [number, number]
  taskId: string | null
  robotType: string
}

export interface TimelineNode {
  time: string
  name: string
  res: string
  status: 'safe' | 'warn' | 'danger' | 'active' | 'future'
  pos: string
  coords: [number, number]
  alertId?: string
}

export interface Task {
  bot: string
  bgImg: string
  taskName: string
  state: string
  type: string
  region: string
  stage: string
  cov: string
  inspected: number
  anomaly: number
  highRisk: number
  review: number
  prog: string
  eta: string
  bar: string
  targetCoords: [number, number]
  robotCoords: [number, number]
  path: [number, number][]
  futurePath: [number, number][]
  targetLine: [number, number][]
  aimSafe: boolean
  targetLabel: string
  eviResult: string
  eviClass: string
  timeline: {
    title: string
    nodes: TimelineNode[]
  }
}

export interface Alert {
  id: string
  bgImg: string
  time: string
  level: AlertLevel
  state: string
  device: string
  loc: string
  defect: string
  taskId: string
  coords: [number, number]
  aimSafe: boolean
  targetLabel: string
  eviResult: string
  eviClass: string
  lastTime: string
  lastResult: string
  comp: string
}

export interface Dock {
  id: string
  name: string
  status: DockStatus
  bot: string
  lastRobot: string
  voltage: string
  totalCharges: number
  fullNotLeave: number
  queueCount: number
  facadeImg: string
  coords: [number, number]
}

export interface ApDevice {
  id: string
  name: string
  area: string
  status: AlertLevel
  signal: string
  channel: string
  band: string
  users: number
  uptime: string
  coords: [number, number]
}

export interface BroadcastItem {
  id: string
  text: string
  type: 'normal' | 'alert'
}

export interface WeatherSnapshot {
  condition: string
  temp: number
  wind: string
  humidity: number
}

export interface AttachmentSummaryBase {
  gasSensors: { total: number; normal: number; offline: number }
  gimbals: { total: number; normal: number; offline: number }
}

export interface CockpitRawData {
  robots: Robot[]
  tasks: Record<string, Task>
  alerts: Alert[]
  docks: Dock[]
  apDevices: ApDevice[]
  inspectionPoints: InspectionPoint[]
  weather: WeatherSnapshot
  attachmentSummary: AttachmentSummaryBase
}

export interface MapLayerVisibility {
  labels: boolean
  robots: boolean
  points: boolean
  docks: boolean
  route: boolean
  pointAreas: Record<string, boolean>
}

export interface CockpitFocusTarget {
  type: ViewMode
  id: string
}

export interface ModalStateMap {
  evidence: boolean
  alert: boolean
  envMetric: boolean
  robotControl: boolean
}

export interface CockpitViewModel {
  header: {
    title: string
    subtitle: string
    context: string
  }
  robots: RobotViewModel[]
  points: InspectionPointViewModel[]
  alerts: AlertViewModel[]
  docks: DockViewModel[]
  apDevices: ApDevice[]
  broadcasts: BroadcastItem[]
  summary: {
    totalRobots: number
    totalRuntimeHours: number
    todayTasks: number
    executedTaskTotal: number
    safetyDays: string
  }
}

export interface RobotViewModel extends Robot {
  bizStatus: 'executing' | 'returning' | 'charging'
  speedKmh: number
}

export interface InspectionPointViewModel extends InspectionPoint {
  areaKey: string
}

export interface AlertViewModel extends Alert {
  category: 'infrared' | 'device' | 'gas' | 'safeBehavior'
}

export interface DockViewModel extends Dock {
  chargingCount: number
  parkedCount: number
}
