<script setup lang="ts">
const route = useRoute()

// Состояние сворачивания сайдбара
const isCollapsed = useLocalStorage('sidebar-collapsed', false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const menuItems = [
  { path: '/', name: 'Главная', icon: 'dashboard' },
  { path: '/goals', name: 'Цели', icon: 'target' },
  { path: '/calendar', name: 'Календарь', icon: 'calendar' },
  { path: '/habits', name: 'Привычки', icon: 'habits' },
  { path: '/notes', name: 'Заметки', icon: 'notes' }
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <aside :class="['sidebar', { collapsed: isCollapsed }]">
    <div class="sidebar-content">
      <nav class="sidebar-nav">
        <RouterLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          :class="['nav-item', { active: isActive(item.path) }]"
          :title="isCollapsed ? item.name : ''"
        >
          <span class="nav-icon">
            <Icon :name="item.icon" size="20" />
          </span>
          <span class="nav-label">{{ item.name }}</span>
        </RouterLink>
      </nav>

      <!-- Кнопка сворачивания -->
      <button 
        class="toggle-btn" 
        @click="toggleSidebar"
        :title="isCollapsed ? 'Развернуть' : 'Свернуть'"
      >
        <span class="toggle-icon">
          <Icon name="chevron-left" size="16" />
        </span>
        <span class="toggle-label">Свернуть</span>
      </button>

      <div class="sidebar-footer">
        <div class="user-block" :title="isCollapsed ? 'Пользователь' : ''">
          <div class="user-avatar">
            <Icon name="user" size="18" />
          </div>
          <div class="user-details">
            <span class="user-name">Пользователь</span>
            <span class="user-status">Планируй успех</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
$expanded-width: 200px;
$collapsed-width: 56px;
$item-height: 40px;
$icon-size: 40px;
$padding: 8px;
$duration: 0.2s;

.sidebar {
  width: $expanded-width;
  height: 100%;
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  transition: width $duration ease;

  &.collapsed {
    width: $collapsed-width;

    .sidebar-content {
      padding: $padding;
    }

    .sidebar-nav {
      align-items: center;
    }

    .nav-label {
      display: none;
    }

    .toggle-btn {
      width: $icon-size;
      height: $icon-size;
      padding: 0;
      justify-content: center;
      border-radius: 12px;
    }

    .toggle-label {
      display: none;
    }

    .toggle-icon {
      transform: rotate(180deg);
    }

    .sidebar-footer {
      display: flex;
      justify-content: center;
    }

    .user-details {
      display: none;
    }

    .user-avatar {
      width: 28px;
      height: 28px;
    }
  }
}

.sidebar-content {
  height: 100%;
  padding: $padding 12px;
  @include flex-column;
  transition: padding $duration ease;
}

.sidebar-nav {
  flex: 1;
  @include flex-column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 12px;
  height: $item-height;
  padding: 0 12px;
  color: var(--color-text-secondary);
  border-radius: 10px;
  text-decoration: none;
  transition: all $duration ease;

  &:hover {
    color: var(--color-text-primary);
    background: var(--color-bg-hover);
  }

  &.active {
    color: var(--color-accent-primary);
    background: rgba(99, 102, 241, 0.1);
  }
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  @include flex-center;
}

.nav-label {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

// Кнопка сворачивания
.toggle-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  height: $item-height;
  padding: 0 12px;
  margin-top: 4px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all $duration ease;

  &:hover {
    background: var(--color-bg-hover);
    color: var(--color-text-primary);
  }
}

.toggle-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  @include flex-center;
  transition: transform $duration ease;
}

.toggle-label {
  font-size: 0.8125rem;
  font-weight: 500;
  white-space: nowrap;
}

.sidebar-footer {
  padding-top: $padding;
  border-top: 1px solid var(--color-border);
  margin-top: $padding;
  transition: all $duration ease;
}

.user-block {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 10px;
  height: $item-height;
  padding: 0 4px;
  border-radius: 10px;
  cursor: pointer;
  transition: all $duration ease;

  &:hover {
    background: var(--color-bg-hover);
  }
}

.user-avatar {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  @include flex-center;
  background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
  border-radius: 50%;
  color: white;
  transition: all $duration ease;
}

.user-details {
  @include flex-column;
  white-space: nowrap;
  overflow: hidden;
}

.user-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.user-status {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
  line-height: 1.2;
}
</style>
