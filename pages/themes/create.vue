<template>
  <NuxtLayout name="dashboard">
    <div class="h-[calc(100vh-64px)] flex flex-col">
      <!-- Header -->
      <header
        class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0"
      >
        <div class="flex items-center gap-4">
          <NuxtLink to="/themes" class="text-gray-400 hover:text-gray-600"
            >← Back</NuxtLink
          >
          <h1 class="text-xl font-bold text-gray-900">Create New Theme</h1>
        </div>
        <div class="flex gap-3">
          <button @click="saveTheme" :disabled="saving" class="btn-primary">
            {{ saving ? "Saving..." : "Save Theme" }}
          </button>
        </div>
      </header>

      <!-- Main Editor Area -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Metadata Sidebar -->
        <div
          class="w-72 bg-white border-r border-gray-200 p-5 space-y-6 overflow-y-auto shrink-0 font-sans z-10"
        >
          <div>
            <h3 class="font-bold text-gray-800 text-lg mb-4 text-center">
              Theme Identity
            </h3>
            <p class="text-xs text-gray-500 mb-6 text-center">
              Konfigurasi dasar untuk theme undangan baru.
            </p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1"
                >Theme Name</label
              >
              <input
                v-model="form.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g. Ocean Blue"
              />
              <p class="text-xs text-gray-400 mt-1">
                Nama yang tampil di user.
              </p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1"
                >Slug (ID Unik)</label
              >
              <input
                v-model="form.slug"
                type="text"
                class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none font-mono text-sm"
                placeholder="e.g. ocean_blue"
                readonly
              />
              <p class="text-xs text-gray-400 mt-1">
                Otomatis dari nama theme (read-only).
              </p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1"
                >Template Base</label
              >
              <select
                v-model="form.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="" disabled>Pilih Template Awal</option>
                <option
                  v-for="cat in categories"
                  :key="cat.id"
                  :value="cat.slug"
                >
                  {{ cat.name }}
                </option>
              </select>
              <p class="text-xs text-gray-500 mt-1">
                HTML/CSS akan terisi otomatis.
              </p>
            </div>

            <!-- Removed Preview Image URL Input -->

            <div
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <input
                v-model="form.is_active"
                type="checkbox"
                id="active"
                class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                for="active"
                class="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >Active</label
              >
            </div>

            <div
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <input
                v-model="form.is_premium"
                type="checkbox"
                id="premium"
                class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                for="premium"
                class="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >Premium Theme</label
              >
            </div>
          </div>
        </div>

        <!-- Code Editor & Preview Area -->
        <div class="flex-1 flex flex-col bg-gray-900 min-w-0 z-0 relative">
          <!-- Template Guide (Collapsible) - Theme Context -->
          <div class="bg-gray-800 border-b border-gray-700">
            <button
              type="button"
              @click="showGuide = !showGuide"
              class="w-full flex items-center justify-between p-3 px-4 hover:bg-gray-700 transition-colors text-left"
            >
              <div class="flex items-center gap-3">
                <div class="bg-indigo-900/50 p-1.5 rounded text-indigo-300">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-200 text-sm">
                    Petunjuk Custom Theme
                  </h3>
                </div>
              </div>
              <span
                class="text-gray-400 transform transition-transform duration-200"
                :class="{ 'rotate-180': showGuide }"
              >
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            <div
              v-show="showGuide"
              class="p-4 bg-gray-800 text-xs text-gray-300 space-y-4 border-t border-gray-700 shadow-xl relative z-20"
            >
              <div class="grid grid-cols-2 gap-6">
                <!-- HTML Rules -->
                <div class="space-y-2">
                  <h4 class="font-bold text-gray-100 flex items-center gap-2">
                    <span
                      class="w-5 h-5 rounded-full bg-blue-900/50 text-blue-300 flex items-center justify-center text-[10px] border border-blue-800"
                      >1</span
                    >
                    Struktur HTML
                  </h4>
                  <p class="leading-relaxed text-gray-400">
                    Variabel
                    <code
                      v-pre
                      class="bg-gray-700 px-1 rounded text-blue-200"
                      >{{ .VariableName }}</code
                    >
                    dirender server-side (Go Template).
                  </p>
                  <div class="bg-gray-900 rounded p-2 border border-gray-700">
                    <pre
                      v-pre
                      class="font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap leading-tight"
                    >
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;!-- Custom CSS User --&gt;
  {{ if .ThemeInlineCSS }}&lt;style&gt;{{ .ThemeInlineCSS }}&lt;/style&gt;{{
                        end
                      }}
