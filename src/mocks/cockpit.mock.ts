import siteMapImage from '@/assets/images/地图.png'
import type { CockpitRawData } from '@/features/cockpit/types'
import { siteCoord } from '@/features/cockpit/constants/map'

const makeMockImg = (title: string, c1: string, c2: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="${c1}" offset="0%"/>
          <stop stop-color="${c2}" offset="100%"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="48%" text-anchor="middle" font-size="48" fill="rgba(255,255,255,0.9)" font-family="Arial">${title}</text>
      <text x="50%" y="58%" text-anchor="middle" font-size="22" fill="rgba(255,255,255,0.55)" font-family="Arial">Geek Lightyear Inspection Feed</text>
    </svg>
  `

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const pointCoords = {
  'IP-E3': siteCoord(0.72, 0.57),
  'IP-E5': siteCoord(0.84, 0.68),
  'IP-B1': siteCoord(0.21, 0.63),
  'IP-B3': siteCoord(0.57, 0.56)
}

export const cockpitMock: CockpitRawData = {
  weather: { condition: '晴', temp: 26, wind: '东南风2级', humidity: 58 },
  attachmentSummary: {
    gasSensors: { total: 24, normal: 22, offline: 2 },
    gimbals: { total: 10, normal: 9, offline: 1 }
  },
  robots: [
    { id: 'R-07', status: 'safe', label: '执行中', task: 'E区|动力站房特巡', battery: 82, coords: siteCoord(0.67, 0.58), taskId: 'T-01', robotType: '四轮' },
    { id: 'R-12', status: 'safe', label: '执行中', task: 'B区|例行安防', battery: 65, coords: siteCoord(0.43, 0.56), taskId: 'T-02', robotType: '履带' },
    { id: 'R-02', status: 'warn', label: '返航中', task: '返回C区基站', battery: 15, coords: siteCoord(0.58, 0.71), taskId: null, robotType: '滑轨' },
    { id: 'R-11', status: 'charging', label: '充电中', task: 'A区充换站|待命', battery: 100, coords: siteCoord(0.16, 0.36), taskId: null, robotType: '四轮' },
    { id: 'R-05', status: 'danger', label: '故障', task: '底盘驱动脱机', battery: 45, coords: siteCoord(0.46, 0.74), taskId: null, robotType: '履带' }
  ],
  inspectionPoints: [
    {
      id: 'IP-E3',
      name: 'E区-3#高压柜',
      status: 'running',
      progress: '68%',
      taskId: 'T-01',
      coords: pointCoords['IP-E3'],
      monitorPoints: [{ id: 'MP-E3-ENV', name: '环境监测', progress: '68%', metrics: { O2: { icon: 'O₂', label: '氧气浓度', value: '20.5%', history: ['20.4%', '20.3%', '20.2%'] }, CH4: { icon: 'CH₄', label: '甲烷泄漏', value: '1%LEL', history: ['0.8%LEL', '0.5%LEL', '0.3%LEL'] }, CO: { icon: 'CO', label: '一氧化碳', value: '0ppm', history: ['0ppm', '0ppm', '0ppm'] }, H2S: { icon: 'H₂S', label: '硫化氢', value: '1ppm', history: ['1ppm', '0ppm', '0ppm'] } } }]
    },
    {
      id: 'IP-E5',
      name: 'E区-5#冷凝塔',
      status: 'pending',
      progress: '10%',
      taskId: 'T-01',
      coords: pointCoords['IP-E5'],
      monitorPoints: [{ id: 'MP-E5-ENV', name: '环境监测', progress: '10%', metrics: { O2: { icon: 'O₂', label: '氧气浓度', value: '20.9%', history: ['20.8%', '20.8%', '20.7%'] }, CH4: { icon: 'CH₄', label: '甲烷泄漏', value: '0%LEL', history: ['0%LEL', '0%LEL', '0%LEL'] }, CO: { icon: 'CO', label: '一氧化碳', value: '0ppm', history: ['0ppm', '0ppm', '0ppm'] }, H2S: { icon: 'H₂S', label: '硫化氢', value: '0ppm', history: ['0ppm', '0ppm', '0ppm'] } } }]
    },
    {
      id: 'IP-B1',
      name: 'B区主门入闸点',
      status: 'running',
      progress: '60%',
      taskId: 'T-02',
      coords: pointCoords['IP-B1'],
      monitorPoints: [{ id: 'MP-B1-ENV', name: '环境监测', progress: '60%', metrics: { O2: { icon: 'O₂', label: '氧气浓度', value: '20.6%', history: ['20.5%', '20.5%', '20.4%'] }, CH4: { icon: 'CH₄', label: '甲烷泄漏', value: '1%LEL', history: ['1%LEL', '1%LEL', '0.8%LEL'] }, CO: { icon: 'CO', label: '一氧化碳', value: '0ppm', history: ['0ppm', '0ppm', '0ppm'] }, H2S: { icon: 'H₂S', label: '硫化氢', value: '0ppm', history: ['0ppm', '0ppm', '0ppm'] } } }]
    },
    {
      id: 'IP-B3',
      name: 'B区换热阀',
      status: 'warn',
      progress: '55%',
      taskId: 'T-02',
      coords: pointCoords['IP-B3'],
      monitorPoints: [{ id: 'MP-B3-ENV', name: '环境监测', progress: '55%', metrics: { O2: { icon: 'O₂', label: '氧气浓度', value: '20.4%', history: ['20.5%', '20.4%', '20.4%'] }, CH4: { icon: 'CH₄', label: '甲烷泄漏', value: '0%LEL', history: ['0%LEL', '0%LEL', '0%LEL'] }, CO: { icon: 'CO', label: '一氧化碳', value: '0ppm', history: ['0ppm', '0ppm', '0ppm'] }, H2S: { icon: 'H₂S', label: '硫化氢', value: '0ppm', history: ['0ppm', '0ppm', '0ppm'] } } }]
    }
  ],
  tasks: {
    'T-01': {
      bot: 'R-07',
      bgImg: makeMockImg('Task T-01', '#16212f', '#274764'),
      taskName: '动力站房综合特巡',
      state: 'running',
      type: '例行防爆',
      region: 'E区',
      stage: '检测 3# 点',
      cov: '85%',
      inspected: 142,
      anomaly: 1,
      highRisk: 0,
      review: 2,
      prog: '33%',
      eta: '14m',
      bar: '33%',
      targetCoords: siteCoord(0.84, 0.63),
      robotCoords: siteCoord(0.67, 0.58),
      path: [siteCoord(0.35, 0.48), siteCoord(0.53, 0.48), siteCoord(0.67, 0.58)],
      futurePath: [siteCoord(0.67, 0.58), siteCoord(0.84, 0.63), pointCoords['IP-E5']],
      targetLine: [siteCoord(0.67, 0.58), siteCoord(0.84, 0.63)],
      aimSafe: true,
      targetLabel: '2#高压机组',
      eviResult: '自动识别: 未见表面裂纹及发热',
      eviClass: 'safe-txt',
      timeline: {
        title: '当前执行：动力站房全域防爆巡检 (R-07)',
        nodes: [
          { time: '09:50', name: '门禁', res: '✓', status: 'safe', pos: '15%', coords: siteCoord(0.35, 0.48) },
          { time: '10:15', name: '配电', res: '✓', status: 'safe', pos: '35%', coords: siteCoord(0.53, 0.48) },
          { time: '10:32', name: '机组', res: '✖ 异响', status: 'danger', pos: '55%', coords: pointCoords['IP-E3'], alertId: 'A-01' },
          { time: '前往中(ETA 2m)', name: '变压器', res: '当前目标', status: 'active', pos: '75%', coords: siteCoord(0.84, 0.63) },
          { time: '待定', name: '冷凝塔', res: '', status: 'future', pos: '95%', coords: pointCoords['IP-E5'] }
        ]
      }
    },
    'T-02': {
      bot: 'R-12',
      bgImg: makeMockImg('Task T-02', '#17271d', '#3a5c44'),
      taskName: '主干道例行安防护卫',
      state: 'running',
      type: '自主安保',
      region: 'B区',
      stage: '前往入闸',
      cov: '42%',
      inspected: 64,
      anomaly: 1,
      highRisk: 1,
      review: 5,
      prog: '60%',
      eta: '7m',
      bar: '60%',
      targetCoords: pointCoords['IP-B3'],
      robotCoords: siteCoord(0.43, 0.56),
      path: [pointCoords['IP-B1'], siteCoord(0.43, 0.56)],
      futurePath: [siteCoord(0.43, 0.56), pointCoords['IP-B3'], siteCoord(0.33, 0.45)],
      targetLine: [siteCoord(0.43, 0.56), pointCoords['IP-B3']],
      aimSafe: false,
      targetLabel: '目标丢失',
      eviResult: '自动识别: 无匹配件 (需人为修正)',
      eviClass: 'dim',
      timeline: {
        title: '当前执行：主干道例行安防护卫 (R-12)',
        nodes: [
          { time: '09:00', name: '入口', res: '✓', status: 'safe', pos: '25%', coords: pointCoords['IP-B1'] },
          { time: '09:15', name: '换热阀', res: '高温警示', status: 'warn', pos: '55%', coords: pointCoords['IP-B3'], alertId: 'A-02' },
          { time: '巡航扫描', name: '出入口', res: '前往', status: 'active', pos: '85%', coords: siteCoord(0.33, 0.45) }
        ]
      }
    }
  },
  alerts: [
    { id: 'A-01', bgImg: makeMockImg('Alert A-01', '#3a1212', '#5d1d1d'), time: '10:32', level: 'danger', state: '未确认', device: '2#高压冷凝机组', loc: 'E区-3#点', defect: '轴承频域异响(800Hz峰值)', taskId: 'T-01', coords: pointCoords['IP-E3'], aimSafe: true, targetLabel: '冷凝轴承 [锁死]', eviResult: '分析: 剧烈共振摩擦声', eviClass: 'danger-txt', lastTime: '昨日 15:00', lastResult: '正常', comp: '突发异常' },
    { id: 'A-02', bgImg: makeMockImg('Alert A-02', '#3a2a14', '#594321'), time: '09:15', level: 'warn', state: '待复核', device: 'A区换热阀', loc: '主管廊前端', defect: '热成像法兰面超限 85℃', taskId: 'T-02', coords: pointCoords['IP-B3'], aimSafe: true, targetLabel: '换热阀法兰 [热成像]', eviResult: '分析: 温度超阈 12%', eviClass: 'warn-txt', lastTime: '本周一', lastResult: '78℃', comp: '持续升温(+7℃)' },
    { id: 'A-03', bgImg: makeMockImg('Alert A-03', '#172033', '#334f7c'), time: '11:45', level: 'danger', state: '待复核', device: 'B区冷媒管线', loc: '侧边管囊', defect: '气体压力突降', taskId: 'T-01', coords: siteCoord(0.63, 0.67), aimSafe: false, targetLabel: '压力表视窗 [未对准]', eviResult: '分析: 镜头失焦，无法读数', eviClass: 'danger-txt', lastTime: '2天前', lastResult: '正常', comp: '未见异常' }
  ],
  docks: [
    { id: 'D-01', name: 'A区-主干道充电站', status: 'charging', bot: 'R-11', lastRobot: 'R-07', voltage: '398V', totalCharges: 18, fullNotLeave: 1, queueCount: 2, facadeImg: makeMockImg('A区主干道充电站门面', '#112437', '#294c73'), coords: siteCoord(0.16, 0.36) },
    { id: 'D-02', name: 'C区-仓库备用站', status: 'safe', bot: '空闲', lastRobot: 'R-02', voltage: '401V', totalCharges: 12, fullNotLeave: 2, queueCount: 0, facadeImg: makeMockImg('C区仓库备用站门面', '#1a2b2c', '#2f6164'), coords: siteCoord(0.89, 0.39) },
    { id: 'D-03', name: 'B区-巡检入口充电站', status: 'charging', bot: 'R-02', lastRobot: 'R-12', voltage: '396V', totalCharges: 16, fullNotLeave: 1, queueCount: 1, facadeImg: makeMockImg('B区入口充电站门面', '#2c1d1d', '#654037'), coords: siteCoord(0.33, 0.34) },
    { id: 'D-04', name: 'E区-动力站房充电站', status: 'safe', bot: '空闲', lastRobot: 'R-11', voltage: '400V', totalCharges: 21, fullNotLeave: 3, queueCount: 0, facadeImg: makeMockImg('E区动力站房充电站门面', '#241f33', '#4a3f71'), coords: siteCoord(0.63, 0.36) },
    { id: 'D-05', name: '北侧-临停补能站', status: 'safe', bot: '空闲', lastRobot: 'R-05', voltage: '399V', totalCharges: 9, fullNotLeave: 1, queueCount: 1, facadeImg: makeMockImg('北侧临停补能站门面', '#233021', '#496b44'), coords: siteCoord(0.78, 0.74) },
    { id: 'D-06', name: '南侧-备用充电站', status: 'charging', bot: 'R-05', lastRobot: 'R-03', voltage: '397V', totalCharges: 14, fullNotLeave: 2, queueCount: 2, facadeImg: makeMockImg('南侧备用充电站门面', '#2c2222', '#634646'), coords: siteCoord(0.46, 0.74) }
  ],
  apDevices: [
    { id: 'AP-A1', name: 'A区-入口AP', area: 'A', status: 'safe', signal: '-51dBm', channel: 'CH-6', band: '2.4GHz', users: 8, uptime: '17天', coords: siteCoord(0.24, 0.48) },
    { id: 'AP-B2', name: 'B区-廊道AP', area: 'B', status: 'safe', signal: '-58dBm', channel: 'CH-40', band: '5GHz', users: 5, uptime: '31天', coords: siteCoord(0.52, 0.6) },
    { id: 'AP-C3', name: 'C区-仓储AP', area: 'C', status: 'danger', signal: '-87dBm', channel: 'CH-149', band: '5GHz', users: 1, uptime: '离线 18m', coords: siteCoord(0.82, 0.44) }
  ]
}

export const siteMapUrl = siteMapImage
