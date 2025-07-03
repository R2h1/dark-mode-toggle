<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ThemeMode, toggleTheme, watchThemeChanges } from '~/modules/theme'

const currentTheme = ref<ThemeMode>(ThemeMode.LIGHT)

onMounted(() => {
  watchThemeChanges((theme) => {
    currentTheme.value = theme
    document.documentElement.dataset.theme = theme
  })
})

async function handleToggleTheme() {
  await toggleTheme()
}
</script>

<template>
  <div class="p-4 w-64">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold">
        Theme Switcher
      </h1>
      <button
        class="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        @click="handleToggleTheme"
      >
        <div v-if="currentTheme === 'light'" class="i-ph-sun-dim-duotone text-xl" />
        <div v-else class="i-ph-moon-stars-duotone text-xl" />
      </button>
    </div>
  </div>
</template>

<style>
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
}

[data-theme="dark"] {
  --bg-color: #000000;
  --text-color: #f0f0f0;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}
</style>
