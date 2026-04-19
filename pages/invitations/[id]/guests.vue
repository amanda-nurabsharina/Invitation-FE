<template>
  <NuxtLayout name="dashboard">
    <div class="space-y-6">
      <!-- Header -->
      <div v-if="loadingInit" class="flex items-center justify-center p-12">
        <span class="loading loading-spinner text-indigo-600"></span>
      </div>

      <div v-else class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink :to="`/invitations/${tenantId}/edit`" class="btn-secondary">
            ← Back to Invitation
          </NuxtLink>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Guest List</h1>
            <p class="text-gray-500 mt-1">
              Manage guests for <strong>{{ subdomain }}</strong>
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <a
            :href="`${config.public.apiBaseUrl}/downloads/guest-template`"
            target="_blank"
            class="btn-secondary flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Template
          </a>
          <button
            @click="showImportModal = true"
            class="btn-secondary flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Import Excel
          </button>
          <a
            v-if="invitationId"
            :href="`${config.public.apiBaseUrl}/invitations/${invitationId}/guests/export?token=${authStore.accessToken}`"
            target="_blank"
            class="btn-primary flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export List
          </a>
        </div>
      </div>

      <!-- Content -->
      <div
        v-if="!loadingInit"
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <!-- Manual Add Guest -->
        <div class="p-6 border-b border-gray-200 bg-gray-50">
          <form @submit.prevent="addGuest" class="flex gap-4 items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Guest Name</label
              >
              <input
                v-model="newGuest.name"
                type="text"
                class="input-text w-full"
                placeholder="e.g. Budi Santoso"
                required
              />
            </div>
            <div class="w-48">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Category</label
              >
              <select v-model="newGuest.type" class="input-text w-full">
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="Family">Family</option>
              </select>
            </div>
            <button type="submit" :disabled="adding" class="btn-primary px-6">
              {{ adding ? "Adding..." : "Add Guest" }}
            </button>
          </form>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <div v-if="loadingGuests" class="p-12 text-center">
            <span class="loading loading-spinner text-gray-400"></span>
          </div>
          <table v-else class="w-full text-left">
            <thead
              class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold"
            >
              <tr>
                <th class="px-6 py-4">Name</th>
                <th class="px-6 py-4">Category</th>
                <th class="px-6 py-4">Invitation Link</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="guests.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                  No guests found. Start by importing or adding manually.
                </td>
              </tr>
              <tr
                v-for="guest in guests"
                :key="guest.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 font-medium text-gray-900">
                  {{ guest.name }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="{
                      'px-2 py-1 rounded-full text-xs font-semibold': true,
                      'bg-purple-100 text-purple-700': guest.type === 'VIP',
                      'bg-blue-100 text-blue-700': guest.type === 'Family',
                      'bg-gray-100 text-gray-700': guest.type === 'Regular',
                    }"
                  >
                    {{ guest.type }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 font-mono">
                  <button
                    @click="copyLink(guest.name)"
                    class="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 group px-2 py-1 rounded hover:bg-indigo-50 transition"
                  >
                    <span>Copy Link</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <!-- <div class="text-[10px] mt-1 text-gray-400 select-all">{{ generateLink(guest.name) }}</div> -->
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    @click="deleteGuest(guest.id)"
                    class="text-red-600 hover:text-red-900 text-sm font-medium hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div
      v-if="showImportModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          Import Guests from Excel
        </h3>
        <p class="text-sm text-gray-500 mb-6">
          Upload an Excel file (.xlsx) using the template format.
        </p>

        <input
          type="file"
          ref="fileInput"
          accept=".xlsx"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mb-6"
        />

        <div class="flex justify-end gap-3">
          <button @click="showImportModal = false" class="btn-secondary">
            Cancel
          </button>
          <button @click="uploadFile" :disabled="importing" class="btn-primary">
            {{ importing ? "Importing..." : "Upload" }}
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const authStore = useAuthStore();

// "id" here is Tenant ID based on our route structure
const tenantId = route.params.id as string;
const invitationId = ref("");
const subdomain = ref("");

const loadingInit = ref(true);
const loadingGuests = ref(false);
const adding = ref(false);
const importing = ref(false);
const showImportModal = ref(false);
const guests = ref<any[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const newGuest = reactive({
  name: "",
  type: "Regular",
});

const fetchInitData = async () => {
  loadingInit.value = true;
  try {
    // 1. Fetch Tenant to get Subdomain
    const tenantRes: any = await $fetch(
      `${config.public.apiBaseUrl}/tenants/${tenantId}`,
      {
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      },
    );
    if (tenantRes.data) {
      subdomain.value = tenantRes.data.subdomain;
    }

    // 2. Fetch Invitation to get Invitation ID
    const invRes: any = await $fetch(
      `${config.public.apiBaseUrl}/tenants/${tenantId}/invitation`,
      {
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      },
    );

    if (invRes.data) {
      invitationId.value = invRes.data.id;
      // 3. Fetch Guests
      await fetchGuests();
    } else {
      alert("No invitation found for this tenant.");
      router.push(`/invitations/${tenantId}/edit`);
    }
  } catch (e) {
    console.error("Failed to fetch init data", e);
    alert("Failed to load data");
    router.push("/invitations");
  } finally {
    loadingInit.value = false;
  }
};

const fetchGuests = async () => {
  if (!invitationId.value) return;
  loadingGuests.value = true;
  try {
    const res: any = await $fetch(
      `${config.public.apiBaseUrl}/invitations/${invitationId.value}/guests`,
      {
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      },
    );
    guests.value = res.data || [];
  } catch (error) {
    console.error("Failed to fetch guests:", error);
  } finally {
    loadingGuests.value = false;
  }
};

const addGuest = async () => {
  if (!newGuest.name || !invitationId.value) return;
  adding.value = true;
  try {
    await $fetch(
      `${config.public.apiBaseUrl}/invitations/${invitationId.value}/guests`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
        body: newGuest,
      },
    );
    newGuest.name = "";
    await fetchGuests();
  } catch (error) {
    alert("Failed to add guest");
  } finally {
    adding.value = false;
  }
};

const deleteGuest = async (id: string) => {
  if (!confirm("Are you sure you want to delete this guest?")) return;
  try {
    await $fetch(
      `${config.public.apiBaseUrl}/invitations/${invitationId.value}/guests/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      },
    );
    await fetchGuests();
  } catch (error) {
    alert("Failed to delete guest");
  }
};

const uploadFile = async () => {
  const file = fileInput.value?.files?.[0];
  if (!file || !invitationId.value) {
    alert("Please select a file");
    return;
  }

  importing.value = true;
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res: any = await $fetch(
      `${config.public.apiBaseUrl}/invitations/${invitationId.value}/guests/import`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
        body: formData,
      },
    );
    alert(res.message);
    showImportModal.value = false;
    await fetchGuests();
  } catch (error) {
    console.error(error);
    alert("Failed to import guests");
  } finally {
    importing.value = false;
  }
};

const generateLink = (name: string) => {
  if (!subdomain.value) return "";

  // Calculate Base URL from API Config
  // (e.g. http://localhost:8080/api/v1 -> http://localhost:8080)
  let baseUrl = config.public.apiBaseUrl;
  if (baseUrl.includes("/api/v1")) {
    baseUrl = baseUrl.replace("/api/v1", "");
  }

  // Check if we are in production (undangan.me) or local
  if (
    window.location.hostname === "admin.undangan.me" ||
    window.location.hostname === "undangan.me"
  ) {
    baseUrl = "https://undangan.me";
  }

  return `${baseUrl}/${subdomain.value}?to=${encodeURIComponent(name)}`;
};

const copyLink = (name: string) => {
  const link = generateLink(name);
  if (!link) {
    alert("Subdomain not found");
    return;
  }
  navigator.clipboard.writeText(link);
  // Should use toast ideally
  alert("Link copied: " + link);
};

onMounted(() => {
  fetchInitData();
});
</script>
