<template>
  <div class="relative">
    <NuxtRouteAnnouncer />
    <Dashboard :is-dark-mode="isDarkMode" @toggle-dark-mode="toggleDarkMode" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Dashboard from './components/Dashboard.vue'

const isDarkMode = ref(false)

useHead({
  bodyAttrs: {
    class: 'bg-gray-100 dark:bg-gray-900 transition-colors duration-300'
  }
})

onMounted(() => {
  const isDark = localStorage.getItem('darkMode') === 'true'
  isDarkMode.value = isDark
  if (isDark) {
    document.documentElement.classList.add('dark')
  }
})

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value.toString())
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<style>
@keyframes rgbLEDRun {
  0% {
    background-position: 0% center;
    box-shadow: 0 0 30px rgba(255, 0, 0, 1), inset 0 0 30px rgba(255, 0, 0, 0.5);
  }
  25% {
    background-position: 33% center;
    box-shadow: 0 0 30px rgba(0, 255, 0, 1), inset 0 0 30px rgba(0, 255, 0, 0.5);
  }
  50% {
    background-position: 66% center;
    box-shadow: 0 0 30px rgba(0, 0, 255, 1), inset 0 0 30px rgba(0, 0, 255, 0.5);
  }
  75% {
    background-position: 100% center;
    box-shadow: 0 0 30px rgba(255, 0, 255, 1), inset 0 0 30px rgba(255, 0, 255, 0.5);
  }
  100% {
    background-position: 0% center;
    box-shadow: 0 0 30px rgba(255, 0, 0, 1), inset 0 0 30px rgba(255, 0, 0, 0.5);
  }
}

@keyframes rgbLEDRunSubtle {
  0% {
    background-position: 0% center;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.9), inset 0 0 20px rgba(255, 0, 0, 0.4);
  }
  25% {
    background-position: 33% center;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.9), inset 0 0 20px rgba(0, 255, 0, 0.4);
  }
  50% {
    background-position: 66% center;
    box-shadow: 0 0 20px rgba(0, 0, 255, 0.9), inset 0 0 20px rgba(0, 0, 255, 0.4);
  }
  75% {
    background-position: 100% center;
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.9), inset 0 0 20px rgba(255, 0, 255, 0.4);
  }
  100% {
    background-position: 0% center;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.9), inset 0 0 20px rgba(255, 0, 0, 0.4);
  }
}

@keyframes rgbTextGlow {
  0% {
    text-shadow: 0 0 10px rgba(255, 0, 0, 1), 0 0 20px rgba(255, 0, 0, 0.8);
    color: rgba(255, 0, 0, 1);
  }
  25% {
    text-shadow: 0 0 10px rgba(0, 255, 0, 1), 0 0 20px rgba(0, 255, 0, 0.8);
    color: rgba(0, 255, 0, 1);
  }
  50% {
    text-shadow: 0 0 10px rgba(0, 0, 255, 1), 0 0 20px rgba(0, 0, 255, 0.8);
    color: rgba(0, 0, 255, 1);
  }
  75% {
    text-shadow: 0 0 10px rgba(255, 0, 255, 1), 0 0 20px rgba(255, 0, 255, 0.8);
    color: rgba(255, 0, 255, 1);
  }
  100% {
    text-shadow: 0 0 10px rgba(255, 0, 0, 1), 0 0 20px rgba(255, 0, 0, 0.8);
    color: rgba(255, 0, 0, 1);
  }
}

.rgb-led {
  animation: rgbLEDRun 4s linear infinite;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.rgb-led-subtle {
  animation: rgbLEDRunSubtle 4s linear infinite;
  border: 1px solid transparent;
}

.rgb-text-glow {
  animation: rgbTextGlow 4s linear infinite;
  font-weight: bold;
}
</style>


