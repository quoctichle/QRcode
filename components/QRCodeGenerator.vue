<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <header class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white">
          QR Code Generator
        </h1>
        <button @click="$emit('toggle-dark-mode')" class="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
          <svg v-if="props.isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </header>

      <main class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Form Section -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Tạo QR Code</h2>

          <!-- URL Input -->
          <div class="mb-4">
            <label for="url-input" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">URL</label>
            <input id="url-input" v-model="urlInput" type="text" placeholder="http://m.me/sunshinetelecomvn" class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200">
          </div>

          <!-- Logo Upload -->
          <div class="mb-4">
            <label for="logo-upload" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Upload Logo (PNG/JPG)</label>
            <div class="flex items-center">
              <label for="logo-upload" class="cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors">
                Chọn file
              </label>
              <input id="logo-upload" type="file" accept="image/png,image/jpeg" @change="handleLogoUpload" class="hidden">
              <span v-if="logoFile" class="ml-3 text-sm text-gray-500 dark:text-gray-400">{{ logoFile.name }}</span>
            </div>
          </div>
          
          <!-- QR Size -->
          <div class="mb-6">
            <label for="qr-size" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Kích thước QR Code</label>
            <select v-model.number="qrSize" id="qr-size" class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200">
              <option :value="1920">1920px (HD)</option>
              <option :value="2560">2560px (1440p)</option>
              <option :value="3840">3840px (4K)</option>
              <option :value="5120">5120px (5K)</option>
            </select>
          </div>

          <button @click="generateQR" :disabled="isLoading" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Đang tạo...' : 'Tạo QR Code' }}
          </button>
        </div>

        <!-- QR Code Display -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[400px]">
          <div v-if="qrGenerated" class="flex flex-col items-center">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">QR Code của bạn</h3>
            <div class="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg inline-block">
                <img :src="qrImage" alt="QR Code" class="max-w-xs mx-auto rounded-md shadow-md">
            </div>
            <button @click="downloadQR" class="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md transition-colors">
              Download QR Code
            </button>
          </div>
          <div v-else class="text-center text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
            </svg>
            <p class="mt-2">QR Code sẽ được hiển thị ở đây</p>
          </div>
        </div>
      </main>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-8 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative" role="alert">
        <strong class="font-bold">Lỗi:</strong>
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>

      <!-- Footer -->
      <footer class="text-center text-gray-500 dark:text-gray-400 mt-12">
        <p>Author by Tich LE</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QRCode from 'qrcode'

const props = defineProps<{
  isDarkMode: boolean
}>()

defineEmits(['toggle-dark-mode'])

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
        dark: props.isDarkMode ? '#FFFFFF' : '#000000',
        light: props.isDarkMode ? '#111827' : '#FFFFFF'
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

        // Add a background behind the logo for better visibility
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath();
        ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2 + 5, 0, 2 * Math.PI);
        ctx.fill();

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