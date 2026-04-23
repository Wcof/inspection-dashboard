<template>
  <div v-if="visible" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card evidence-modal">
      <div class="modal-head">
        <div>
          <h3>{{ title }}</h3>
          <div class="panel-subtitle">{{ meta }}</div>
        </div>
        <button class="toolbar-btn" @click="$emit('close')">关闭</button>
      </div>
      <div class="evidence-frame" :style="{ backgroundImage: `url(${image})` }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  title: string
  meta: string
  image: string
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

.evidence-frame {
  height: min(60vh, 540px);
  border-radius: 18px;
  background-position: center;
  background-size: cover;
  border: 1px solid var(--border-subtle);
}
</style>
