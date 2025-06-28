// src/modules/theme.ts
import { storage } from 'webextension-polyfill'

export const THEME_KEY = 'theme'

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

export async function getCurrentTheme(): Promise<ThemeMode> {
  const { [THEME_KEY]: theme } = await storage.local.get(THEME_KEY)
  return theme || ThemeMode.LIGHT
}

export async function toggleTheme(): Promise<ThemeMode> {
  const current = await getCurrentTheme()
  const newTheme = current === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT
  await storage.local.set({ [THEME_KEY]: newTheme })
  broadcastThemeChange(newTheme)
  return newTheme
}

export function applyThemeFilter(theme: ThemeMode) {
  const styleId = 'theme-filter-style'
  let style = document.getElementById(styleId)

  if (!style) {
    style = document.createElement('style')
    style.id = styleId
    document.head.appendChild(style)
  }

  if (theme === ThemeMode.DARK) {
    style.textContent = `
      :root {
        filter: invert(1) hue-rotate(180deg) !important;
        background-color: white !important;
      }
      
      /* 排除不需要反转的元素 */
      img, video, iframe, canvas, [data-theme-ignore] {
        filter: invert(1) hue-rotate(180deg) !important;
      }
      
      /* 特殊处理 SVG */
      svg {
        filter: none !important;
      }
    `
  }
  else {
    style.textContent = ''
  }
}

export function watchThemeChanges(callback: (theme: ThemeMode) => void) {
  // 监听存储变化
  storage.local.onChanged.addListener((changes) => {
    if (changes[THEME_KEY]) {
      callback(changes[THEME_KEY].newValue)
    }
  })

  // 初始设置
  getCurrentTheme().then(callback)
}

export function broadcastThemeChange(theme: ThemeMode) {
  browser.tabs.query({}).then((tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        browser.tabs.sendMessage(tab.id, {
          type: 'THEME_CHANGE',
          theme,
        })
      }
    })
  })
}
