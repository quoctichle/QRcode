<template>
  <div />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

definePageMeta({
  layout: false,
})

const router = useRouter()

onMounted(async () => {
  // Kiểm tra localStorage
  if (process.client) {
    const savedEmail = localStorage.getItem('userEmail')
    
    // Redirect ngay (không cần setTimeout)
    if (savedEmail) {
      await router.push('/dashboard')
    } else {
      await router.push('/login')
    }
  }
})
</script>
