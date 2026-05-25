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
              class="w-full h-full relative overflow-hidden bg-white flex items-center justify-center border-b border-gray-100"
            >
              <iframe
                v-if="theme.custom_html"
                :srcdoc="getThemePreviewDoc(theme)"
                class="absolute top-0 left-0 border-0 origin-top-left pointer-events-none w-full h-full"
                style="width: 300%; height: 300%; transform: scale(0.33333); transform-origin: 0 0;"
                sandbox="allow-scripts allow-same-origin"
              ></iframe>
              <div
                v-else
                class="w-full h-full flex flex-col justify-between p-5 select-none relative font-serif"
                :style="{
                  backgroundColor: theme.colors?.background || '#f9fafb',
                  color: theme.colors?.text || '#1f2937',
                  fontFamily: theme.fonts?.heading || 'serif'
                }"
              >
                <!-- Decorative Glow -->
                <div 
                  class="absolute inset-0 opacity-10 pointer-events-none"
                  :style="{
                    backgroundImage: `radial-gradient(circle at 50% 0, ${theme.colors?.primary || '#6366f1'} 0%, transparent 70%)`
                  }"
                ></div>

                <!-- Mockup Header -->
                <div class="flex justify-between items-center z-10 w-full">
                  <span class="text-[9px] tracking-widest uppercase font-semibold opacity-60 font-sans">Wedding Invitation</span>
                  <div 
                    class="w-1.5 h-1.5 rounded-full" 
                    :style="{ backgroundColor: theme.colors?.accent || theme.colors?.primary || '#6366f1' }"
                  ></div>
                </div>

                <!-- Mockup Body / Names -->
                <div class="text-center my-auto z-10 flex flex-col items-center justify-center">
                  <span class="text-[10px] italic opacity-70 mb-1" :style="{ color: theme.colors?.text_muted }">The Wedding of</span>
                  <h4 class="text-lg font-bold tracking-wide leading-tight" :style="{ color: theme.colors?.primary || '#111827' }">
                    Chandra & Kirana
                  </h4>
                  <div 
                    class="w-8 h-[1px] my-1.5 opacity-30" 
                    :style="{ backgroundColor: theme.colors?.primary || '#111827' }"
                  ></div>
                  <span class="text-[8px] uppercase tracking-wider opacity-60 font-sans">Save The Date</span>
                </div>

                <!-- Mockup Footer -->
                <div class="flex justify-between items-end z-10 w-full text-[8px] font-sans font-medium opacity-65">
                  <span class="uppercase">{{ theme.category }} Theme</span>
                  <span>10.08.2026</span>
                </div>
              </div>
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

