
<template>
  <NuxtLayout name="dashboard">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Menu Management</h1>
        <button @click="openCreateModal" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Add Menu Item
        </button>
      </div>

      <!-- Menu Table -->
      <div class="bg-white rounded-xl shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-for="menu in adminStore.menus" :key="menu.id">
              <tr class="bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{{ menu.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ menu.path }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ menu.icon }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ menu.order }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="editMenu(menu)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button @click="deleteMenu(menu.id)" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
              <tr v-for="child in menu.children" :key="child.id" class="bg-white">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 pl-10">↳ {{ child.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ child.path }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ child.icon }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ child.order }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="editMenu(child)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button @click="deleteMenu(child.id)" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ isEditing ? 'Edit Menu' : 'Create New Menu' }}
              </h3>
              <div class="mt-4 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Title</label>
                  <input v-model="form.title" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Path</label>
                  <input v-model="form.path" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="/dashboard">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Icon</label>
                  <select v-model="form.icon" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="dashboard">Dashboard</option>
                    <option value="mail">Mail</option>
                    <option value="palette">Palette</option>
                    <option value="grid">Grid</option>
                    <option value="clipboard">Clipboard</option>
                    <option value="chat">Chat</option>
                    <option value="users">Users</option>
                    <option value="key">Key</option>
                    <option value="menu">Menu</option>
                    <option value="settings">Settings</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Order</label>
                  <input v-model.number="form.order" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <p class="mt-1 text-xs text-gray-400">1-9 = Main, 10-19 = Administration, 20+ = Settings</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Parent Menu (Optional)</label>
                  <select v-model="form.parent_id" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option :value="null">None (Root)</option>
                    <option v-for="menu in adminStore.menus" :key="menu.id" :value="menu.id">
                      {{ menu.title }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="saveMenu" :disabled="saving" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                {{ saving ? 'Saving...' : 'Save' }}
              </button>
              <button @click="closeModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '~/stores/admin';
import { useAuthStore } from '~/stores/auth';
import type { Menu } from '~/stores/admin';

const adminStore = useAdminStore();
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const saving = ref(false);

const form = ref({
  title: '',
  path: '',
  icon: 'dashboard',
  order: 0,
  parent_id: null as string | null
});

onMounted(() => {
  adminStore.fetchMenus();
});

const openCreateModal = () => {
    isEditing.value = false;
    editingId.value = null;
    form.value = { title: '', path: '', icon: 'dashboard', order: 0, parent_id: null };
    showModal.value = true;
};

const editMenu = (menu: Menu) => {
    isEditing.value = true;
    editingId.value = menu.id;
    form.value = {
        title: menu.title,
        path: menu.path,
        icon: menu.icon,
        order: menu.order,
        parent_id: menu.parent_id || null
    };
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    isEditing.value = false;
    editingId.value = null;
    form.value = { title: '', path: '', icon: 'dashboard', order: 0, parent_id: null };
};

const saveMenu = async () => {
    saving.value = true;
    try {
        if (isEditing.value && editingId.value) {
            const config = useRuntimeConfig();
            const authStore = useAuthStore();
            await $fetch(`${config.public.apiBaseUrl}/admin/menus/${editingId.value}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${authStore.accessToken}` },
                body: form.value,
            });
        } else {
            await adminStore.createMenu(form.value);
        }
        await adminStore.fetchMenus();
        // Refresh sidebar menus
        adminStore.myMenusLoaded = false;
        await adminStore.fetchMyMenus();
        closeModal();
    } catch (e) {
        alert('Failed to save menu: ' + e);
        console.error(e);
    } finally {
        saving.value = false;
    }
};

const deleteMenu = async (id: string) => {
    if (confirm('Are you sure?')) {
        await adminStore.deleteMenu(id);
        await adminStore.fetchMenus();
        // Refresh sidebar menus
        adminStore.myMenusLoaded = false;
        await adminStore.fetchMyMenus();
    }
}
</script>
