<template>
  <div>
    <NuxtRouteAnnouncer />
    <QRCodeGenerator :is-dark-mode="isDarkMode" @toggle-dark-mode="toggleDarkMode" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QRCodeGenerator from './components/QRCodeGenerator.vue'

const isDarkMode = ref(false)

useHead({
  bodyAttrs: {
    class: 'bg-gray-100 dark:bg-gray-900 transition-colors duration-300'
  }
})

onMounted(() => {
  if (localStorage.getItem('darkMode') === 'true') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
})

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
  }
}
</script>
