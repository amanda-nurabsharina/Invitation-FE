<template>
  <NuxtLayout name="dashboard">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-8 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Invitations</h1>
          <p class="text-gray-500 mt-1">Manage all your wedding invitations</p>
        </div>
        <button @click="showCreateModal = true" class="btn-primary flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Invitation
        </button>
      </div>
    </header>

    <!-- Content -->
    <div class="p-8">
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="tenants.length === 0" class="text-center py-20">
        <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">No invitations yet</h2>
        <p class="text-gray-500 mb-6 max-w-md mx-auto">Create your first wedding invitation to get started. You can customize everything from themes to music.</p>
        <button @click="showCreateModal = true" class="btn-primary">
          Create Your First Invitation
        </button>
      </div>

      <!-- Invitations Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="tenant in tenants" :key="tenant.id" class="card hover:shadow-lg transition-shadow">
          <!-- Preview Image -->
          <div class="aspect-video bg-gradient-to-br from-indigo-100 to-pink-100 rounded-lg mb-4 flex items-center justify-center">
            <div class="text-center">
              <p class="text-2xl font-script text-indigo-600">{{ tenant.name }}</p>
            </div>
          </div>

          <!-- Info -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="font-semibold text-gray-900">{{ tenant.name }}</h3>
              <p class="text-sm text-indigo-600">{{ tenant.subdomain }}.localhost:8080</p>
            </div>
            <div class="flex flex-col items-end gap-1">
              <span 
                :class="[
                  'px-2.5 py-1 rounded-full text-xs font-medium',
                  tenant.invitation_status === 'Published' ? 'bg-green-100 text-green-700' :
                  tenant.invitation_status === 'Expired' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                ]"
              >
                {{ tenant.invitation_status || 'Draft' }}
              </span>
              <span v-if="tenant.expires_at" class="text-[10px] text-gray-400">
                Exp: {{ new Date(tenant.expires_at).toLocaleDateString() }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <NuxtLink :to="`/invitations/${tenant.id}/edit`" class="flex-1 btn-primary text-center text-sm">
              Edit
            </NuxtLink>
            <a :href="`http://localhost:8080/${tenant.subdomain}`" target="_blank" class="btn-secondary text-sm px-3" title="Preview">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button @click="deleteTenant(tenant.id)" class="btn-secondary text-sm px-3 text-red-600 hover:bg-red-50" title="Delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="fixed inset-0 bg-black/50" @click="showCreateModal = false"></div>
          
          <!-- Modal -->
          <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 z-10">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Create New Invitation</h2>
            
            <form @submit.prevent="createInvitation">
              <div class="space-y-4">
                <div>
                  <label class="label">Invitation Name</label>
                  <input 
                    v-model="createForm.name" 
                    type="text" 
                    class="input" 
                    placeholder="e.g., John & Jane Wedding"
                    required
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Your invitation link will be auto-generated based on the name.
                  </p>
                </div>
              </div>
              
              <div class="flex gap-3 mt-6">
                <button type="button" @click="showCreateModal = false" class="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" :disabled="creating" class="flex-1 btn-primary">
                  {{ creating ? 'Creating...' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false,
})

const config = useRuntimeConfig()
const authStore = useAuthStore()

const tenants = ref<any[]>([])
const loading = ref(true)
const showCreateModal = ref(false)
const creating = ref(false)

const createForm = reactive({
  name: '',
})

const fetchTenants = async () => {
  loading.value = true
  try {
    const response = await $fetch<any>(`${config.public.apiBaseUrl}/my-tenants`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    })
    tenants.value = response.data || []
  } catch (error: any) {
    console.error('Failed to fetch tenants:', error)
    if (error.response?.status === 401) {
      // Token expired or invalid
      authStore.logout()
      navigateTo('/login')
    }
  } finally {
    loading.value = false
  }
}

const createInvitation = async () => {
  creating.value = true
  try {
    // Create tenant
    const tenantResponse = await $fetch<any>(`${config.public.apiBaseUrl}/tenants`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      body: createForm,
    })
    
    // Invitation is auto-created by backend now
    
    showCreateModal.value = false
    createForm.name = ''
    await fetchTenants()
  } catch (error: any) {
    alert(error.message || 'Failed to create invitation')
  } finally {
    creating.value = false
  }
}

const deleteTenant = async (id: string) => {
  if (!confirm('Are you sure you want to delete this invitation? This action cannot be undone.')) return
  
  try {
    await $fetch(`${config.public.apiBaseUrl}/tenants/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    })
    await fetchTenants()
  } catch (error) {
    alert('Failed to delete invitation')
  }
}

const route = useRoute()

onMounted(() => {
  if (route.query.create) {
    showCreateModal.value = true
  }
  fetchTenants()
})
</script>

<style scoped>
.font-script {
  font-family: 'Great Vibes', cursive;
}
</style>
