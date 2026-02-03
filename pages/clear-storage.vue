<template>
  <div class="flex items-center justify-center min-h-screen bg-blue-50">
    <div class="text-center bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold text-green-600 mb-4">✅ Đã xóa dữ liệu!</h1>
      <p class="text-gray-600 mb-6">localStorage đã được xóa sạch.</p>
      <button
        @click="redirectToHome"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
      >
        Quay về trang chủ
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// Không dùng middleware để tránh vòng lặp
const redirectToHome = () => {
  navigateTo('/')
}

onMounted(() => {
  if (process.client) {
    // Xóa tất cả localStorage
    localStorage.clear()
    console.log('✅ Đã xóa localStorage')
    
    // Tự động redirect sau 2 giây
    setTimeout(() => {
      navigateTo('/')
    }, 2000)
  }
})
</script>
