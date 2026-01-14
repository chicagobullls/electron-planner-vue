<script setup lang="ts">
import { ref, computed } from 'vue'

const currentDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return new Date().toLocaleDateString('ru-RU', options)
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Доброе утро'
  if (hour >= 12 && hour < 17) return 'Добрый день'
  if (hour >= 17 && hour < 22) return 'Добрый вечер'
  return 'Доброй ночи'
})

// Демо данные
const stats = ref([
  { label: 'Активных целей', value: 5, icon: 'target', color: 'var(--color-accent-primary)' },
  { label: 'Задач на сегодня', value: 8, icon: 'tasks', color: 'var(--color-info)' },
  { label: 'Привычек', value: 7, icon: 'habits', color: 'var(--color-success)' },
  { label: 'Заметок', value: 12, icon: 'notes', color: 'var(--color-warning)' }
])

const todayTasks = ref([
  { id: 1, title: 'Утренняя зарядка', time: '07:00', completed: true, category: 'health' },
  { id: 2, title: 'Планирование дня', time: '08:00', completed: true, category: 'productivity' },
  { id: 3, title: 'Работа над проектом', time: '09:00', completed: false, category: 'work' },
  { id: 4, title: 'Обед и отдых', time: '13:00', completed: false, category: 'lifestyle' },
  { id: 5, title: 'Чтение книги', time: '19:00', completed: false, category: 'education' }
])

const toggleTask = (id: number) => {
  const task = todayTasks.value.find(t => t.id === id)
  if (task) task.completed = !task.completed
}

const completedPercentage = computed(() => {
  const completed = todayTasks.value.filter(t => t.completed).length
  return Math.round((completed / todayTasks.value.length) * 100)
})

const motivationalQuotes = [
  'Каждый день — это новая возможность стать лучше.',
  'Маленькие шаги ведут к большим результатам.',
  'Успех — это сумма маленьких усилий, повторяемых изо дня в день.',
  'Планируй работу, работай по плану.',
  'Дисциплина — это мост между целями и достижениями.'
]

const randomQuote = computed(() => {
  const index = Math.floor(Math.random() * motivationalQuotes.length)
  return motivationalQuotes[index]
})
</script>

<template>
  <div class="dashboard">
    <!-- Header Section -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="greeting-section">
          <h1 class="greeting">{{ greeting }} <span class="text-gradient">👋</span></h1>
          <p class="date">{{ currentDate }}</p>
        </div>
        <div class="quick-actions">
          <button class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Новая задача
          </button>
        </div>
      </div>
      
      <div class="quote-card glass">
        <svg class="quote-icon" viewBox="0 0 24 24" fill="none">
          <path d="M10 8H6C4.89543 8 4 8.89543 4 10V14C4 15.1046 4.89543 16 6 16H8L6 20H8L10 16V10C10 8.89543 9.10457 8 8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 8H16C14.8954 8 14 8.89543 14 10V14C14 15.1046 14.8954 16 16 16H18L16 20H18L20 16V10C20 8.89543 19.1046 8 18 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="quote-text">{{ randomQuote }}</p>
      </div>
    </header>

    <!-- Stats Grid -->
    <section class="stats-section">
      <div class="stats-grid">
        <div 
          v-for="stat in stats" 
          :key="stat.label" 
          class="stat-card"
          :style="{ '--stat-color': stat.color }"
        >
          <div class="stat-icon">
            <!-- Target -->
            <svg v-if="stat.icon === 'target'" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="1" fill="currentColor"/>
            </svg>
            <!-- Tasks -->
            <svg v-else-if="stat.icon === 'tasks'" viewBox="0 0 24 24" fill="none">
              <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <!-- Habits -->
            <svg v-else-if="stat.icon === 'habits'" viewBox="0 0 24 24" fill="none">
              <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <!-- Notes -->
            <svg v-else-if="stat.icon === 'notes'" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="2"/>
              <path d="M14 2V8H20" stroke="currentColor" stroke-width="2"/>
              <path d="M8 13H16M8 17H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content Grid -->
    <section class="content-grid">
      <!-- Today's Tasks -->
      <div class="tasks-card card">
        <div class="card-header">
          <h3>Задачи на сегодня</h3>
          <div class="progress-badge">
            <span class="progress-value">{{ completedPercentage }}%</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: completedPercentage + '%' }"></div>
            </div>
          </div>
        </div>
        
        <div class="tasks-list">
          <div 
            v-for="task in todayTasks" 
            :key="task.id" 
            :class="['task-item', { completed: task.completed }]"
            @click="toggleTask(task.id)"
          >
            <div class="task-checkbox">
              <svg v-if="task.completed" viewBox="0 0 24 24" fill="none">
                <path d="M5 12L10 17L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="task-content">
              <span class="task-title">{{ task.title }}</span>
              <span class="task-time">{{ task.time }}</span>
            </div>
            <span :class="['task-category', task.category]">{{ task.category }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Goals -->
      <div class="goals-card card">
        <div class="card-header">
          <h3>Активные цели</h3>
          <RouterLink to="/goals" class="see-all">Все цели →</RouterLink>
        </div>
        
        <div class="goals-list">
          <div class="goal-item">
            <div class="goal-info">
              <span class="goal-emoji">🏃</span>
              <div class="goal-details">
                <span class="goal-title">Пробежать марафон</span>
                <span class="goal-progress-text">15 / 42 км</span>
              </div>
            </div>
            <div class="goal-progress-bar">
              <div class="goal-progress-fill" style="width: 35%"></div>
            </div>
          </div>
          
          <div class="goal-item">
            <div class="goal-info">
              <span class="goal-emoji">📚</span>
              <div class="goal-details">
                <span class="goal-title">Прочитать 24 книги</span>
                <span class="goal-progress-text">8 / 24 книг</span>
              </div>
            </div>
            <div class="goal-progress-bar">
              <div class="goal-progress-fill" style="width: 33%"></div>
            </div>
          </div>
          
          <div class="goal-item">
            <div class="goal-info">
              <span class="goal-emoji">💰</span>
              <div class="goal-details">
                <span class="goal-title">Накопить на отпуск</span>
                <span class="goal-progress-text">75 000 / 100 000 ₽</span>
              </div>
            </div>
            <div class="goal-progress-bar">
              <div class="goal-progress-fill" style="width: 75%"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease;
}

