<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { 
    path: '/', 
    name: 'Главная', 
    icon: 'dashboard'
  },
  { 
    path: '/goals', 
    name: 'Цели', 
    icon: 'target'
  },
  { 
    path: '/calendar', 
    name: 'Календарь', 
    icon: 'calendar'
  },
  { 
    path: '/habits', 
    name: 'Привычки', 
    icon: 'habits'
  },
  { 
    path: '/notes', 
    name: 'Заметки', 
    icon: 'notes'
  }
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        :class="['nav-item', { active: isActive(item.path) }]"
      >
        <span class="nav-icon">
          <!-- Dashboard -->
          <svg v-if="item.icon === 'dashboard'" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="9" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="14" y="3" width="7" height="5" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="14" y="12" width="7" height="9" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="3" y="16" width="7" height="5" rx="2" stroke="currentColor" stroke-width="2"/>
          </svg>
          <!-- Target/Goals -->
          <svg v-else-if="item.icon === 'target'" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
          </svg>
          <!-- Calendar -->
          <svg v-else-if="item.icon === 'calendar'" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M3 9H21" stroke="currentColor" stroke-width="2"/>
            <path d="M8 2V5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M16 2V5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="8" cy="14" r="1" fill="currentColor"/>
            <circle cx="12" cy="14" r="1" fill="currentColor"/>
            <circle cx="16" cy="14" r="1" fill="currentColor"/>
          </svg>
          <!-- Habits -->
          <svg v-else-if="item.icon === 'habits'" viewBox="0 0 24 24" fill="none">
            <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <!-- Notes -->
          <svg v-else-if="item.icon === 'notes'" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 13H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 17H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="nav-label">{{ item.name }}</span>
        <span v-if="isActive(item.path)" class="nav-indicator"></span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M4 20C4 17 8 15 12 15C16 15 20 17 20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="user-details">
          <span class="user-name">Пользователь</span>
          <span class="user-status">Планируй успех</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  padding: 1.5rem 1rem;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  color: var(--color-text-secondary);
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
  text-decoration: none;
}

.nav-item:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-hover);
}

.nav-item.active {
  color: var(--color-accent-primary);
  background: rgba(99, 102, 241, 0.1);
}

.nav-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon svg {
  width: 100%;
  height: 100%;
}

.nav-label {
  font-size: 0.9375rem;
  font-weight: 500;
}

.nav-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--color-accent-primary);
  border-radius: 0 2px 2px 0;
}

.sidebar-footer {
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  margin-top: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.user-info:hover {
  background: var(--color-bg-hover);
}

.user-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
  border-radius: 50%;
  color: white;
}

.user-avatar svg {
  width: 22px;
  height: 22px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.user-status {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>
