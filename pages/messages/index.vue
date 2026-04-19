<template>
  <NuxtLayout name="dashboard">
    <header class="bg-white border-b border-gray-200 px-8 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Guest Messages</h1>
          <p class="text-gray-500 mt-1">Manage messages and wishes from guests</p>
        </div>
        <select v-model="selectedInvitation" class="input w-64" @change="fetchMessages">
          <option value="">Select Invitation</option>
          <option v-for="inv in invitations" :key="inv.id" :value="inv.id">
            {{ inv.tenant_name }}
          </option>
        </select>
      </div>
    </header>

    <div class="p-8">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="messages.length > 0" class="space-y-4 max-w-3xl">
        <div 
          v-for="msg in messages" 
          :key="msg.id" 
          class="card p-5"
          :class="{ 'opacity-60': !msg.is_approved }"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="font-semibold text-gray-900">{{ msg.guest_name }}</span>
                <span 
                  :class="[
                    'px-2 py-0.5 text-xs rounded-full',
                    msg.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  ]"
                >
                  {{ msg.is_approved ? 'Approved' : 'Pending' }}
                </span>
              </div>
              <p class="text-gray-600">{{ msg.message }}</p>
              <p class="text-sm text-gray-400 mt-2">{{ formatDate(msg.created_at) }}</p>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <button 
                v-if="!msg.is_approved"
                @click="approveMessage(msg.id)" 
                class="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                title="Approve"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button 
                @click="deleteMessage(msg.id)" 
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p class="text-gray-500">{{ selectedInvitation ? 'No messages yet' : 'Select an invitation to view messages' }}</p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false,
})

const config = useRuntimeConfig()
const authStore = useAuthStore()

const messages = ref<any[]>([])
const invitations = ref<any[]>([])
const loading = ref(true)
const selectedInvitation = ref('')

const fetchMessages = async () => {
  if (!selectedInvitation.value) {
    messages.value = []
    return
  }
  
  loading.value = true
  try {
    const response = await $fetch<any>(`${config.public.apiBaseUrl}/invitations/${selectedInvitation.value}/messages`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    })
    messages.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch messages:', error)
  } finally {
    loading.value = false
  }
}

const approveMessage = async (id: string) => {
  try {
    await $fetch(`${config.public.apiBaseUrl}/messages/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    })
    await fetchMessages()
  } catch (error) {
    console.error('Failed to approve:', error)
  }
}

const deleteMessage = async (id: string) => {
  if (!confirm('Delete this message?')) return
  
  try {
    await $fetch(`${config.public.apiBaseUrl}/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    })
    await fetchMessages()
  } catch (error) {
    console.error('Failed to delete:', error)
  }
}

const fetchInvitations = async () => {
  try {
    const response = await $fetch<any>(`${config.public.apiBaseUrl}/my-tenants`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    })
    invitations.value = (response.data || []).map((t: any) => ({
      id: t.id,
      tenant_name: t.name,
    }))
  } catch (error) {
    console.error('Failed to fetch invitations:', error)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  await fetchInvitations()
  loading.value = false
})
</script>
