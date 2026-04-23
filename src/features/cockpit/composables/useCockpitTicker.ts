import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useCockpitStore } from '@/features/cockpit/store/cockpit'
import { formatClock } from '@/shared/utils/format'

export const useCockpitTicker = () => {
  const store = useCockpitStore()
  const now = ref(new Date())
  let clockTimer: number | undefined
  let autoplayTimer: number | undefined

  onMounted(() => {
    clockTimer = window.setInterval(() => {
      now.value = new Date()
    }, 1000)

    autoplayTimer = window.setInterval(() => {
      if (store.autoplayEnabled) {
        store.tickAutoplay()
      }
    }, 8000)
  })

  onBeforeUnmount(() => {
    window.clearInterval(clockTimer)
    window.clearInterval(autoplayTimer)
  })

  return {
    clockText: () => formatClock(now.value)
  }
}