&lt;/head&gt;
&lt;body&gt;
  &lt;!-- Gunakan Snippets Helper di Kanan --&gt;
  &lt;h1&gt;{{.GroomName}}&lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;</pre
                    >
                  </div>
                </div>

                <!-- Loops & Logic -->
                <div class="space-y-2">
                  <h4 class="font-bold text-gray-100 flex items-center gap-2">
                    <span
                      class="w-5 h-5 rounded-full bg-purple-900/50 text-purple-300 flex items-center justify-center text-[10px] border border-purple-800"
                      >2</span
                    >
                    Looping & Logika
                  </h4>
                  <p class="leading-relaxed text-gray-400">
                    Gunakan
                    <code v-pre class="bg-gray-700 px-1 rounded text-purple-200"
                      >range</code
                    >
                    untuk data array.
                  </p>
                  <div class="bg-gray-900 rounded p-2 border border-gray-700">
                    <pre
                      v-pre
                      class="font-mono text-purple-300 overflow-x-auto whitespace-pre-wrap leading-tight"
                      >{{ range.LoveStory }}
  &lt;div&gt;
    &lt;img src="{{.Image}}" /&gt;
    &lt;p&gt;{{.Story}}&lt;/p&gt;
  &lt;/div&gt;
{{ end }}</pre
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Editor Header -->
          <div
            class="flex items-center justify-between bg-gray-800 px-2 pt-2 border-b border-gray-700"
          >
            <!-- Tabs -->
            <div class="flex items-end gap-1">
              <button
                type="button"
                @click="activeTab = 'html'"
                :class="[
                  'px-6 py-2.5 text-sm font-medium rounded-t-lg transition-all focus:outline-none relative translate-y-[1px]',
                  activeTab === 'html'
                    ? 'bg-gray-900 text-white border-t-2 border-indigo-500 font-semibold'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200 border-t-2 border-transparent',
                ]"
              >
                HTML Template
              </button>
              <button
                type="button"
                @click="activeTab = 'css'"
                :class="[
                  'px-6 py-2.5 text-sm font-medium rounded-t-lg transition-all focus:outline-none relative translate-y-[1px]',
                  activeTab === 'css'
                    ? 'bg-gray-900 text-white border-t-2 border-pink-500 font-semibold'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200 border-t-2 border-transparent',
                ]"
              >
                CSS Styles
              </button>
            </div>
            <div class="px-4 pb-2 text-xs font-mono text-gray-400">
              Live Preview
            </div>
          </div>

          <!-- Split View -->
          <div class="flex-1 flex overflow-hidden">
            <!-- Editor -->
            <div class="flex-1 relative border-r border-gray-700">
              <textarea
                ref="htmlEditorRef"
                v-show="activeTab === 'html'"
                v-model="form.custom_html"
                class="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-gray-900 text-white caret-white resize-none focus:outline-none focus:ring-0 border-0 leading-relaxed"
                placeholder="<!-- Check 'Snippets' sidebar for variables -->
<!DOCTYPE html>
<html lang='id'>..."
                spellcheck="false"
                @blur="lastFocusedTab = 'html'"
              ></textarea>
              <textarea
                ref="cssEditorRef"
                v-show="activeTab === 'css'"
                v-model="form.custom_css"
                class="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-gray-900 text-white caret-white resize-none focus:outline-none focus:ring-0 border-0 leading-relaxed"
                placeholder="/* Theme Global Styles */
