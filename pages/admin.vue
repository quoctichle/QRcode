<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">📊 Admin - Quản lý QR Code</h1>
        <button
          @click="refreshData"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          🔄 Làm mới
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p class="text-gray-600 dark:text-gray-400 text-sm">Tổng QR Code</p>
          <p class="text-3xl font-bold text-blue-600">{{ qrCodes.length }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p class="text-gray-600 dark:text-gray-400 text-sm">Gmail duy nhất</p>
          <p class="text-3xl font-bold text-green-600">{{ uniqueGmails.length }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p class="text-gray-600 dark:text-gray-400 text-sm">Tổng URL</p>
          <p class="text-3xl font-bold text-purple-600">{{ uniqueUrls.length }}</p>
        </div>
      </div>

      <!-- Search & Filter -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm Gmail hoặc URL..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
        />
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400">⏳ Đang tải dữ liệu...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
        <p>❌ {{ errorMessage }}</p>
      </div>

      <!-- Data Table -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div v-if="filteredQRCodes.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
          <p>Không có dữ liệu</p>
        </div>
        <table v-else class="w-full">
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">STT</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">Gmail</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">URL</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">Thời gian tạo</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">QR Code</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="(qrCode, index) in filteredQRCodes"
              :key="qrCode._id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td class="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{{ index + 1 }}</td>
              <td class="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{{ qrCode.gmail }}</td>
              <td class="px-6 py-4 text-sm text-blue-600 dark:text-blue-400 break-words max-w-xs">
                <a :href="qrCode.url" target="_blank" class="hover:underline">{{ truncateUrl(qrCode.url) }}</a>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ formatDate(qrCode.createdAt) }}</td>
              <td class="px-6 py-4 text-sm">
                <button
                  @click="viewQRCode(qrCode)"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                >
                  👁️ Xem
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal để xem QR Code -->
    <div
      v-if="selectedQRCode"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="selectedQRCode = null"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white">QR Code</h2>
          <button
            @click="selectedQRCode = null"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>
        <div class="text-center">
          <img :src="selectedQRCode.qrCode" alt="QR Code" class="w-64 h-64 mx-auto mb-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg" />
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Gmail: <strong>{{ selectedQRCode.gmail }}</strong></p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">URL: <strong>{{ selectedQRCode.url }}</strong></p>
          <a
            :href="selectedQRCode.qrCode"
            download="qr_code.png"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors inline-block"
          >
            📥 Download
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface QRCodeData {
  _id: string
  gmail: string
  url: string
  qrCode: string
  createdAt: string
}

const qrCodes = ref<QRCodeData[]>([])
const selectedQRCode = ref<QRCodeData | null>(null)
const searchQuery = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const uniqueGmails = computed(() => {
  const gmails = new Set(qrCodes.value.map((qr) => qr.gmail))
  return Array.from(gmails)
})

const uniqueUrls = computed(() => {
  const urls = new Set(qrCodes.value.map((qr) => qr.url))
  return Array.from(urls)
})

const filteredQRCodes = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return qrCodes.value.filter(
    (qr) =>
      qr.gmail.toLowerCase().includes(query) ||
      qr.url.toLowerCase().includes(query)
  )
})

const fetchQRCodes = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await fetch('/api/qrcode')
    const data = await response.json()
    if (data.success) {
      qrCodes.value = data.data
    } else {
      errorMessage.value = 'Không thể tải dữ liệu'
    }
  } catch (error) {
    errorMessage.value = `Lỗi: ${error}`
    console.error('Error fetching QR codes:', error)
  } finally {
    isLoading.value = false
  }
}

const refreshData = () => {
  fetchQRCodes()
}

const viewQRCode = (qrCode: QRCodeData) => {
  selectedQRCode.value = qrCode
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN')
}

const truncateUrl = (url: string) => {
  return url.length > 50 ? url.substring(0, 50) + '...' : url
}

onMounted(() => {
  fetchQRCodes()
})
</script>
