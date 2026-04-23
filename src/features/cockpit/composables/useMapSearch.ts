import { computed } from 'vue'
import { useCockpitStore } from '@/features/cockpit/store/cockpit'

export const useMapSearch = () => {
  const store = useCockpitStore()

  const doSearch = () => {
    const keyword = store.toolbarState.keyword.trim().toLowerCase()
    const type = store.toolbarState.type
    if (!keyword) return

    const matches = {
      robot: store.vm.robots.find((item) => `${item.id} ${item.task}`.toLowerCase().includes(keyword)),
      point: store.vm.points.find((item) => `${item.id} ${item.name}`.toLowerCase().includes(keyword)),
      ap: store.vm.apDevices.find((item) => `${item.id} ${item.name}`.toLowerCase().includes(keyword)),
      dock: store.vm.docks.find((item) => `${item.id} ${item.name}`.toLowerCase().includes(keyword))
    }

    if (type === 'robot' && matches.robot) store.setFocus('robot', matches.robot.id)
    if (type === 'point' && matches.point) store.setFocus('inspectionPoint', matches.point.id)
    if (type === 'dock' && matches.dock) store.setFocus('dock', matches.dock.id)
    if (type === 'ap' && matches.ap) store.setFocus('ap', matches.ap.id)

    if (type === 'all') {
      if (matches.robot) store.setFocus('robot', matches.robot.id)
      else if (matches.point) store.setFocus('inspectionPoint', matches.point.id)
      else if (matches.ap) store.setFocus('ap', matches.ap.id)
      else if (matches.dock) store.setFocus('dock', matches.dock.id)
    }

    store.toolbarState.searchOpen = false
  }

  return {
    searchState: computed(() => store.toolbarState),
    doSearch
  }
}