body { ... }"
                spellcheck="false"
                @blur="lastFocusedTab = 'css'"
              ></textarea>
            </div>

            <!-- Preview -->
            <div class="flex-1 bg-white relative">
              <iframe
                :srcdoc="previewContent"
                class="absolute inset-0 w-full h-full"
                sandbox="allow-scripts allow-same-origin"
              ></iframe>
            </div>
          </div>
        </div>

        <!-- Snippets Sidebar -->
        <div
          class="w-64 bg-white border-l border-gray-200 flex flex-col shrink-0 z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.1)]"
        >
          <div class="p-4 border-b border-gray-200 bg-gray-50">
            <h3 class="font-bold text-gray-800 text-sm">Snippets Helper</h3>
            <p class="text-xs text-gray-500 mt-0.5">
              Click to insert to editor
            </p>
          </div>
          <div class="flex-1 overflow-y-auto p-2 space-y-1">
            <button
              v-for="snippet in snippets"
              :key="snippet.code"
              type="button"
              @click="insertSnippet(snippet.code)"
              :title="snippet.description"
              class="w-full text-left px-3 py-2.5 text-xs font-mono text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 rounded transition-colors group border border-transparent hover:border-indigo-100 relative"
            >
              <div
                class="font-bold mb-1 text-gray-800 font-sans pointer-events-none"
              >
                {{ snippet.label }}
              </div>
              <div
                class="truncate text-gray-400 group-hover:text-indigo-500 pointer-events-none"
              >
                {{ snippet.code }}
              </div>
              <!-- Tooltip on hover -->
              <div
                class="absolute right-full mr-2 top-0 hidden group-hover:block z-50 w-48 bg-gray-900 text-white text-[10px] p-2 rounded shadow-lg"
              >
                {{ snippet.description || snippet.label }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: false,
});

const router = useRouter();
const config = useRuntimeConfig();
const authStore = useAuthStore();

const loading = ref(false);
const saving = ref(false);
const showGuide = ref(false);
const activeTab = ref("html");
const lastFocusedTab = ref("html"); // Track last focused for snippets
const htmlEditorRef = ref<HTMLTextAreaElement | null>(null);
const cssEditorRef = ref<HTMLTextAreaElement | null>(null);

const form = reactive({
  name: "",
  slug: "",
  category: "",
  is_premium: false,
  is_active: true,
  custom_html: "",
  custom_css: "",
  description: "",
  colors: {},
});

const previewContent = computed(() => {
  let html = form.custom_html || "";
  const css = form.custom_css || "";

  // Inject CSS
  if (css) {
    if (html.includes("</head>")) {
      html = html.replace("</head>", `<style>${css}</style></head>`);
    } else {
      html = `<style>${css}</style>` + html;
    }
  }

  // Dummy Data Replacements matches categories logic
  const replacements: Record<string, string> = {
    "{{.GroomName}}": "Chandra",
    "{{.BrideName}}": "Kirana",
    "{{.GroomNickname}}": "Chandra",
    "{{.BrideNickname}}": "Kiran",
    "{{.GroomFather}}": "Bapak H. Joko",
    "{{.GroomMother}}": "Ibu Hj. Siti",
    "{{.BrideFather}}": "Bapak H. Budi",
    "{{.BrideMother}}": "Ibu Hj. Rina",
    "{{.AkadDateFormatted}}": "Minggu, 10 Agustus 2026",
    "{{.ReceptionDateFormatted}}": "Minggu, 10 Agustus 2026",
    "{{.WeddingDateISO}}": "2026-08-10",
    "{{.AkadTime}}": "09:00 WIB",
    "{{.ReceptionTime}}": "11:00 - 13:00 WIB",
    "{{.AkadLocation}}": "Masjid Al-Ikhlas",
    "{{.ReceptionLocation}}": "Gedung Pernikahan Indah",
    "{{.AkadAddress}}": "Jl. Merdeka No. 1, Jakarta",
    "{{.ReceptionAddress}}": "Jl. Kebahagiaan No. 10, Jakarta",
    "{{.AkadMapsURL}}": "#",
    "{{.ReceptionMapsURL}}": "#",
    "{{.CoverImage}}":
      "https://plus.unsplash.com/premium_photo-1661676233405-b772c9162986?q=80&w=2664&auto=format&fit=crop",
    "{{.CouplePhoto}}":
      "https://images.unsplash.com/photo-1621621667797-e06afc217fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "{{.GroomPhoto}}":
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=60",
    "{{.BridePhoto}}":
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=60",
    "{{.BackgroundImage}}":
      "https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "{{.MetaDescription}}": "Undangan Pernikahan Chandra & Kirana",
    "{{.MetaTitle}}": "The Wedding of Chandra & Kirana",
    "{{.Subdomain}}": "chandra-kirana",
    "{{.MusicURL}}": "",
    "{{.LoveStory}}": "A beautiful journey...",
    "{{.Barcode}}":
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example",
    "{{.Video}}": "https://www.youtube.com/embed/dQw4w9WgXcQ",
  };

  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(key).join(value);
  }

  return html;
});

