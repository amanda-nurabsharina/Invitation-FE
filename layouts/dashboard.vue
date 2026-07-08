<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Mobile Header -->
    <header class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30 lg:hidden shadow-sm">
      <div class="flex items-center gap-3">
        <button @click="isSidebarOpen = true" class="text-gray-500 hover:text-gray-700 focus:outline-none" title="Open Menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <span class="font-semibold text-gray-900 text-sm">Invitation CMS</span>
      </div>
    </header>

    <!-- Overlay Backdrop for Mobile -->
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false" 
      class="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300 transform lg:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 class="font-semibold text-gray-900">Invitation CMS</h1>
              <p class="text-xs text-gray-500">Invitation Platform</p>
            </div>
          </div>
          <!-- Close button on Mobile -->
          <button @click="isSidebarOpen = false" class="lg:hidden text-gray-400 hover:text-gray-600" title="Close Menu">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Dynamic Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <template v-for="(group, gIdx) in adminStore.groupedMenus" :key="gIdx">
            <!-- Section label -->
            <div v-if="group.label" class="pt-6">
              <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ group.label }}</p>
            </div>

            <!-- Menu items in this group -->
            <NuxtLink
              v-for="menuItem in group.items"
              :key="menuItem.id"
              :to="menuItem.path"
              class="sidebar-link"
              active-class="active"
              @click="isSidebarOpen = false"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="getIconPath(menuItem.icon)"
                />
                <!-- Settings icon has 2 paths -->
                <path
                  v-if="menuItem.icon === 'settings'"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {{ menuItem.title }}
            </NuxtLink>
          </template>

          <!-- Loading state -->
          <div v-if="!adminStore.myMenusLoaded" class="px-4 py-8 text-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
            <p class="text-xs text-gray-400 mt-2">Loading menus...</p>
          </div>
        </nav>

        <!-- User Menu -->
        <div class="p-4 border-t border-gray-100">
          <div class="flex items-center gap-3 px-3 py-2">
            <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span class="text-indigo-600 font-medium">{{ userInitials }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.user?.full_name || authStore.user?.email }}</p>
              <p class="text-xs text-gray-500 capitalize">{{ authStore.user?.role }}</p>
            </div>
            <button @click="logout" class="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Log Out">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 lg:ml-64 min-h-screen pt-16 lg:pt-0">
      <slot />
    </main>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAdminStore, MENU_ICONS } from '~/stores/admin'

const authStore = useAuthStore()
const adminStore = useAdminStore()
const router = useRouter()

const isSidebarOpen = ref(false)

const userInitials = computed(() => {
  const name = authStore.user?.full_name || authStore.user?.email || ''
  return name.substring(0, 2).toUpperCase()
})

const getIconPath = (iconName: string): string => {
  return MENU_ICONS[iconName] || MENU_ICONS['dashboard']
}

const logout = async () => {
  adminStore.resetMyMenus()
  await authStore.logout()
  router.push('/login')
}

// Protect dashboard routes & load dynamic menus
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Fetch user's accessible menus
  await adminStore.fetchMyMenus()
})
</script>
