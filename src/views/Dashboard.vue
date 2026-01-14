<script setup lang="ts">
// Типы
interface Task {
  id: string
  title: string
  completed: boolean
  date: string | null // null = в backlog
}

interface CalendarEvent {
  id: string
  title: string
  date: string
  color: string
  icon: string
}

interface CalendarDay {
  dayNumber: number
  dateKey: string
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  isHoliday: boolean
  holidayName?: string
}

// Праздничные дни РФ (фиксированные) - вынесено наружу для оптимизации
const RUSSIAN_HOLIDAYS: Record<string, string> = {
  '01-01': 'Новый год',
  '01-02': 'Новогодние каникулы',
  '01-03': 'Новогодние каникулы',
  '01-04': 'Новогодние каникулы',
  '01-05': 'Новогодние каникулы',
  '01-06': 'Новогодние каникулы',
  '01-07': 'Рождество Христово',
  '01-08': 'Новогодние каникулы',
  '02-23': 'День защитника Отечества',
  '03-08': 'Международный женский день',
  '05-01': 'Праздник Весны и Труда',
  '05-09': 'День Победы',
  '06-12': 'День России',
  '11-04': 'День народного единства'
}

// Доступные цвета для событий
const EVENT_COLORS = [
  { name: 'Индиго', value: '#6366f1' },
  { name: 'Фиолетовый', value: '#8b5cf6' },
  { name: 'Розовый', value: '#ec4899' },
  { name: 'Красный', value: '#ef4444' },
  { name: 'Оранжевый', value: '#f97316' },
  { name: 'Янтарный', value: '#f59e0b' },
  { name: 'Зелёный', value: '#10b981' },
  { name: 'Бирюзовый', value: '#14b8a6' },
  { name: 'Голубой', value: '#06b6d4' },
  { name: 'Синий', value: '#3b82f6' }
]

// Доступные иконки для событий
const EVENT_ICONS = [
  { name: 'Цель', value: 'target' },
  { name: 'Календарь', value: 'calendar' },
  { name: 'Задачи', value: 'tasks' },
  { name: 'Привычки', value: 'habits' },
  { name: 'Заметки', value: 'notes' },
  { name: 'Цитата', value: 'quote' },
  { name: 'Пользователь', value: 'user' },
  { name: 'Галочка', value: 'check' },
  { name: 'Дашборд', value: 'dashboard' },
  { name: 'Логотип', value: 'logo' }
]

// Состояние календаря
const currentDate = ref(new Date())
const draggedTask = ref<Task | null>(null)
const newTaskTitle = ref('')

// Состояние модального окна событий
const showEventModal = ref(false)
const eventForm = ref({
  title: '',
  date: '',
  color: EVENT_COLORS[0].value,
  icon: EVENT_ICONS[0].value
})

// Хранение данных в localStorage
const tasks = useLocalStorage<Task[]>('planner-tasks-v2', [])
const events = useLocalStorage<CalendarEvent[]>('planner-events-v1', [])

// Кэш сегодняшней даты (обновляется раз в минуту)
const todayKey = ref(formatDateKey(new Date()))

// Вычисляемые свойства
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

const monthName = computed(() => {
  return currentDate.value.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
})

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

// Backlog задачи (без даты)
const backlogTasks = computed(() => tasks.value.filter(t => t.date === null))

// Индекс задач по датам (оптимизация - O(1) вместо O(n) для каждой ячейки)
const tasksByDate = computed(() => {
  const map = new Map<string, Task[]>()
  for (const task of tasks.value) {
    if (task.date) {
      const existing = map.get(task.date)
      if (existing) {
        existing.push(task)
      } else {
        map.set(task.date, [task])
      }
    }
  }
  return map
})

// Индекс событий по датам
const eventsByDate = computed(() => {
  const map = new Map<string, CalendarEvent[]>()
  for (const event of events.value) {
    const existing = map.get(event.date)
    if (existing) {
      existing.push(event)
    } else {
      map.set(event.date, [event])
    }
  }
  return map
})

