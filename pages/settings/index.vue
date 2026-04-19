<template>
  <NuxtLayout name="dashboard">
    <header class="bg-white border-b border-gray-200 px-8 py-6">
      <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
      <p class="text-gray-500 mt-1">Manage your account and preferences</p>
    </header>

    <div class="p-8 max-w-2xl">
      <!-- Profile Section -->
      <div class="card p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
        
        <div class="space-y-4">
          <div>
            <label class="label">Email</label>
            <input 
              :value="authStore.user?.email" 
              type="email" 
              class="input bg-gray-50" 
              disabled 
            />
          </div>
          
          <div>
            <label class="label">Full Name</label>
            <input 
              v-model="profile.fullName" 
              type="text" 
              class="input" 
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <button class="btn-primary mt-6" @click="saveProfile">
          Save Changes
        </button>
      </div>

      <!-- Password Section -->
      <div class="card p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
        
        <div class="space-y-4">
          <div>
            <label class="label">Current Password</label>
            <input 
              v-model="password.current" 
              type="password" 
              class="input" 
              placeholder="Enter current password"
            />
          </div>
          
          <div>
            <label class="label">New Password</label>
            <input 
              v-model="password.new" 
              type="password" 
              class="input" 
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label class="label">Confirm New Password</label>
            <input 
              v-model="password.confirm" 
              type="password" 
              class="input" 
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <button class="btn-secondary mt-6" @click="changePassword">
          Change Password
        </button>
      </div>

      <!-- Danger Zone -->
      <div class="card p-6 border-red-200">
        <h2 class="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
        <p class="text-gray-500 text-sm mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false,
})

const authStore = useAuthStore()

const profile = reactive({
  fullName: authStore.user?.full_name || '',
})

const password = reactive({
  current: '',
  new: '',
  confirm: '',
})

const saveProfile = () => {
  alert('Profile saved! (Feature coming soon)')
}

const changePassword = () => {
  if (password.new !== password.confirm) {
    alert('Passwords do not match')
    return
  }
  alert('Password changed! (Feature coming soon)')
}
</script>
