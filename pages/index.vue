<template>
  <div class="min-h-screen flex items-center justify-center">
    <NuxtLink to="/login" class="btn-primary">
      Go to Login
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  authStore.initFromStorage()
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
})
</script>
