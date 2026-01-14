<script setup lang="ts">
const isMaximized = ref(false)

const minimize = () => {
  window.electronAPI?.minimize()
}

const toggleMaximize = async () => {
  await window.electronAPI?.maximize()
  isMaximized.value = await window.electronAPI?.isMaximized() ?? false
}

const close = () => {
  window.electronAPI?.close()
}

const updateMaximizedState = async () => {
  isMaximized.value = await window.electronAPI?.isMaximized() ?? false
}

onMounted(() => {
  window.addEventListener('resize', updateMaximizedState)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateMaximizedState)
})
</script>

<template>
  <header class="titlebar">
    <div class="titlebar-drag">
      <div class="app-logo">
        <Icon name="logo" size="18" class="logo-icon" />
        <span class="app-title">Life Planner</span>
      </div>
    </div>
    
    <div class="window-controls">
      <button class="control-btn minimize" @click="minimize" title="Свернуть">
        <Icon name="minimize" size="14" />
      </button>
      <button class="control-btn maximize" @click="toggleMaximize" :title="isMaximized ? 'Восстановить' : 'Развернуть'">
        <Icon v-if="!isMaximized" name="maximize" size="14" />
        <Icon v-else name="restore" size="14" />
      </button>
      <button class="control-btn close" @click="close" title="Закрыть">
        <Icon name="close" size="14" />
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.titlebar {
  height: var(--titlebar-height);
  @include flex-between;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  padding: 0 0.25rem 0 0.75rem;
  -webkit-app-region: drag;
}

.titlebar-drag {
  flex: 1;
  @include flex-start;
}

.app-logo {
  @include flex-start;
  gap: 0.5rem;
}

.logo-icon {
  color: var(--color-accent-primary);
}

.app-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: 0.02em;
}

.window-controls {
  display: flex;
  -webkit-app-region: no-drag;
}

.control-btn {
  width: 40px;
  height: var(--titlebar-height);
  @include flex-center;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  @include transition-fast;

  &:hover {
    background: var(--color-bg-hover);
    color: var(--color-text-primary);
  }

  &.close:hover {
    background: var(--color-danger);
    color: white;
  }
}
</style>
