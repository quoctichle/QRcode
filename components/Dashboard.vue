<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900 rgb-led" style="border-radius: 8px">
    <!-- Sidebar -->
    <aside class="w-64 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto rgb-led-subtle" style="border-radius: 0">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">🛠️ Tool Box</h1>
      </div>

      <nav class="mt-8">
        <button
          v-for="module in modules"
          :key="module.id"
          @click="selectedModule = module.id"
          :class="[
            'w-full text-left px-6 py-3 mb-2 transition-all duration-200 mx-2 rounded',
            selectedModule === module.id
              ? 'bg-indigo-500 text-white rgb-led-subtle'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">{{ module.icon }}</span>
            <span class="font-medium">{{ module.name }}</span>
          </div>
        </button>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm p-6 flex justify-between items-center rgb-led-subtle">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
            ✨ {{ currentModule?.name }}
          </h2>
        </div>
        <div class="flex items-center gap-4">
          <!-- User Email Info -->
          <div class="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <span class="text-lg">👤</span>
            <div class="text-sm">
              <p class="text-gray-600 dark:text-gray-300">Gmail:</p>
              <p class="font-semibold text-gray-800 dark:text-white break-all max-w-xs">{{ userEmail }}</p>
            </div>
          </div>

          <!-- Dark Mode Toggle -->
          <button
            @click="$emit('toggle-dark-mode')"
            class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <svg
              v-if="isDarkMode"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>

          <!-- Logout Button -->
          <button
            @click="$emit('logout')"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-auto p-6">
        <KeepAlive>
          <QRCodeGenerator v-if="selectedModule === 'qr-code'" :is-dark-mode="isDarkMode" />
          <DevelopingModule v-else-if="selectedModule === 'developing'" />
        </KeepAlive>
      </main>

      <!-- Footer -->
      <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 text-center rgb-led-subtle">
        <p class="rgb-text-glow">✨ Author by TICHLE ✨</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import QRCodeGenerator from './QRCodeGenerator.vue'
import DevelopingModule from './DevelopingModule.vue'

// Không import useAuth vì nó chỉ dùng ở parent

defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  },
  userEmail: {
    type: String,
    default: ''
  }
})

defineEmits(['toggle-dark-mode', 'logout'])

const selectedModule = ref('qr-code')

const modules = [
  {
    id: 'qr-code',
    name: 'QR Code Generator',
    icon: '📱'
  },
  {
    id: 'developing',
    name: 'Phát triển thêm',
    icon: '🚀'
  }
]

const currentModule = computed(() => {
  return modules.find(m => m.id === selectedModule.value)
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
