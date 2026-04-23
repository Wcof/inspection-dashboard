<template>
  <div v-if="visible && robot" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="modal-head">
        <div>
          <h3>{{ robot.id }} 控制面板</h3>
          <div class="panel-subtitle">{{ robot.task }}</div>
        </div>
        <button class="toolbar-btn" @click="$emit('close')">关闭</button>
      </div>
      <div class="control-grid">
        <button class="toolbar-btn active">下发临时任务</button>
        <button class="toolbar-btn">切换返航</button>
        <button class="toolbar-btn">语音喊话</button>
        <button class="toolbar-btn">打开调度台</button>
      </div>
      <div class="feedback">当前为结构化重构版本，控制动作保留入口，不直接接真实设备。</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RobotViewModel } from '@/features/cockpit/types'

defineProps<{
  visible: boolean
  robot: RobotViewModel | null
}>()

defineEmits<{
  (event: 'close'): void
}>()
</script>

<style scoped lang="scss">
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.feedback {
  margin-top: 16px;
  color: var(--text-dim);
}
</style>
