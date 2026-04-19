<template>
  <div>
    <NuxtLayout name="dashboard">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-gray-500 mt-1">Welcome back! Here's an overview of your invitations.</p>
          </div>

        </div>
      </header>

      <!-- Content -->
      <div class="p-8">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Invitations -->
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm">Total Invitations</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalInvitations }}</p>
              </div>
              <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Published -->
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm">Published</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.published }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Total RSVP -->
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm">Total RSVP</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalRsvp }}</p>
              </div>
              <div class="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Guest Messages -->
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm">Guest Messages</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.guestMessages }}</p>
              </div>
              <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Invitations -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Recent Invitations</h2>
            <NuxtLink to="/invitations" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View All →
            </NuxtLink>
          </div>

          <div v-if="invitations.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="text-gray-500">No invitations yet</p>
            <NuxtLink to="/invitations?create=true" class="btn-primary mt-4 inline-flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Invitation
            </NuxtLink>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left text-sm text-gray-500 border-b border-gray-100">
                  <th class="pb-4 font-medium">Couple</th>
                  <th class="pb-4 font-medium">Subdomain</th>
                  <th class="pb-4 font-medium">Status</th>
                  <th class="pb-4 font-medium">RSVP</th>
                  <th class="pb-4 font-medium">Created</th>
                  <th class="pb-4 font-medium"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="invitation in invitations" :key="invitation.id" class="hover:bg-gray-50">
                  <td class="py-4">
                    <p class="font-medium text-gray-900">{{ invitation.groom_nickname }} & {{ invitation.bride_nickname }}</p>
                  </td>
                  <td class="py-4">
                    <span class="text-gray-600">{{ invitation.subdomain }}</span>
                  </td>
                  <td class="py-4">
                    <span 
                      :class="[
                        'px-2.5 py-1 rounded-full text-xs font-medium',
                        invitation.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      ]"
                    >
                      {{ invitation.is_published ? 'Published' : 'Draft' }}
                    </span>
                  </td>
                  <td class="py-4 text-gray-600">{{ invitation.rsvp_count }}</td>
                  <td class="py-4 text-gray-500 text-sm">{{ formatDate(invitation.created_at) }}</td>
                  <td class="py-4">
                    <NuxtLink :to="`/invitations/${invitation.id}`" class="text-indigo-600 hover:text-indigo-700">
                      Edit
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

// Dummy data for now
const stats = reactive({
  totalInvitations: 0,
  published: 0,
  totalRsvp: 0,
  guestMessages: 0,
})

const invitations = ref<any[]>([])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// TODO: Fetch real data from API
onMounted(async () => {
  // const config = useRuntimeConfig()
  // const response = await $fetch(`${config.public.apiBaseUrl}/dashboard`)
})
</script>
