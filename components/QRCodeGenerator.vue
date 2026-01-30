<template>
  <div class="qr-container">
    <h1>QR Code Generator</h1>
    
    <div class="form-group">
      <div class="input-section">
        <h2>Tạo QR Code từ URL</h2>
        
        <!-- URL Input -->
        <div class="input-field">
          <label for="url-input">URL:</label>
          <input 
            id="url-input"
            v-model="urlInput" 
            type="text" 
            placeholder="http://m.me/sunshinetelecomvn"
          >
          <button @click="generateQR" class="btn btn-primary">
            Tạo QR Code
          </button>
        </div>

        <!-- Logo Upload -->
        <div class="input-field">
          <label for="logo-upload">Upload Logo (PNG/JPG):</label>
          <input 
            id="logo-upload"
            type="file" 
            accept="image/png,image/jpeg"
            @change="handleLogoUpload"
          >
          <span v-if="logoFile" class="logo-name">{{ logoFile.name }}</span>
        </div>

        <!-- QR Size Selection -->
        <div class="input-field">
          <label for="qr-size">Kích thước QR Code:</label>
          <select v-model.number="qrSize" id="qr-size">
            <option :value="1920">1920px (HD)</option>
            <option :value="2560">2560px (1440p)</option>
            <option :value="3840">3840px (4K)</option>
            <option :value="5120">5120px (5K)</option>
          </select>
        </div>
      </div>

      <!-- QR Code Display -->
      <div class="qr-display">
        <div v-if="qrGenerated" class="qr-item">
          <h3>QR Code</h3>
          <div class="qr-canvas-wrapper">
            <img :src="qrImage" alt="QR Code" class="qr-image">
          </div>
          <button @click="downloadQR" class="btn btn-success">
            Download QR Code
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QRCode from 'qrcode'

const urlInput = ref('http://m.me/sunshinetelecomvn')
const qrSize = ref(3840)
const logoFile = ref<File | null>(null)
const qrImage = ref<string>('')
const qrGenerated = ref(false)
const errorMessage = ref('')
const logoDataUrl = ref<string | null>(null)

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

  try {
    errorMessage.value = ''
    
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
  }
}

const addLogoToQR = (qrDataUrl: string, logoDataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject('Cannot get canvas context')
        return
      }

      canvas.width = qrSize.value
      canvas.height = qrSize.value

      const qrImg = new Image()
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 0, 0)

        const logoImg = new Image()
        logoImg.onload = () => {
          const logoSize = qrSize.value / 4
          const x = (qrSize.value - logoSize) / 2
          const y = (qrSize.value - logoSize) / 2

          ctx.fillStyle = 'white'
          ctx.beginPath()
          ctx.arc(x + logoSize / 2, y + logoSize / 2, (logoSize / 2) + 10, 0, Math.PI * 2)
          ctx.fill()

          ctx.drawImage(logoImg, x, y, logoSize, logoSize)

          resolve(canvas.toDataURL('image/png'))
        }
        logoImg.onerror = () => reject('Failed to load logo')
        logoImg.src = logoDataUrl
      }
      qrImg.onerror = () => reject('Failed to load QR code')
      qrImg.src = qrDataUrl
    } catch (error) {
      reject(error)
    }
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

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.qr-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

h1 {
  text-align: center;
  color: white;
  margin-bottom: 40px;
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.form-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

@media (max-width: 1024px) {
  .form-group {
    grid-template-columns: 1fr;
  }
}

.input-section {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.input-section h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.input-field {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  color: #555;
  font-size: 0.95em;
}

input[type="text"],
input[type="file"],
select {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1em;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="file"]:focus,
select:focus {
  outline: none;
  border-color: #667eea;
  background-color: #f8f9ff;
}

.logo-name {
  color: #667eea;
  font-weight: 500;
  font-size: 0.9em;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #667eea;
  color: white;
  width: 100%;
}

.btn-primary:hover {
  background-color: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-success {
  background-color: #10b981;
  color: white;
  width: 100%;
}

.btn-success:hover {
  background-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
}

.qr-display {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.qr-item {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.qr-item h3 {
  color: #333;
  font-size: 1.3em;
  width: 100%;
}

.qr-canvas-wrapper {
  background: white;
  padding: 20px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.qr-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 15px 20px;
  border-radius: 6px;
  border-left: 4px solid #c33;
  font-weight: 500;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
