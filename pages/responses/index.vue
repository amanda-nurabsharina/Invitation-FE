<template>
  <NuxtLayout name="dashboard">
    <header class="bg-white border-b border-gray-200 px-8 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">RSVP Responses</h1>
          <p class="text-gray-500 mt-1">View and manage guest confirmations</p>
        </div>
        <div class="flex gap-3">
          <select v-model="selectedInvitation" class="input" @change="handleInvitationChange">
            <option value="">All Invitations</option>
            <option v-for="inv in invitations" :key="inv.id" :value="inv.id">
              {{ inv.tenant_name }}
            </option>
          </select>
          <button v-if="rsvps.length > 0" @click="exportRSVPs" class="btn-secondary">
            Export CSV
          </button>
        </div>
      </div>
    </header>

    <div class="p-8">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-5">
          <p class="text-sm text-gray-500 mb-1">Total Responses</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
        </div>
        <div class="card p-5">
          <p class="text-sm text-gray-500 mb-1">Attending</p>
          <p class="text-2xl font-bold text-green-600">{{ stats.attending }}</p>
        </div>
        <div class="card p-5">
          <p class="text-sm text-gray-500 mb-1">Not Attending</p>
          <p class="text-2xl font-bold text-red-600">{{ stats.notAttending }}</p>
        </div>
        <div class="card p-5">
          <p class="text-sm text-gray-500 mb-1">Total Guests</p>
          <p class="text-2xl font-bold text-indigo-600">{{ stats.totalGuests }}</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Table -->
      <div v-else-if="rsvps.length > 0" class="card overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Guest Name</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Message</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Attendance</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Guests</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="rsvp in rsvps" :key="rsvp.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <span class="font-medium text-gray-900">{{ rsvp.guest_name }}</span>
              </td>
              <td class="px-6 py-4 text-gray-600 truncate max-w-xs" :title="rsvp.message">{{ rsvp.message || '-' }}</td>
              <td class="px-6 py-4">
                <span 
                  :class="[
                    'px-2.5 py-1 rounded-full text-xs font-medium',
                    rsvp.attendance === 'attending' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]"
                >
                  {{ rsvp.attendance === 'attending' ? 'Attending' : 'Not Attending' }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-600">{{ rsvp.guest_count }}</td>
              <td class="px-6 py-4 text-gray-500 text-sm">{{ formatDate(rsvp.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty -->
      <div v-else class="text-center py-20">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-gray-500">No RSVP responses yet</p>
        <p class="text-gray-400 text-sm mt-1">Responses will appear here when guests confirm attendance</p>
      </div>
    </div>
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

const rsvps = ref<any[]>([])
const invitations = ref<any[]>([])
const loading = ref(true)
const selectedInvitation = ref('')

const stats = reactive({
  total: 0,
  attending: 0,
  notAttending: 0,
  totalGuests: 0,
})

const fetchRSVPs = async () => {
  loading.value = true
  try {
    if (!selectedInvitation.value) {
      rsvps.value = []
      loading.value = false
      return
    }
    
    const response = await $fetch<any>(`${config.public.apiBaseUrl}/invitations/${selectedInvitation.value}/rsvp`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    })
    rsvps.value = response.data || []
    
    // Calculate stats
    stats.total = rsvps.value.length
    stats.attending = rsvps.value.filter((r: any) => r.attendance === 'attending').length
    stats.notAttending = rsvps.value.filter((r: any) => r.attendance !== 'attending').length
    stats.totalGuests = rsvps.value.reduce((sum: number, r: any) => sum + (r.guest_count || 1), 0)
  } catch (error) {
    console.error('Failed to fetch RSVPs:', error)
    rsvps.value = []
  } finally {
    loading.value = false
  }
}

const exportRSVPs = async () => {
  if (!selectedInvitation.value) return
  
  try {
    const response = await $fetch<any>(`${config.public.apiBaseUrl}/invitations/${selectedInvitation.value}/rsvp/export`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    })
    
    // Download CSV
    const blob = new Blob([response], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rsvp_export_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  } catch (error) {
    console.error('Failed to export:', error)
  }
}

const fetchInvitations = async () => {
  try {
    const response = await $fetch<any>(`${config.public.apiBaseUrl}/my-tenants`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    })
    
    const tenants = response.data || []
    const invites = []

    // Fetch invitation ID for each tenant
    for (const t of tenants) {
        try {
            const invRes = await $fetch<any>(`${config.public.apiBaseUrl}/tenants/${t.id}/invitation`, {
                 headers: { Authorization: `Bearer ${authStore.accessToken}` }
            })
            if (invRes.data) {
                invites.push({
                    id: invRes.data.id, // This is the Invitation ID
                    tenant_name: t.name,
                    subdomain: t.subdomain
                })
            }
        } catch (e) {
            console.log(`No invitation found for tenant ${t.name}`)
        }
    }

    invitations.value = invites
    
    // Check if invitation_id is in query params
    const route = useRoute()
    const router = useRouter()
    
    if (route.query.invitation_id) {
        // Verify if the ID exists in our list
        const exists = invitations.value.find(i => i.id === route.query.invitation_id)
        if (exists) {
            selectedInvitation.value = route.query.invitation_id as string
        } else if (invitations.value.length > 0) {
             selectedInvitation.value = invitations.value[0].id
             // Update URL
             router.replace({ query: { ...route.query, invitation_id: selectedInvitation.value } })
        }
    } else if (invitations.value.length > 0) {
        selectedInvitation.value = invitations.value[0].id
        // Update URL
        router.replace({ query: { ...route.query, invitation_id: selectedInvitation.value } })
    }

    if (selectedInvitation.value) {
        await fetchRSVPs()
    }
  } catch (error) {
    console.error('Failed to fetch invitations:', error)
  }
}

const handleInvitationChange = () => {
    const router = useRouter()
    const route = useRoute()
    
    // Update URL query param
    router.push({ query: { ...route.query, invitation_id: selectedInvitation.value } })
    
    fetchRSVPs()
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await fetchInvitations()
})
</script>