const getThemePreviewDoc = (theme: any) => {
  let html = theme.custom_html || "";
  const css = theme.custom_css || "";

  if (!html) return "";

  // Inject CSS
  if (css) {
    if (html.includes("</head>")) {
      html = html.replace("</head>", `<style>${css}</style></head>`);
    } else {
      html = `<style>${css}</style>` + html;
    }
  }

  // Inject base href to resolve relative assets (css, js, images) from backend
  const apiBase = config.public.apiBaseUrl || "http://localhost:8080";
  const backendUrl = apiBase.split("/api/v1")[0] || "http://localhost:8080";
  const baseTag = `<base href="${backendUrl}/" />`;

  if (html.includes("<head>")) {
    html = html.replace("<head>", `<head>${baseTag}`);
  } else if (html.includes("<html>")) {
    html = html.replace("<html>", `<html><head>${baseTag}</head>`);
  } else {
    html = baseTag + html;
  }

  // Resolve root-absolute paths starting with /assets/ to backend URL
  html = html.split('href="/assets/').join(`href="${backendUrl}/assets/`);
  html = html.split('src="/assets/').join(`src="${backendUrl}/assets/`);
  html = html.split("href='/assets/").join(`href='${backendUrl}/assets/`);
  html = html.split("src='/assets/").join(`src='${backendUrl}/assets/`);

  // Comprehensive Dummy Data Replacements
  const replacements: Record<string, string> = {
    // Mempelai / Couple
    "{{.GroomName}}": "Chandra Kirana",
    "{{.BrideName}}": "Kirana Lestari",
    "{{.GroomNickname}}": "Chandra",
    "{{.BrideNickname}}": "Kirana",
    "{{.GroomFather}}": "Bapak H. Joko",
    "{{.GroomMother}}": "Ibu Hj. Siti",
    "{{.BrideFather}}": "Bapak H. Budi",
    "{{.BrideMother}}": "Ibu Hj. Rina",
    
    // Photos & Images
    "{{.CouplePhoto}}": "https://images.unsplash.com/photo-1621621667797-e06afc217fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "{{.GroomPhoto}}": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=60",
    "{{.BridePhoto}}": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=60",
    "{{.CoverImage}}": "https://plus.unsplash.com/premium_photo-1661676233405-b772c9162986?q=80&w=2664&auto=format&fit=crop",
    "{{.BackgroundImage}}": "https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "{{.OGImage}}": "https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "{{.URL}}": "https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "{{$bg}}": "https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    
    // Dates & Times
    "{{.WeddingDate}}": "Minggu, 10 Agustus 2026",
    "{{.WeddingDateISO}}": "2026-08-10",
    "{{.AkadDateFormatted}}": "Minggu, 10 Agustus 2026",
    "{{.ReceptionDateFormatted}}": "Minggu, 10 Agustus 2026",
    "{{.AkadTime}}": "09:00 WIB",
    "{{.ReceptionTime}}": "11:00 - 13:00 WIB",
    
    // Locations
    "{{.AkadLocation}}": "Masjid Al-Ikhlas",
    "{{.ReceptionLocation}}": "Gedung Pernikahan Indah",
    "{{.AkadAddress}}": "Jl. Merdeka No. 1, Jakarta",
    "{{.ReceptionAddress}}": "Jl. Kebahagiaan No. 10, Jakarta",
    "{{.AkadMapsURL}}": "#",
    "{{.ReceptionMapsURL}}": "#",
    
    // Theme Assets
    "{{.ThemeCSS}}": `assets/css/themes/${theme.slug}.css`,
    "{{.ThemeInlineCSS}}": css,
    "{{.CustomCSS}}": css,
    
    // Love Story variables
    "{{$s1y}}": "2020",
    "{{$s1t}}": "Pertama Bertemu",
    "{{$s1d}}": "Kami pertama kali bertemu di sebuah perpustakaan kota saat sama-sama mencari buku yang sama.",
    "{{$s2y}}": "2022",
    "{{$s2t}}": "Mulai Menjalin Komitmen",
    "{{$s2d}}": "Setelah dua tahun berteman dekat, kami memutuskan untuk berkomitmen melangkah bersama.",
    "{{$s3y}}": "2025",
    "{{$s3t}}": "Lamaran",
    "{{$s3d}}": "Di hadapan keluarga besar kedua belah pihak, kami melangsungkan acara lamaran resmi.",
    
    // Gift Account variables
    "{{$giftBank}}": "Bank BCA",
    "{{$giftAcc}}": "123-456-7890",
    "{{$giftHolder}}": "Chandra Kirana",
    
    // Other placeholders
    "{{.MetaTitle}}": "The Wedding of Chandra & Kirana",
    "{{.MetaDescription}}": "Undangan Pernikahan Chandra & Kirana",
    "{{.Subdomain}}": "chandra-kirana",
    "{{.GuestName}}": "Nama Tamu Undangan",
    "{{.MusicURL}}": "",
  };

  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(key).join(value);
  }

  // Strip all remaining Go template commands (e.g. {{if ...}}, {{range ...}}, {{end}}, etc.)
  html = html.replace(/{{\s*[^}]+\s*}}/g, "");

  return html;
};

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