const categories = ref<any[]>([]);
const isSlugManuallyEdited = ref(false);

const snippets = [
  // Couple
  {
    label: "Groom Name",
    code: "{{.GroomName}}",
    description: "Nama lengkap mempelai pria",
  },
  {
    label: "Groom Nickname",
    code: "{{.GroomNickname}}",
    description: "Nama panggilan mempelai pria",
  },
  {
    label: "Groom Father",
    code: "{{.GroomFather}}",
    description: "Nama ayah mempelai pria",
  },
  {
    label: "Groom Mother",
    code: "{{.GroomMother}}",
    description: "Nama ibu mempelai pria",
  },

  {
    label: "Bride Name",
    code: "{{.BrideName}}",
    description: "Nama lengkap mempelai wanita",
  },
  {
    label: "Bride Nickname",
    code: "{{.BrideNickname}}",
    description: "Nama panggilan mempelai wanita",
  },
  {
    label: "Bride Father",
    code: "{{.BrideFather}}",
    description: "Nama ayah mempelai wanita",
  },
  {
    label: "Bride Mother",
    code: "{{.BrideMother}}",
    description: "Nama ibu mempelai wanita",
  },

  // Images & Media
  {
    label: "Couple Photo",
    code: "{{.CouplePhoto}}",
    description: "URL foto pasangan (portrait/square)",
  },
  {
    label: "Groom Photo",
    code: "{{.GroomPhoto}}",
    description: "URL foto mempelai pria",
  },
  {
    label: "Bride Photo",
    code: "{{.BridePhoto}}",
    description: "URL foto mempelai wanita",
  },
  {
    label: "Cover Image",
    code: "{{.CoverImage}}",
    description: "URL gambar sampul undangan",
  },
  {
    label: "Background Image",
    code: "{{.BackgroundImage}}",
    description: "URL gambar latar belakang",
  },
  {
    label: "Music URL",
    code: "{{.MusicURL}}",
    description: "URL file musik (mp3)",
  },
  {
    label: "Love Story",
    code: "{{.LoveStory}}",
    description: "Teks kisah cinta pasangan",
  },
  {
    label: "Barcode",
    code: "{{.Barcode}}",
    description: "URL gambar barcode/QR Code",
  },
  {
    label: "Video",
    code: "{{.Video}}",
    description: "URL video prewedding atau embed code",
  },

  // Akad
  {
    label: "Akad Date",
    code: "{{.AkadDateFormatted}}",
    description: "Format: Senin, 01 Januari 2024",
  },
  {
    label: "Akad Time",
    code: "{{.AkadTime}}",
    description: "Waktu acara akad (contoh: 08:00 WIB)",
  },
  {
    label: "Akad Location",
    code: "{{.AkadLocation}}",
    description: "Nama tempat/gedung akad",
  },
  {
    label: "Akad Address",
    code: "{{.AkadAddress}}",
    description: "Alamat lengkap lokasi akad",
  },
  {
    label: "Akad Maps",
    code: "{{.AkadMapsURL}}",
    description: "Link Google Maps lokasi akad",
  },

  // Reception
  {
    label: "Reception Date",
    code: "{{.ReceptionDateFormatted}}",
    description: "Format: Senin, 01 Januari 2024",
  },
  {
    label: "Reception Time",
    code: "{{.ReceptionTime}}",
    description: "Waktu acara resepsi",
  },
  {
    label: "Reception Location",
    code: "{{.ReceptionLocation}}",
    description: "Nama tempat/gedung resepsi",
  },
  {
    label: "Reception Address",
    code: "{{.ReceptionAddress}}",
    description: "Alamat lengkap lokasi resepsi",
  },
  {
    label: "Reception Maps",
    code: "{{.ReceptionMapsURL}}",
    description: "Link Google Maps lokasi resepsi",
  },

  // Meta
  {
    label: "Wedding Date ISO",
    code: "{{.WeddingDateISO}}",
    description: "Format ISO (2024-01-01) untuk countdown",
  },
  {
    label: "Meta Title",
    code: "{{.MetaTitle}}",
    description: "Judul untuk SEO & Share Preview",
  },
  {
    label: "Meta Description",
    code: "{{.MetaDescription}}",
    description: "Deskripsi singkat untuk SEO",
  },
  {
    label: "Guest Name",
    code: "{{.GuestName}}",
    description: "Nama tamu undangan (dari URL)",
  },

  // Components (HTMX)
  {
    label: "HTMX Messages",
    code: '<div hx-get="/{{.Subdomain}}/messages" hx-trigger="load"></div>',
    description: "Component buku tamu & ucapan",
  },
  {
    label: "HTMX RSVP",
    code: '<div hx-get="/{{.Subdomain}}/rsvp" hx-trigger="load"></div>',
    description: "Formulir konfirmasi kehadiran",
  },
  {
    label: "HTMX Gallery",
    code: '<div hx-get="/{{.Subdomain}}/gallery" hx-trigger="load"></div>',
    description: "Grid galeri foto",
  },
  {
    label: "HTMX Gift",
    code: '<div hx-get="/{{.Subdomain}}/gift" hx-trigger="load"></div>',
    description: "Component amplop digital / info rekening",
  },

  // Styles
  {
    label: "Theme Inline CSS",
    code: "{{if .ThemeInlineCSS}}<style>{{.ThemeInlineCSS}}</style>{{end}}",
    description: "Wajib ada di <head> untuk custom CSS user",
  },
];