// Форматирование даты
function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Получить дни месяца (все данные предвычислены)
const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const today = todayKey.value
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  let startDayOfWeek = firstDay.getDay() - 1
  if (startDayOfWeek < 0) startDayOfWeek = 6
  
  const days: CalendarDay[] = []
  
  // Хелпер для создания дня
  const createDay = (date: Date, isCurrentMonth: boolean): CalendarDay => {
    const dayOfWeek = date.getDay()
    const monthStr = String(date.getMonth() + 1).padStart(2, '0')
    const dayStr = String(date.getDate()).padStart(2, '0')
    const holidayKey = `${monthStr}-${dayStr}`
    const dateKey = `${date.getFullYear()}-${monthStr}-${dayStr}`
    
    return {
      dayNumber: date.getDate(),
      dateKey,
      isCurrentMonth,
      isToday: dateKey === today,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isHoliday: holidayKey in RUSSIAN_HOLIDAYS,
      holidayName: RUSSIAN_HOLIDAYS[holidayKey]
    }
  }
  
  // Дни предыдущего месяца
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push(createDay(new Date(year, month - 1, prevMonthLastDay - i), false))
  }
  
  // Дни текущего месяца
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(createDay(new Date(year, month, i), true))
  }
  
  // Дни следующего месяца (до 35 или 42 дней)
  const totalDays = days.length <= 35 ? 35 : 42
  const remainingDays = totalDays - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push(createDay(new Date(year, month + 1, i), false))
  }
  
  return days
})

// Количество строк в календаре
const calendarRows = computed(() => Math.ceil(calendarDays.value.length / 7))

// Получить задачи для даты (O(1) из Map)
function getTasksForDate(dateKey: string): Task[] {
  return tasksByDate.value.get(dateKey) || []
}

// Получить события для даты
function getEventsForDate(dateKey: string): CalendarEvent[] {
  return eventsByDate.value.get(dateKey) || []
}

// Навигация
function prevMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

function goToToday() {
  currentDate.value = new Date()
  todayKey.value = formatDateKey(new Date())
}

// Добавление задачи в backlog
function addTask() {
  if (!newTaskTitle.value.trim()) return
  
  tasks.value.push({
    id: Date.now().toString(),
    title: newTaskTitle.value.trim(),
    completed: false,
    date: null
  })
  
  newTaskTitle.value = ''
}

// Переключение статуса
function toggleTask(taskId: string) {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) task.completed = !task.completed
}

// Удаление задачи
function deleteTask(taskId: string) {
  const index = tasks.value.findIndex(t => t.id === taskId)
  if (index !== -1) tasks.value.splice(index, 1)
}

// Назначить задачу на сегодня
function assignToToday(taskId: string) {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) task.date = todayKey.value
}

// Drag & Drop
function onDragStart(task: Task) {
  draggedTask.value = task
}

function onDragEnd() {
  draggedTask.value = null
}

function onDrop(dateKey: string) {
  if (draggedTask.value) {
    draggedTask.value.date = dateKey
    draggedTask.value = null
  }
}

function onDropToBacklog() {
  if (draggedTask.value) {
    draggedTask.value.date = null
    draggedTask.value = null
  }
}

// События
function openEventModal() {
  eventForm.value = {
    title: '',
    date: todayKey.value,
    color: EVENT_COLORS[0].value,
    icon: EVENT_ICONS[0].value
  }
  showEventModal.value = true
}

function closeEventModal() {
  showEventModal.value = false
}

function createEvent() {
  if (!eventForm.value.title.trim() || !eventForm.value.date) return
  
  events.value.push({
    id: Date.now().toString(),
    title: eventForm.value.title.trim(),
    date: eventForm.value.date,
    color: eventForm.value.color,
    icon: eventForm.value.icon
  })
  
  closeEventModal()
}

function deleteEvent(eventId: string) {
  const index = events.value.findIndex(e => e.id === eventId)
  if (index !== -1) events.value.splice(index, 1)
}

// Статистика
const totalTasks = computed(() => tasks.value.length)
const completedTasks = computed(() => tasks.value.filter(t => t.completed).length)
</script>

