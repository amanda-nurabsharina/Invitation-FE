
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address: string;
  avatar: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  menus?: Menu[];
  created_at: string;
}

export interface Menu {
  id: string;
  title: string;
  path: string;
  icon: string;
  order: number;
  parent_id?: string;
  children?: Menu[];
}

// Icon map: backend stores simple icon names, frontend maps to SVG paths
export const MENU_ICONS: Record<string, string> = {
  dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  palette: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  grid: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  clipboard: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  chat: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  key: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
};

// Group definitions: maps menu order ranges to section labels
export const MENU_GROUPS: { label: string; minOrder: number; maxOrder: number }[] = [
  { label: '', minOrder: 1, maxOrder: 9 },
  { label: 'Administration', minOrder: 10, maxOrder: 19 },
  { label: 'Settings', minOrder: 20, maxOrder: 99 },
];

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [] as User[],
    roles: [] as Role[],
    menus: [] as Menu[],
    myMenus: [] as Menu[],
    myMenusLoaded: false,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    // Group myMenus into sections for sidebar rendering
    groupedMenus(): { label: string; items: Menu[] }[] {
      const sorted = [...this.myMenus].sort((a, b) => a.order - b.order);
      const groups: { label: string; items: Menu[] }[] = [];

      for (const group of MENU_GROUPS) {
        const items = sorted.filter(m => m.order >= group.minOrder && m.order <= group.maxOrder);
        if (items.length > 0) {
          groups.push({ label: group.label, items });
        }
      }

      return groups;
    },
  },

  actions: {
    // Fetch menus for the current user's role
    async fetchMyMenus() {
      if (this.myMenusLoaded) return;
      try {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();
        const response = await $fetch<any>(`${config.public.apiBaseUrl}/my-menus`, {
          headers: { Authorization: `Bearer ${authStore.accessToken}` },
        });
        if (!response.error) {
          this.myMenus = response.data || [];
          this.myMenusLoaded = true;
        }
      } catch (err: any) {
        console.error('Failed to fetch my menus:', err);
        this.myMenus = [];
      }
    },

    // Reset my menus (on logout)
    resetMyMenus() {
      this.myMenus = [];
      this.myMenusLoaded = false;
    },

    async fetchUsers(limit = 10, offset = 0) {
      this.loading = true;
      try {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();
        const response = await $fetch<any>(`${config.public.apiBaseUrl}/admin/users?limit=${limit}&offset=${offset}`, {
          headers: { Authorization: `Bearer ${authStore.accessToken}` },
        });
        if (!response.error) {
          this.users = response.data;
        } else {
          this.error = response.message;
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch users';
      } finally {
        this.loading = false;
      }
    },

    async createUser(payload: any) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      const response = await $fetch<any>(`${config.public.apiBaseUrl}/admin/users`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
        body: payload,
      });
      if (response.error) throw new Error(response.message);
      return response.data;
    },

    async updateUser(id: string, payload: any) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      const response = await $fetch<any>(`${config.public.apiBaseUrl}/admin/users/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
        body: payload,
      });
      if (response.error) throw new Error(response.message);
      return response.data;
    },

    async deleteUser(id: string) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      await $fetch<any>(`${config.public.apiBaseUrl}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      });
      this.users = this.users.filter(u => u.id !== id);
    },

    // Roles
    async fetchRoles() {
      this.loading = true;
      try {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();
        const response = await $fetch<any>(`${config.public.apiBaseUrl}/admin/roles`, {
          headers: { Authorization: `Bearer ${authStore.accessToken}` },
        });
        if (!response.error) {
          this.roles = response.data || [];
        }
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async createRole(payload: any) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      const response = await $fetch<any>(`${config.public.apiBaseUrl}/admin/roles`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
        body: payload,
      });
      if (response.error) throw new Error(response.message);
      return response.data;
    },

    async deleteRole(id: string) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      await $fetch<any>(`${config.public.apiBaseUrl}/admin/roles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      });
      this.roles = this.roles.filter(r => r.id !== id);
    },

    // Menus (admin CRUD)
    async fetchMenus() {
      this.loading = true;
      try {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();
        const response = await $fetch<any>(`${config.public.apiBaseUrl}/admin/menus`, {
          headers: { Authorization: `Bearer ${authStore.accessToken}` },
        });
        if (!response.error) {
          this.menus = response.data || [];
        }
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async createMenu(payload: any) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      const response = await $fetch<any>(`${config.public.apiBaseUrl}/admin/menus`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
        body: payload,
      });
      if (response.error) throw new Error(response.message);
      return response.data;
    },

    async deleteMenu(id: string) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      await $fetch<any>(`${config.public.apiBaseUrl}/admin/menus/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      });
      this.menus = this.menus.filter(m => m.id !== id);
    },

    // Role-Menu Assignments
    async assignMenuToRole(roleId: string, menuId: string) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      await $fetch<any>(`${config.public.apiBaseUrl}/admin/roles/${roleId}/menus`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
        body: { menu_id: menuId },
      });
    },
    
    async removeMenuFromRole(roleId: string, menuId: string) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      await $fetch<any>(`${config.public.apiBaseUrl}/admin/roles/${roleId}/menus/${menuId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      });
    },

    async fetchRoleMenus(roleId: string): Promise<Menu[]> {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      const response = await $fetch<any>(`${config.public.apiBaseUrl}/admin/roles/${roleId}/menus`, {
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      });
      return (response.data || []) as Menu[];
    }
  },
});
