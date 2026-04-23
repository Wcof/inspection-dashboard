import type {
  Alert,
  AlertViewModel,
  BroadcastItem,
  CockpitRawData,
  CockpitViewModel,
  Dock,
  DockViewModel,
  InspectionPoint,
  InspectionPointViewModel,
  Robot,
  RobotViewModel
} from '@/features/cockpit/types'
import { toNumberFromText } from '@/shared/utils/format'

const getRobotBizStatus = (robot: Robot): RobotViewModel['bizStatus'] => {
  if (robot.status === 'charging') return 'charging'
  if (robot.label.includes('返航') || robot.status === 'warn' || robot.status === 'danger') return 'returning'
  return 'executing'
}

const getRobotSpeedKmh = (robot: Robot) => {
  const biz = getRobotBizStatus(robot)
  if (biz === 'executing') return 6 + (robot.battery % 4)
  if (biz === 'returning') return 4 + (robot.battery % 3)
  return 0
}

const getPointAreaKey = (point: InspectionPoint) => {
  const text = `${point.name}${point.id}`
  if (/A区|IP-A/i.test(text)) return 'A'
  if (/B区|IP-B/i.test(text)) return 'B'
  return 'C'
}

const classifyRiskCategory = (alert: Alert): AlertViewModel['category'] => {
  if (/气体|压力/.test(alert.defect)) return 'gas'
  if (/行为|门禁/.test(alert.defect)) return 'safeBehavior'
  if (/热成像|高温/.test(alert.defect)) return 'infrared'
  return 'device'
}

const getDockView = (dock: Dock): DockViewModel => ({
  ...dock,
  chargingCount: dock.status === 'charging' ? 1 : 0,
  parkedCount: dock.status === 'safe' ? 1 : 0
})

export const buildBroadcasts = (raw: CockpitRawData): BroadcastItem[] => {
  const alertMessages = raw.alerts.map((alert) => ({
    id: alert.id,
    text: `${alert.time} ${alert.loc} ${alert.device} ${alert.defect}`,
    type: 'alert' as const
  }))

  const normalMessages = raw.robots.map((robot) => ({
    id: `robot-${robot.id}`,
    text: `${robot.id} 当前状态 ${robot.label}，电量 ${robot.battery}%`,
    type: 'normal' as const
  }))

  return [...alertMessages, ...normalMessages]
}

export const buildViewModel = (raw: CockpitRawData): CockpitViewModel => {
  const robots: RobotViewModel[] = raw.robots.map((robot) => ({
    ...robot,
    bizStatus: getRobotBizStatus(robot),
    speedKmh: getRobotSpeedKmh(robot)
  }))

  const points: InspectionPointViewModel[] = raw.inspectionPoints.map((point) => ({
    ...point,
    areaKey: getPointAreaKey(point)
  }))

  const alerts: AlertViewModel[] = raw.alerts.map((alert) => ({
    ...alert,
    category: classifyRiskCategory(alert)
  }))

  const docks: DockViewModel[] = raw.docks.map(getDockView)

  return {
    header: {
      title: '智能巡检机器人指挥中心',
      subtitle: '极客光年 | 智能巡检指挥中枢',
      context: '当前视角: 全局场站总览'
    },
    robots,
    points,
    alerts,
    docks,
    apDevices: raw.apDevices,
    broadcasts: buildBroadcasts(raw),
    summary: {
      totalRobots: robots.length,
      totalRuntimeHours: 1258,
      todayTasks: 26,
      executedTaskTotal: 184,
      safetyDays: '128天'
    }
  }
}

export const computeRiskSummary = (alerts: AlertViewModel[]) => {
  return alerts.reduce(
    (acc, alert) => {
      acc.total += 1
      acc[alert.category] += 1
      return acc
    },
    { total: 0, infrared: 0, device: 0, gas: 0, safeBehavior: 0 }
  )
}

export const computeLeadershipSummary = (raw: CockpitRawData) => {
  const pointCoverage = Math.round((raw.inspectionPoints.filter((point) => point.status !== 'pending').length / raw.inspectionPoints.length) * 100)
  const detectionItemCount = raw.inspectionPoints.reduce((sum, point) => sum + Object.keys(point.monitorPoints[0]?.metrics ?? {}).length, 0)

  return {
    planSummary: [
      { label: '巡检点次', value: '20', meta: '今日累计' },
      { label: '已巡检里程', value: '326km', meta: '巡检里程' },
      { label: '覆盖率', value: `${pointCoverage}%`, meta: '当日覆盖' },
      { label: '检测项', value: String(detectionItemCount), meta: '检测项数量' },
      { label: '设施设备数', value: String(raw.docks.length + raw.inspectionPoints.length + 8), meta: '纳管设备' },
      { label: '异常数', value: String(raw.alerts.length), meta: '待跟踪项' }
    ],
    robotSummary: [
      { label: '执行中 / 返航中', value: '2/2', meta: '当前状态' },
      { label: '充电中', value: '1', meta: '充电状态' },
      { label: '临时任务', value: '3', meta: '临时插单' },
      { label: '机器人总数', value: String(raw.robots.length), meta: '在册机器人' },
      { label: '今日里程', value: '286km', meta: '总里程 18650km' },
      { label: '平均时速', value: '8km/h', meta: '当日均值' }
    ],
    facilitySummary: [
      { label: '温度计', value: '12', meta: '异常 0' },
      { label: '直流阀', value: '28', meta: '异常 0' },
      { label: '交流柜', value: '16', meta: '异常 0' },
      { label: 'AP设备', value: '9', meta: '异常 1' }
    ],
    envSummary: ['O2', 'CH4', 'CO', 'H2S'].map((key) => {
      const metrics = raw.inspectionPoints[0]?.monitorPoints[0]?.metrics ?? {}
      return {
        key,
        label: metrics[key]?.label ?? key,
        machine: Math.max(0, Math.round(toNumberFromText(metrics[key]?.value) % 4)),
        remote: Math.max(1, Math.round((toNumberFromText(metrics[key]?.value) + 2) % 6)),
        maxValue: metrics[key]?.value ?? '--'
      }
    })
  }
}