<template>
  <div class="dashboard">
    <!-- Основной контент -->
    <div class="main-area">
      <!-- Header -->
      <header class="calendar-header">
        <div class="nav-controls">
          <button class="nav-btn" @click="prevMonth">
            <Icon name="chevron-left" size="14" />
          </button>
          <h2 class="month-title" @click="goToToday">{{ monthName }}</h2>
          <button class="nav-btn" @click="nextMonth">
            <Icon name="chevron-right" size="14" />
          </button>
        </div>
        <div class="header-actions">
          <button class="add-event-btn" @click="openEventModal">
            <Icon name="plus" size="14" />
            <span>Событие</span>
          </button>
          <div class="stats-badge">
            <span class="stats-done">{{ completedTasks }}</span>
            <span class="stats-divider">/</span>
            <span class="stats-total">{{ totalTasks }}</span>
          </div>
        </div>
      </header>

      <!-- Дни недели -->
      <div class="weekdays-row">
        <div 
          v-for="(day, index) in weekDays" 
          :key="day" 
          :class="['weekday-cell', { 'weekend': index >= 5 }]"
        >{{ day }}</div>
      </div>

      <!-- Сетка календаря -->
      <div class="calendar-grid" :style="{ '--rows': calendarRows }">
        <div
          v-for="day in calendarDays"
          :key="day.dateKey"
          :class="[
            'day-cell',
            {
              'other-month': !day.isCurrentMonth,
              'today': day.isToday,
              'drag-over': draggedTask,
              'weekend': day.isWeekend,
              'holiday': day.isHoliday,
              'has-event': getEventsForDate(day.dateKey).length > 0
            }
          ]"
          :style="getEventsForDate(day.dateKey).length > 0 ? {
            '--event-color': getEventsForDate(day.dateKey)[0].color
          } : {}"
          @dragover.prevent
          @drop="onDrop(day.dateKey)"
        >
          <!-- Фоновая иконка события -->
          <div 
            v-if="getEventsForDate(day.dateKey).length > 0" 
            class="event-bg-icon"
            :style="{ color: getEventsForDate(day.dateKey)[0].color }"
          >
            <Icon :name="getEventsForDate(day.dateKey)[0].icon" size="48" />
          </div>

          <div class="day-header">
            <span class="day-number">{{ day.dayNumber }}</span>
            <span v-if="day.isHoliday" class="holiday-indicator" :title="day.holidayName">🎉</span>
          </div>

          <!-- События дня -->
          <div v-if="getEventsForDate(day.dateKey).length > 0" class="day-events">
            <div 
              v-for="event in getEventsForDate(day.dateKey)" 
              :key="event.id"
              class="event-badge"
              :style="{ background: event.color }"
              :title="event.title"
              @click.stop="deleteEvent(event.id)"
            >
              {{ event.title }}
            </div>
          </div>

          <div class="day-tasks">
            <div
              v-for="task in getTasksForDate(day.dateKey)"
              :key="task.id"
              :class="['day-task', { completed: task.completed }]"
              draggable="true"
              @dragstart="onDragStart(task)"
              @dragend="onDragEnd"
            >
              <button class="task-checkbox" @click.stop="toggleTask(task.id)">
                <Icon v-if="task.completed" name="check" size="12" />
              </button>
              <span class="task-text">{{ task.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Правый сайдбар - Backlog -->
    <aside class="backlog-panel">
      <div class="backlog-header">
        <h3>Задачи</h3>
        <span class="backlog-count">{{ backlogTasks.length }}</span>
      </div>

      <!-- Форма добавления -->
      <div class="add-form">
        <input
          v-model="newTaskTitle"
          type="text"
          placeholder="Новая задача..."
          @keyup.enter="addTask"
        />
        <button class="add-btn" @click="addTask" :disabled="!newTaskTitle.trim()">
          <Icon name="plus" size="18" />
        </button>
      </div>

      <!-- Список backlog -->
      <div 
        class="backlog-list"
        @dragover.prevent
        @drop="onDropToBacklog"
      >
        <div
          v-for="task in backlogTasks"
          :key="task.id"
          class="backlog-task"
          draggable="true"
          @dragstart="onDragStart(task)"
          @dragend="onDragEnd"
        >
          <div class="task-content">
            <span class="task-title">{{ task.title }}</span>
          </div>
          <div class="task-actions">
            <button class="action-btn" @click="assignToToday(task.id)" title="На сегодня">
              <Icon name="calendar" size="16" />
            </button>
            <button class="action-btn delete" @click="deleteTask(task.id)" title="Удалить">
              <Icon name="trash" size="16" />
            </button>
          </div>
        </div>

        <!-- Пустое состояние -->
        <div v-if="backlogTasks.length === 0" class="empty-backlog">
          <div class="empty-icon">📋</div>
          <p>Нет задач</p>
          <span>Добавьте или перетащите сюда</span>
        </div>
      </div>
    </aside>

    <!-- Модальное окно создания события -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEventModal" class="modal-overlay" @click.self="closeEventModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Новое событие</h3>
              <button class="modal-close" @click="closeEventModal">
                <Icon name="close" size="18" />
              </button>
            </div>

            <div class="modal-body">
              <!-- Название -->
              <div class="form-group">
                <label>Название</label>
                <input 
                  v-model="eventForm.title" 
                  type="text" 
                  placeholder="Введите название события..."
                  autofocus
                />
              </div>

              <!-- Дата -->
              <div class="form-group">
                <label>Дата</label>
                <input 
                  v-model="eventForm.date" 
                  type="date"
                />
              </div>

              <!-- Цвет -->
              <div class="form-group">
                <label>Цвет</label>
                <div class="color-picker">
                  <button
                    v-for="color in EVENT_COLORS"
                    :key="color.value"
                    :class="['color-option', { active: eventForm.color === color.value }]"
                    :style="{ background: color.value }"
                    :title="color.name"
                    @click="eventForm.color = color.value"
                  />
                </div>
              </div>

              <!-- Иконка -->
              <div class="form-group">
                <label>Иконка</label>
                <div class="icon-picker">
                  <button
                    v-for="icon in EVENT_ICONS"
                    :key="icon.value"
                    :class="['icon-option', { active: eventForm.icon === icon.value }]"
                    :title="icon.name"
                    @click="eventForm.icon = icon.value"
                  >
                    <Icon :name="icon.value" size="20" />
                  </button>
                </div>
              </div>

              <!-- Превью -->
              <div class="form-group">
                <label>Превью</label>
                <div 
                  class="event-preview"
                  :style="{ '--preview-color': eventForm.color }"
                >
                  <div class="preview-icon" :style="{ color: eventForm.color }">
                    <Icon :name="eventForm.icon" size="32" />
                  </div>
                  <span class="preview-title">{{ eventForm.title || 'Название события' }}</span>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn-cancel" @click="closeEventModal">Отмена</button>
              <button 
                class="btn-create" 
                @click="createEvent"
                :disabled="!eventForm.title.trim() || !eventForm.date"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.25rem;
  overflow: hidden;
}

// Main Area
.main-area {
  @include flex-column;
  min-height: 0;
  overflow: hidden;
}

// Header
.calendar-header {
  @include flex-between;
  padding-bottom: 0.5rem;
  flex-shrink: 0;
}

.nav-controls {
  @include flex-center;
  gap: 0.5rem;
}

.nav-btn {
  width: 28px;
  height: 28px;
  @include flex-center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  color: var(--color-text-secondary);
  cursor: pointer;
  @include transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--color-text-primary);
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }
}

