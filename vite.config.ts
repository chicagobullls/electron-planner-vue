import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import AutoImport from 'unplugin-auto-import/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    
    // Авто-импорт Vue функций (ref, computed, watch и т.д.)
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          '@vueuse/core': [
            'useMouse',
            'useWindowSize',
            'useLocalStorage',
            'useDark',
            'useToggle',
            'useEventListener',
            'onClickOutside',
            'useElementBounding',
            'useScroll',
            'useThrottleFn',
            'useDebounceFn'
          ]
        }
      ],
      dts: 'src/types/auto-imports.d.ts',
      vueTemplate: true,
      eslintrc: {
        enabled: false
      }
    }),
    
    // SVG спрайты
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: {
        plugins: [
          { name: 'removeAttrs', params: { attrs: ['class', 'data-name'] } },
          { name: 'convertColors', params: { currentColor: true } }
        ]
      }
    }),
    
    electron([
      {
        entry: 'electron/main.ts',
        onstart(options) {
          options.startup()
        },
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['electron']
            }
          }
        }
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          options.reload()
        },
        vite: {
          build: {
            outDir: 'dist-electron'
          }
        }
      }
    ]),
    renderer()
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  css: {
    preprocessorOptions: {
      scss: {
        // Глобальные SCSS миксины доступны во всех компонентах
        additionalData: `@use "@/styles/mixins" as *;`
      }
    }
  },
  
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
