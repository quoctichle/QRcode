<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Form Section -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg rgb-led-subtle">
      <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">⚙️ Tạo QR Code</h3>

      <!-- URL Input -->
      <div class="mb-4">
        <label for="url-input" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">📝 URL</label>
        <input id="url-input" v-model="urlInput" type="text" placeholder="http://m.me/sunshinetelecomvn" class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200">
      </div>

      <!-- Logo Upload -->
      <div class="mb-4">
        <label for="logo-upload" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">🖼️ Upload Logo (PNG/JPG)</label>
        <div class="flex items-center">
          <label for="logo-upload" class="cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors rgb-led-subtle">
            Chọn file
          </label>
          <input id="logo-upload" type="file" accept="image/png,image/jpeg" @change="handleLogoUpload" class="hidden">
          <span v-if="logoFile" class="ml-3 text-sm text-gray-500 dark:text-gray-400">✅ {{ logoFile.name }}</span>
        </div>
      </div>
      
      <!-- QR Size -->
      <div class="mb-6">
        <label for="qr-size" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">📏 Kích thước QR Code</label>
        <select v-model.number="qrSize" id="qr-size" class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200">
          <option :value="1920">1920px (HD)</option>
          <option :value="2560">2560px (1440p)</option>
          <option :value="3840">3840px (4K)</option>
          <option :value="5120">5120px (5K)</option>
        </select>
      </div>

      <button @click="generateQR" :disabled="isLoading" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed rgb-led-subtle">
        {{ isLoading ? '⏳ Đang tạo...' : '🚀 Tạo QR Code' }}
      </button>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg rgb-led-subtle">
        <p>❌ {{ errorMessage }}</p>
      </div>
    </div>

    <!-- QR Code Display Section -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg rgb-led-subtle flex flex-col items-center justify-center min-h-[400px]">
      <div v-if="qrGenerated" class="flex flex-col items-center w-full">
        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">🎯 QR Code của bạn</h3>
        <div class="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg inline-block mb-6 rgb-led-subtle">
          <img :src="qrImage" alt="QR Code" class="max-w-xs rounded-md shadow-md">
        </div>
        <button @click="downloadQR" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md transition-colors rgb-led-subtle">
          📥 Download QR Code
        </button>
      </div>
      <div v-else class="text-center text-gray-500 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
        </svg>
        <p class="mt-2">QR Code sẽ được hiển thị ở đây</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QRCode from 'qrcode'

defineProps<{
  isDarkMode: boolean
}>()

const urlInput = ref('http://m.me/sunshinetelecomvn')
const qrSize = ref(3840)
const logoFile = ref<File | null>(null)
const qrImage = ref<string>('')
const qrGenerated = ref(false)
const errorMessage = ref('')
const logoDataUrl = ref<string | null>(null)
const isLoading = ref(false)

const handleLogoUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (file) {
    logoFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      logoDataUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const generateQR = async () => {
  if (!urlInput.value.trim()) {
    errorMessage.value = 'Vui lòng nhập URL'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  
  try {
    let qrDataUrl = await QRCode.toDataURL(urlInput.value, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: qrSize.value,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    if (logoDataUrl.value) {
      qrDataUrl = await addLogoToQR(qrDataUrl, logoDataUrl.value)
    }

    qrImage.value = qrDataUrl
    qrGenerated.value = true
  } catch (error) {
    errorMessage.value = `Error: ${error}`
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const addLogoToQR = (qrDataUrl: string, logoUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return reject('Could not get canvas context')
    }
    
    canvas.width = qrSize.value
    canvas.height = qrSize.value

    const qrImg = new Image()
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 0, 0)

      const logoImg = new Image()
      logoImg.onload = () => {
        const logoSize = qrSize.value * 0.25
        const x = (qrSize.value - logoSize) / 2
        const y = (qrSize.value - logoSize) / 2

        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2 + 5, 0, 2 * Math.PI)
        ctx.fill()

        ctx.drawImage(logoImg, x, y, logoSize, logoSize)
        resolve(canvas.toDataURL('image/png'))
      }
      logoImg.onerror = reject
      logoImg.src = logoUrl
    }
    qrImg.onerror = reject
    qrImg.src = qrDataUrl
  })
}

const downloadQR = () => {
  if (!qrImage.value) return

  const link = document.createElement('a')
  link.href = qrImage.value
  link.download = 'qr_code.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
