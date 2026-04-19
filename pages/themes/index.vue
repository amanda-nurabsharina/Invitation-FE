<template>
  <NuxtLayout name="dashboard">
    <header
      class="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Themes</h1>
        <p class="text-gray-500 mt-1">
          Browse and manage wedding invitation themes
        </p>
      </div>
      <NuxtLink to="/themes/create" class="btn-primary">
        + Create Theme
      </NuxtLink>
    </header>

    <div class="p-8">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"
        ></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="theme in themes"
          :key="theme.id"
          class="card overflow-hidden group hover:shadow-lg transition-shadow"
        >
          <!-- Preview Image / Placeholder -->
          <div
            class="aspect-video relative bg-gray-100 flex items-center justify-center text-white font-bold text-lg overflow-hidden"
          >
            <img
              v-if="theme.preview_image"
              :src="theme.preview_image"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center"
              :style="{
                background: `linear-gradient(135deg, ${theme.colors?.primary || '#6366f1'}, ${theme.colors?.accent || '#8b5cf6'})`,
              }"
            >
              {{ theme.name }}
            </div>

            <!-- Type Badge -->
            <div class="absolute top-2 right-2">
              <span
                v-if="theme.custom_html"
                class="bg-blue-600 text-white text-xs px-2 py-1 rounded shadow"
                >Custom</span
              >
              <span
                v-else
                class="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow"
                >File</span
              >
            </div>
          </div>

          <div class="p-5">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-900">{{ theme.name }}</h3>
              <span
                :class="[
                  'px-2.5 py-1 rounded-full text-xs font-medium',
                  theme.is_premium
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-green-100 text-green-700',
                ]"
              >
                {{ theme.is_premium ? "Premium" : "Free" }}
              </span>
            </div>
            <p class="text-sm text-gray-500 mb-4 line-clamp-2">
              {{ theme.description || "Beautiful wedding invitation theme" }}
            </p>

            <div class="flex items-center justify-between mt-4">
              <div class="flex items-center gap-2">
                <span
                  class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded uppercase"
                  >{{ theme.category }}</span
                >
              </div>
              <div class="flex items-center gap-3">
                <NuxtLink
                  :to="`/themes/${theme.id}/edit`"
                  class="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                  Edit
                </NuxtLink>
                <button
                  @click="deleteTheme(theme.id)"
                  class="text-red-500 hover:text-red-700 font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && themes.length === 0" class="text-center py-20">
        <p class="text-gray-500">No themes available</p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: false,
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const themes = ref<any[]>([]);
const loading = ref(true);

const fetchThemes = async () => {
  try {
    const response = await $fetch<any>(`${config.public.apiBaseUrl}/themes`);
    themes.value = response.data || [];
  } catch (error) {
    console.error("Failed to fetch themes:", error);
  } finally {
    loading.value = false;
  }
};

const deleteTheme = async (id: string) => {
  if (
    !confirm(
      "Are you sure you want to delete this theme? This action cannot be undone.",
    )
  )
    return;

  try {
    await $fetch(`${config.public.apiBaseUrl}/admin/themes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    // Remove from local list to avoid refetching
    themes.value = themes.value.filter((t) => t.id !== id);
    alert("Theme deleted successfully");
  } catch (error: any) {
    console.error("Failed to delete theme:", error);
    alert(error?.data?.message || "Failed to delete theme");
  }
};

onMounted(() => {
  fetchThemes();
});
</script>
