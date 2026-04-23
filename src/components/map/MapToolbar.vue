<template>
  <div class="toolbar">
    <button class="toolbar-btn" @click="toggleSearch">查询</button>
    <button class="toolbar-btn" :class="{ active: displayOpen }" @click="toggleDisplay">显示控制</button>
    <button class="toolbar-btn" @click="$emit('open-control')">临时调度入口</button>
    <button class="toolbar-btn" @click="$emit('go-cockpit')">驾驶舱入口</button>
    <button class="toolbar-btn" @click="$emit('reset')">视角重置</button>

    <div v-if="displayOpen" class="popover">
      <label><input :checked="mapUi.labels" type="checkbox" @change="$emit('toggle-layer', 'labels')" /> 名称显示</label>
      <label><input :checked="mapUi.robots" type="checkbox" @change="$emit('toggle-layer', 'robots')" /> 机器人显示</label>
      <label><input :checked="mapUi.points" type="checkbox" @change="$emit('toggle-layer', 'points')" /> 巡检点显示</label>
      <div class="sub-options">
        <label v-for="(enabled, key) in mapUi.pointAreas" :key="key">
          <input :checked="enabled" type="checkbox" @change="$emit('toggle-area', key)" /> {{ key }} 区域
        </label>
      </div>
      <label><input :checked="mapUi.docks" type="checkbox" @change="$emit('toggle-layer', 'docks')" /> 充电站显示</label>
      <label><input :checked="mapUi.route" type="checkbox" @change="$emit('toggle-layer', 'route')" /> 巡检路径</label>
    </div>

    <div v-if="searchOpen" class="popover search-popover">
      <div class="search-row">
        <select :value="searchType" @change="$emit('update:type', ($event.target as HTMLSelectElement).value)">
          <option value="all">全部</option>
          <option value="robot">机器人</option>
          <option value="point">巡检点</option>
          <option value="ap">AP设备</option>
          <option value="dock">充电站</option>
        </select>
        <input :value="keyword" type="text" placeholder="输入名称/编号模糊搜索" @input="$emit('update:keyword', ($event.target as HTMLInputElement).value)" @keydown.enter="$emit('search')" />
      </div>
      <button class="toolbar-btn active" @click="$emit('search')">定位</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MapLayerVisibility } from '@/features/cockpit/types'

const props = defineProps<{
  searchOpen: boolean
  displayOpen: boolean
  keyword: string
  searchType: string
  mapUi: MapLayerVisibility
}>()

const emit = defineEmits<{
  (event: 'toggle-search'): void
  (event: 'toggle-display'): void
  (event: 'update:keyword', value: string): void
  (event: 'update:type', value: string): void
  (event: 'toggle-layer', key: keyof Omit<MapLayerVisibility, 'pointAreas'>): void
  (event: 'toggle-area', area: string): void
  (event: 'search'): void
  (event: 'open-control'): void
  (event: 'go-cockpit'): void
  (event: 'reset'): void
}>()

const toggleSearch = () => emit('toggle-search')
const toggleDisplay = () => emit('toggle-display')

void props
</script>

<style scoped lang="scss">
.toolbar {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 20;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-width: calc(100% - 36px);
}

.popover {
  position: absolute;
  top: 48px;
  left: 110px;
  min-width: 240px;
  padding: 14px;
  border-radius: 14px;
  background: rgba(8, 15, 28, 0.96);
  border: 1px solid var(--border-focus);
  display: grid;
  gap: 10px;
}

.search-popover {
  left: 0;
  min-width: 320px;
}

.search-row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 8px;
}

.sub-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  color: var(--text-dim);
}

input,
select {
  width: 100%;
  min-height: 36px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid var(--border-subtle);
  color: var(--text-main);
  background: rgba(13, 23, 40, 0.86);
}

label {
  font-size: 13px;
  color: var(--text-sub);
}
</style>
