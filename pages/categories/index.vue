<template>
  <NuxtLayout name="dashboard">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Theme Categories</h1>
          <p class="text-gray-500 mt-1">Manage master templates for themes.</p>
        </div>
        <NuxtLink to="/categories/create" class="btn-primary flex items-center gap-2">
          <span>+ New Category</span>
        </NuxtLink>
      </div>

      <!-- Categories List -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-gray-500">
          Loading categories...
        </div>
        
        <div v-else-if="categories.length === 0" class="p-12 text-center">
          <div class="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📂</span>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">No Categories Found</h3>
          <p class="text-gray-500 mb-6">Start by creating your first template category.</p>
          <NuxtLink to="/categories/create" class="btn-secondary">Create Category</NuxtLink>
        </div>

        <table v-else class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th class="px-6 py-4">Name</th>
              <th class="px-6 py-4">Slug</th>
              <th class="px-6 py-4">Description</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900">{{ category.name }}</div>
              </td>
              <td class="px-6 py-4">
                <code class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">{{ category.slug }}</code>
              </td>
              <td class="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">
                {{ category.description || '-' }}
              </td>
              <td class="px-6 py-4 text-right flex justify-end gap-2">
                <NuxtLink :to="`/categories/${category.id}/edit`" class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                  ✏️
                </NuxtLink>
                <button @click="deleteCategory(category.id)" class="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const config = useRuntimeConfig()
const authStore = useAuthStore()
const categories = ref<any[]>([])
const loading = ref(true)

const fetchCategories = async () => {
  loading.value = true
  try {
    const res: any = await $fetch(`${config.public.apiBaseUrl}/categories`)
    if (res.data) {
      categories.value = res.data
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    loading.value = false
  }
}

const deleteCategory = async (id: string) => {
  if (!confirm('Are you sure? This action cannot be undone.')) return

  try {
    await $fetch(`${config.public.apiBaseUrl}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    })
    // Refresh list
    categories.value = categories.value.filter(c => c.id !== id)
  } catch (error) {
    console.error('Failed to delete category:', error)
    alert('Failed to delete category')
  }
}

onMounted(() => {
  fetchCategories()
})
</script>