.month-title {
  font-size: 0.9375rem;
  font-weight: 600;
  text-transform: capitalize;
  cursor: pointer;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  @include transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}

.header-actions {
  @include flex-center;
  gap: 0.75rem;
}

.add-event-btn {
  @include flex-center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: var(--color-accent-primary);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  @include transition-fast;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
}

.stats-badge {
  @include flex-center;
  gap: 0.125rem;
  padding: 0.375rem 0.75rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;

  .stats-done {
    color: var(--color-accent-primary);
  }

  .stats-divider {
    color: var(--color-text-muted);
  }

  .stats-total {
    color: var(--color-text-secondary);
  }
}

// Weekdays
.weekdays-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  flex-shrink: 0;
  margin-bottom: 4px;
}

.weekday-cell {
  text-align: center;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  padding: 0.375rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &.weekend {
    color: rgba(239, 68, 68, 0.7);
  }
}

// Calendar Grid
.calendar-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(var(--rows), 1fr);
  gap: 6px;
  min-height: 0;
}

.day-cell {
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 6px;
  @include flex-column;
  min-height: 0;
  overflow: hidden;
  transition: background 0.15s ease, border-color 0.15s ease;
  will-change: background;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.08);
  }

  &.other-month {
    opacity: 0.35;
  }

  &.today {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.25);

    .day-number {
      background: var(--color-accent-primary);
      color: white;
    }
  }

  &.drag-over:hover {
    background: rgba(99, 102, 241, 0.15);
    border-color: var(--color-accent-primary);
  }

  // Выходные дни
  &.weekend {
    background: rgba(239, 68, 68, 0.04);
    border-color: rgba(239, 68, 68, 0.1);

    .day-number {
      color: rgba(239, 68, 68, 0.85);
    }
  }

  // Праздничные дни
  &.holiday {
    background: rgba(16, 185, 129, 0.06);
    border-color: rgba(16, 185, 129, 0.15);

    .day-number {
      color: var(--color-accent-secondary);
    }
  }

  // Праздник в выходной
  &.weekend.holiday {
    background: rgba(16, 185, 129, 0.06);
    border-color: rgba(16, 185, 129, 0.15);

    .day-number {
      color: var(--color-accent-secondary);
    }
  }

  // Событие
  &.has-event {
    border-color: var(--event-color, var(--color-accent-primary));
    border-width: 2px;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        var(--event-color) 0%,
        transparent 70%
      );
      opacity: 0.25;
      border-radius: inherit;
      pointer-events: none;
    }
  }
}

