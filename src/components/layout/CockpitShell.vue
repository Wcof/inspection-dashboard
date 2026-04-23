<template>
  <div class="dashboard-shell">
    <slot name="header" />
    <div class="body-grid">
      <aside class="column">
        <slot name="left" />
      </aside>
      <main class="main">
        <slot />
      </main>
      <aside class="column">
        <slot name="right" />
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.body-grid {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr) 320px;
  gap: 16px;
  min-height: calc(100vh - 160px);
}

.column,
.main {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

@media (max-width: 1400px) {
  .body-grid {
    grid-template-columns: 280px minmax(0, 1fr) 280px;
  }
}

@media (max-width: 1100px) {
  .body-grid {
    grid-template-columns: 1fr;
  }
}
</style>