/* Header */
.dashboard-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.greeting {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.date {
  color: var(--color-text-muted);
  font-size: 0.9375rem;
  text-transform: capitalize;
}

.quick-actions .btn svg {
  stroke: currentColor;
}

.quote-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: var(--border-radius);
}

.quote-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  color: var(--color-accent-tertiary);
}

.quote-text {
  font-size: 1rem;
  font-style: italic;
  color: var(--color-text-secondary);
}

/* Stats */
.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  transition: all var(--transition-normal);
}

.stat-card:hover {
  border-color: var(--stat-color);
  box-shadow: 0 0 20px color-mix(in srgb, var(--stat-color) 20%, transparent);
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--stat-color) 15%, transparent);
  border-radius: var(--border-radius-sm);
  color: var(--stat-color);
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
}

.see-all {
  font-size: 0.875rem;
  color: var(--color-accent-primary);
}

/* Progress Badge */
.progress-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-success);
}

.progress-bar {
  width: 80px;
  height: 6px;
  background: var(--color-bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-success), var(--color-info));
  border-radius: 3px;
  transition: width var(--transition-normal);
}

/* Tasks */
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem;
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.task-item:hover {
  background: var(--color-bg-hover);
}

.task-item.completed {
  opacity: 0.6;
}

.task-item.completed .task-title {
  text-decoration: line-through;
}

.task-checkbox {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-border-hover);
  border-radius: 6px;
  transition: all var(--transition-fast);
}

.task-item.completed .task-checkbox {
  background: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

.task-checkbox svg {
  width: 14px;
  height: 14px;
}

.task-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.task-title {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.task-time {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.task-category {
  padding: 0.25rem 0.625rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 4px;
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

.task-category.health { background: rgba(16, 185, 129, 0.15); color: var(--color-success); }
.task-category.work { background: rgba(99, 102, 241, 0.15); color: var(--color-accent-primary); }
.task-category.education { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); }
.task-category.productivity { background: rgba(6, 182, 212, 0.15); color: var(--color-info); }
.task-category.lifestyle { background: rgba(139, 92, 246, 0.15); color: var(--color-accent-secondary); }

/* Goals */
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goal-item {
  padding: 1rem;
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-sm);
}

.goal-info {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 0.75rem;
}

.goal-emoji {
  font-size: 1.5rem;
}

.goal-details {
  display: flex;
  flex-direction: column;
}

.goal-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.goal-progress-text {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.goal-progress-bar {
  height: 8px;
  background: var(--color-bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.goal-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary));
  border-radius: 4px;
  transition: width var(--transition-slow);
}

/* Responsive */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