.event-bg-icon {
  position: absolute;
  bottom: 4px;
  right: 4px;
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
}

.day-header {
  @include flex-between;
  flex-shrink: 0;
  margin-bottom: 6px;
  position: relative;
  z-index: 1;
}

.holiday-indicator {
  font-size: 0.75rem;
  cursor: help;
}

.day-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  border-radius: 8px;
  @include transition-fast;
}

.day-events {
  position: relative;
  z-index: 1;
  @include flex-column;
  gap: 2px;
  margin-bottom: 4px;
}

.event-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 600;
  color: white;
  @include truncate;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.8;
  }
}

.day-tasks {
  flex: 1;
  overflow-y: auto;
  @include thin-scrollbar;
  @include flex-column;
  gap: 4px;
  position: relative;
  z-index: 1;
}

.day-task {
  @include flex-start;
  gap: 5px;
  padding: 4px 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  cursor: grab;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    cursor: grabbing;
  }

  &.completed {
    opacity: 0.5;

    .task-text {
      text-decoration: line-through;
      color: var(--color-text-muted);
    }

    .task-checkbox {
      background: var(--color-success);
      border-color: var(--color-success);
      color: white;
    }
  }

  .task-checkbox {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    @include flex-center;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    cursor: pointer;
    @include transition-fast;

    &:hover {
      border-color: var(--color-accent-primary);
      background: rgba(99, 102, 241, 0.1);
    }
  }

  .task-text {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-primary);
    @include truncate;
    line-height: 1.4;
  }
}

// Backlog Panel
.backlog-panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.25rem;
  @include flex-column;
  overflow: hidden;
}

.backlog-header {
  @include flex-between;
  margin-bottom: 1rem;
  flex-shrink: 0;

  h3 {
    font-size: 1.125rem;
    font-weight: 700;
  }

  .backlog-count {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-accent-primary);
    background: rgba(99, 102, 241, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 100px;
  }
}

