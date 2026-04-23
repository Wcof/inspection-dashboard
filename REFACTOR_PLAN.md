# Dashboard 重构方案

## Summary
- 旧静态页已迁移为独立的 `Vue 3 + TypeScript + Vite + Pinia + MapLibre GL` 工程，目录位于 `/Users/ldh/Downloads/project/极客光年/bot-dashboard`。
- 工程结构已按 `app / assets / components / features / mocks / shared` 拆开，避免继续出现单个几千行文件。
- 第一阶段保持 mock 数据驱动，优先实现结构重构、页面拆分和主要交互迁移。

## Key Changes
- 新建独立构建链：`npm run dev`、`npm run build`、`npm run preview`。
- 旧页数据拆分为 `src/mocks/cockpit.mock.ts`，并通过 `cockpitAdapter` 转为页面展示模型。
- 驾驶舱状态集中到 `src/features/cockpit/store/cockpit.ts`，包括焦点对象、地图显隐、弹窗状态、自动轮播和搜索状态。
- 地图逻辑拆成 `useCockpitMap`、`useMapLayers`、`useMapInteractions`、`useMapSearch`。
- 页面拆成头部、地图、左右面板、时间轴和 4 类弹窗，便于单点修改与扩展。

## Test Plan
- 页面首屏能渲染顶部、地图、左右面板和时间轴。
- 地图显示控制、搜索、焦点切换、告警弹窗、证据弹窗、指标弹窗、机器人控制弹窗可独立工作。
- `npm run build` 通过，确保 TypeScript 和生产构建正常。

## Assumptions
- 第一阶段继续使用 mock 数据，不接真实后端。
- 视觉风格以原暗色工业风为基准，允许为组件化做适度整理。
- 调度入口和设备控制入口当前保留为结构化入口，不直接下发真实动作。
