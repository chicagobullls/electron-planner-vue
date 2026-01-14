<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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
        <svg viewBox="0 0 24 24" fill="none" class="logo-icon">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="app-title">Life Planner</span>
      </div>
    </div>
    
    <div class="window-controls">
      <button class="control-btn minimize" @click="minimize" title="Свернуть">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <button class="control-btn maximize" @click="toggleMaximize" :title="isMaximized ? 'Восстановить' : 'Развернуть'">
        <svg v-if="!isMaximized" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none">
          <rect x="7" y="7" width="10" height="10" rx="1" stroke="currentColor" stroke-width="2"/>
          <path d="M10 7V5C10 4.44772 10.4477 4 11 4H19C19.5523 4 20 4.44772 20 5V13C20 13.5523 19.5523 14 19 14H17" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
      <button class="control-btn close" @click="close" title="Закрыть">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.titlebar {
  height: var(--titlebar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  padding: 0 0.5rem 0 1rem;
  -webkit-app-region: drag;
}

.titlebar-drag {
  flex: 1;
  display: flex;
  align-items: center;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 22px;
  height: 22px;
  color: var(--color-accent-primary);
}

.app-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: 0.02em;
}

.window-controls {
  display: flex;
  -webkit-app-region: no-drag;
}

.control-btn {
  width: 46px;
  height: var(--titlebar-height);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.control-btn svg {
  width: 16px;
  height: 16px;
}

.control-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.control-btn.close:hover {
  background: var(--color-danger);
  color: white;
}
</style>
