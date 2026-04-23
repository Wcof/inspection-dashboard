import { useCockpitStore } from '@/features/cockpit/store/cockpit'

export const useMapInteractions = () => {
  const store = useCockpitStore()

  const onRobotClick = (robotId: string) => store.setFocus('robot', robotId)
  const onPointClick = (pointId: string) => store.setFocus('inspectionPoint', pointId)
  const onDockClick = (dockId: string) => store.setFocus('dock', dockId)
  const onApClick = (apId: string) => store.setFocus('ap', apId)
  const onAlertClick = (alertId: string) => {
    store.setFocus('alert', alertId)
    store.openModal('alert', { alertId })
  }
  const onBlankClick = () => store.resetView()

  return {
    onRobotClick,
    onPointClick,
    onDockClick,
    onApClick,
    onAlertClick,
    onBlankClick
  }
}
