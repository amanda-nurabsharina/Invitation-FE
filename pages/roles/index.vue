
<template>
  <NuxtLayout name="dashboard">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Role Management</h1>
        <button @click="openCreateModal" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Add Role
        </button>
      </div>

      <!-- Role Table -->
      <div class="bg-white rounded-xl shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="role in adminStore.roles" :key="role.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ role.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ role.description }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="editRole(role)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit & Permissions</button>
                <button @click="deleteRole(role.id)" class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ isEditing ? 'Edit Role & Permissions' : 'Create New Role' }}
              </h3>
              <div class="mt-4 space-y-4">
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Role Name</label>
                    <input v-model="form.name" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea v-model="form.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                  </div>
                </div>

                <!-- Menu Permissions -->
                <div v-if="allMenuItems.length > 0">
                  <h4 class="text-md font-medium text-gray-900 mt-4 mb-2">Menu Access</h4>
                  <div class="border border-gray-200 rounded-md p-4 max-h-60 overflow-y-auto">
                    <div v-for="menu in allMenuItems" :key="menu.id" class="flex items-center mb-2">
                        <input type="checkbox" :value="menu.id" v-model="selectedMenuIds" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                        <label class="ml-2 block text-sm text-gray-900">
                            {{ menu.title }} <span class="text-xs text-gray-500">({{ menu.path }})</span>
                        </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="saveRole" type="button" :disabled="saving" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
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
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '~/stores/admin';
import type { Role, Menu } from '~/stores/admin';

const adminStore = useAdminStore();
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const selectedMenuIds = ref<string[]>([]);
const saving = ref(false);

const form = ref({
  name: '',
  description: ''
});

// Flatten menus including children for checkbox list
const allMenuItems = computed(() => {
  const items: Menu[] = [];
  for (const menu of adminStore.menus) {
    items.push(menu);
    if (menu.children) {
      for (const child of menu.children) {
        items.push(child);
      }
    }
  }
  return items;
});

onMounted(() => {
  adminStore.fetchRoles();
  adminStore.fetchMenus();
});

const openCreateModal = () => {
    isEditing.value = false;
    editingId.value = null;
    form.value = { name: '', description: '' };
    selectedMenuIds.value = [];
    showModal.value = true;
};

const editRole = async (role: Role) => {
    isEditing.value = true;
    editingId.value = role.id;
    form.value = {
        name: role.name,
        description: role.description
    };
    
    // Fetch assigned menus
    try {
        const assigned = await adminStore.fetchRoleMenus(role.id);
        selectedMenuIds.value = assigned.map(m => m.id);
    } catch {
        selectedMenuIds.value = [];
    }
    
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    isEditing.value = false;
    editingId.value = null;
    form.value = { name: '', description: '' };
    selectedMenuIds.value = [];
};

const saveRole = async () => {
    saving.value = true;
    try {
        let roleId = editingId.value;
        
        if (isEditing.value && roleId) {
            // Update role via API
            const config = useRuntimeConfig();
            const authStore = await import('~/stores/auth').then(m => m.useAuthStore());
            await $fetch(`${config.public.apiBaseUrl}/admin/roles/${roleId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${authStore.accessToken}` },
                body: form.value,
            });
        } else {
            const newRole = await adminStore.createRole(form.value);
            roleId = newRole.id;
        }

        // Handle Menu Assignments
        if (roleId) {
             let currentIds: string[] = [];
             if (isEditing.value) {
                 try {
                     const current = await adminStore.fetchRoleMenus(roleId);
                     currentIds = current.map(m => m.id);
                 } catch { currentIds = []; }
             }
             
             const toAdd = selectedMenuIds.value.filter(id => !currentIds.includes(id));
             const toRemove = currentIds.filter(id => !selectedMenuIds.value.includes(id));
             
             for (const id of toAdd) {
                 await adminStore.assignMenuToRole(roleId, id);
             }
             for (const id of toRemove) {
                 await adminStore.removeMenuFromRole(roleId, id);
             }
        }
        
        await adminStore.fetchRoles();
        closeModal();
    } catch (e) {
        alert('Failed to save role: ' + e);
        console.error(e);
    } finally {
        saving.value = false;
    }
};

const deleteRole = async (id: string) => {
    if (confirm('Are you sure?')) {
        await adminStore.deleteRole(id);
        await adminStore.fetchRoles();
    }
}
</script>
