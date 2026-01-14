<script setup lang="ts">
</script>

<template>
  <div class="page-container">
    <header class="page-header">
      <h1>🎯 Цели</h1>
      <p>Управляйте своими целями и отслеживайте прогресс</p>
    </header>
    
    <div class="placeholder-content">
      <div class="placeholder-icon">🚀</div>
      <h2>Раздел в разработке</h2>
      <p>Здесь появится функционал для управления вашими целями</p>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--color-text-muted);
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: var(--color-bg-card);
  border: 1px dashed var(--color-border);
  border-radius: var(--border-radius-lg);
  text-align: center;
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.placeholder-content h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
}

.placeholder-content p {
  color: var(--color-text-muted);
}
</style>