const insertSnippet = (code: string) => {
  // Determine target editor
  const targetRef =
    activeTab.value === "html" ? htmlEditorRef.value : cssEditorRef.value;
  const targetField = activeTab.value === "html" ? "custom_html" : "custom_css";

  if (!targetRef) return;

  // Get current cursor position
  const start = targetRef.selectionStart || 0;
  const end = targetRef.selectionEnd || 0;
  const currentText = form[targetField] || "";

  // Insert text
  const before = currentText.substring(0, start);
  const after = currentText.substring(end);
  form[targetField] = before + code + after;

  // Restore focus and move cursor
  setTimeout(() => {
    targetRef.focus();
    const newCursorPos = start + code.length;
    targetRef.setSelectionRange(newCursorPos, newCursorPos);
  }, 0);
};

const fetchCategories = async () => {
  try {
    const res: any = await $fetch(`${config.public.apiBaseUrl}/categories`);
    if (res.data) {
      categories.value = res.data;
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

const fillTemplate = (category: any) => {
  if (category) {
    // Only fill if editor is empty or user confirms overwrite
    if (!form.custom_html && !form.custom_css) {
      form.custom_html = category.default_html;
      form.custom_css = category.default_css;
    } else {
      if (confirm("Change template? Current code will be replaced.")) {
        form.custom_html = category.default_html;
        form.custom_css = category.default_css;
      }
    }
  }
};

// Watch name to auto-generate slug
watch(
  () => form.name,
  (newName) => {
    if (!isSlugManuallyEdited.value) {
      form.slug = newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
  },
);

// Watch category selection
watch(
  () => form.category,
  (newSlug) => {
    const selectedCat = categories.value.find((c) => c.slug === newSlug);
    if (selectedCat) {
      fillTemplate(selectedCat);
    }
  },
);

onMounted(() => {
  fetchCategories();
});

const saveTheme = async () => {
  if (!form.name || !form.slug) {
    alert("Name and Slug are required");
    return;
  }

  saving.value = true;
  try {
    await $fetch(`${config.public.apiBaseUrl}/admin/themes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      body: {
        ...form,
        template_path: "db_custom", // Dummy value as we use custom_html
      },
    });
    alert("Theme created successfully!");
    router.push("/themes");
  } catch (error) {
    console.error("Failed to create theme:", error);
    alert("Failed to create theme");
  } finally {
    saving.value = false;
  }
};
</script>
