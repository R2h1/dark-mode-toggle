<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  ThemeMode,
  getCurrentTheme,
  toggleTheme,
  watchThemeChanges,
} from '~/modules/theme'

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
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">
      Theme Settings
    </h1>

    <div class="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
      <span>Dark Mode</span>
      <button
        class="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-200"
        :class="{ 'bg-blue-500': currentTheme === 'dark' }"
        @click="handleToggleTheme"
      >
        <span
          class="inline-block w-4 h-4 transform bg-white rounded-full transition"
          :class="{ 'translate-x-6': currentTheme === 'dark' }"
        />
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
