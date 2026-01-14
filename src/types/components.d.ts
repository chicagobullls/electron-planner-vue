/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Глобальные компоненты
declare module 'vue' {
  export interface GlobalComponents {
    Icon: typeof import('../components/Icon.vue')['default']
  }
}

export {}
