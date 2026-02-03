<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <!-- Logo/Title -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2">
          <span class="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            QR Code
          </span>
        </h1>
        <p class="text-gray-600 dark:text-gray-400">Vui lòng đăng nhập để tiếp tục</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📧 Gmail
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="example@gmail.com"
            required
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
          />
          <p v-if="errorMessage" class="mt-2 text-sm text-red-500">
            {{ errorMessage }}
          </p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="isLoading">⏳ Đang xử lý...</span>
          <span v-else>🚀 Đăng nhập</span>
        </button>
      </form>


      <!-- Footer -->
      <p class="text-center mt-6 text-xs text-gray-500 dark:text-gray-400">
        Bản quyền © 2026 TICHLE - Công cụ tạo mã QR tiện lợi
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'blank'
  // Không dùng middleware vì pages/index.vue đã handle
})

// Manual composable vì import không hoạt động
const userEmail = useState<string | null>('userEmail', () => null)
const isLoading = ref(false)
const email = ref('')
const errorMessage = ref('')

const login = (emailInput: string) => {
  isLoading.value = true
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailInput)) {
      throw new Error('Email không hợp lệ')
    }

    userEmail.value = emailInput
    localStorage.setItem('userEmail', emailInput)
    return true
  } catch (error) {
    console.error('Lỗi đăng nhập:', error)
    return false
  } finally {
    isLoading.value = false
  }
}

const handleLogin = async () => {
  errorMessage.value = ''

  if (!email.value.trim()) {
    errorMessage.value = 'Vui lòng nhập Gmail'
    return
  }

  const success = login(email.value)
  if (success) {
    await navigateTo('/')
  } else {
    errorMessage.value = 'Email không hợp lệ. Vui lòng kiểm tra lại.'
    email.value = ''
  }
}
</script>

<style scoped>
input::placeholder {
  @apply text-gray-400 dark:text-gray-500;
}
</style>
