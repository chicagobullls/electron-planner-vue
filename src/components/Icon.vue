<script setup lang="ts">
interface Props {
  name: string
  size?: string | number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: '1em',
  color: 'currentColor'
})

const iconSize = computed(() => {
  if (typeof props.size === 'number') {
    return `${props.size}px`
  }
  return props.size
})

const symbolId = computed(() => `#icon-${props.name}`)
</script>

<template>
  <svg
    class="svg-icon"
    :style="{
      width: iconSize,
      height: iconSize,
      color: color
    }"
    aria-hidden="true"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>

<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  flex-shrink: 0;
  
  // Наследуем цвет от родителя через currentColor
  // fill и stroke заданы в самих SVG файлах как currentColor
}
</style>