.add-form {
  @include flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-shrink: 0;

  input {
    flex: 1;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    color: var(--color-text-primary);
    font-size: 0.875rem;
    transition: border-color 0.15s ease, background 0.15s ease;

    &:focus {
      outline: none;
      border-color: var(--color-accent-primary);
      background: rgba(99, 102, 241, 0.08);
    }

    &::placeholder {
      color: var(--color-text-muted);
    }
  }

  .add-btn {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    @include flex-center;
    background: var(--color-accent-primary);
    border: none;
    border-radius: 12px;
    color: white;
    cursor: pointer;
    transition: opacity 0.15s ease;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}

.backlog-list {
  flex: 1;
  overflow-y: auto;
  @include custom-scrollbar;
  @include flex-column;
  gap: 0.5rem;
  min-height: 100px;
  padding: 4px;
  border-radius: 16px;
  
  &:empty, &:has(.empty-backlog) {
    border: 2px dashed rgba(255, 255, 255, 0.08);
  }
}

.backlog-task {
  @include flex-between;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  cursor: grab;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);

    .task-actions {
      opacity: 1;
    }
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.98);
  }

  .task-content {
    flex: 1;
    min-width: 0;
  }

  .task-title {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-text-primary);
    @include truncate;
    display: block;
  }

  .task-actions {
    @include flex-center;
    gap: 0.375rem;
    opacity: 0;
    transform: translateX(8px);
    @include transition-fast;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    @include flex-center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    color: var(--color-text-muted);
    cursor: pointer;
    @include transition-fast;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--color-text-primary);
      transform: scale(1.1);
    }

    &.delete:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.2);
      color: var(--color-danger);
    }
  }
}

.empty-backlog {
  flex: 1;
  @include flex-column;
  @include flex-center;
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);

  .empty-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    opacity: 0.6;
  }

  p {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
    color: var(--color-text-secondary);
  }

  span {
    font-size: 0.8125rem;
    opacity: 0.7;
  }
}

// Modal
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  @include flex-center;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-width: 440px;
  background: var(--color-bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
}

.modal-header {
  @include flex-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
  }

  .modal-close {
    width: 32px;
    height: 32px;
    @include flex-center;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    border-radius: 8px;
    color: var(--color-text-muted);
    cursor: pointer;
    @include transition-fast;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--color-text-primary);
    }
  }
}

.modal-body {
  padding: 1.5rem;
  @include flex-column;
  gap: 1.25rem;
}

.form-group {
  @include flex-column;
  gap: 0.5rem;

  label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  input[type="text"],
  input[type="date"] {
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: var(--color-text-primary);
    font-size: 0.9375rem;
    @include transition-fast;

    &:focus {
      outline: none;
      border-color: var(--color-accent-primary);
      background: rgba(99, 102, 241, 0.08);
    }

    &::placeholder {
      color: var(--color-text-muted);
    }
  }

  input[type="date"] {
    cursor: pointer;

    &::-webkit-calendar-picker-indicator {
      filter: invert(0.7);
      cursor: pointer;
    }
  }
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-option {
  width: 32px;
  height: 32px;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  @include transition-fast;

  &:hover {
    transform: scale(1.1);
  }

  &.active {
    border-color: white;
    box-shadow: 0 0 0 2px var(--color-bg-secondary), 0 0 0 4px currentColor;
  }
}

.icon-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.icon-option {
  width: 40px;
  height: 40px;
  @include flex-center;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: var(--color-text-secondary);
  cursor: pointer;
  @include transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-text-primary);
  }

  &.active {
    background: rgba(99, 102, 241, 0.15);
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary);
  }
}

.event-preview {
  position: relative;
  padding: 1rem;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--preview-color) 30%, transparent) 0%,
    transparent 100%
  );
  border: 1px solid var(--preview-color);
  border-radius: 12px;
  overflow: hidden;

  .preview-icon {
    position: absolute;
    bottom: 8px;
    right: 8px;
    opacity: 0.2;
  }

  .preview-title {
    position: relative;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-primary);
  }
}

.modal-footer {
  @include flex-end;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.btn-cancel {
  padding: 0.625rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  @include transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-text-primary);
  }
}

.btn-create {
  padding: 0.625rem 1.5rem;
  background: var(--color-accent-primary);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  @include transition-fast;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

// Modal animation
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;

  .modal-content {
    transition: transform 0.2s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-content {
    transform: scale(0.95) translateY(-20px);
  }
}

// Responsive
@media (max-width: 1000px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }

  .backlog-panel {
    max-height: 240px;
  }
}
</style>
