<template>
  <NuxtLayout name="dashboard">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Edit Category</h1>
          <p class="text-gray-500 mt-1">Modify master template.</p>
        </div>
        <NuxtLink to="/categories" class="btn-secondary">Cancel</NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-12">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <form
        v-else
        @submit.prevent="updateCategory"
        class="max-w-4xl mx-auto space-y-8"
      >
        <!-- Basic Info -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6"
        >
          <div>
            <h2 class="text-lg font-semibold text-gray-800 border-b pb-4 mb-4">
              Category Details
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Name & Slug -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Category Name</label
                  >
                  <input
                    v-model="form.name"
                    type="text"
                    class="input-text w-full mt-1"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Slug</label
                  >
                  <input
                    v-model="form.slug"
                    type="text"
                    class="input-text w-full mt-1 font-mono text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                    readonly
                  />
                </div>
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >Description</label
                  >
                  <textarea
                    v-model="form.description"
                    rows="3"
                    class="input-text w-full mt-1"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Layout: Snippets - Editors - Preview -->

        <!-- Template Guide (Collapsible) -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <button
            type="button"
            @click="showGuide = !showGuide"
            class="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
          >
            <div class="flex items-center gap-3">
              <div class="bg-indigo-100 p-2 rounded-lg text-indigo-600">
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">
                  Petunjuk Pembuatan Template
                </h3>
                <p class="text-xs text-gray-500">
                  Klik untuk melihat aturan HTML & parameter
                </p>
              </div>
            </div>
            <span
              class="text-gray-400 transform transition-transform duration-200"
              :class="{ 'rotate-180': showGuide }"
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>

          <div
            v-show="showGuide"
            class="p-6 border-t border-gray-200 bg-white text-sm text-gray-600 space-y-6"
          >
            <div class="grid md:grid-cols-2 gap-8">
              <!-- HTML Rules -->
              <div class="space-y-3">
                <h4 class="font-bold text-gray-900 flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs"
                    >1</span
                  >
                  Struktur HTML
                </h4>
                <p class="leading-relaxed">
                  Gunakan struktur HTML lengkap. Variabel
                  <code v-pre>{{ .VariableName }}</code> akan dirender oleh
                  server (Go Template).
                </p>
                <div class="bg-gray-900 rounded-lg p-3 relative group">
                  <pre
                    v-pre
                    class="text-xs font-mono text-blue-300 overflow-x-auto"
                  >
&lt;!DOCTYPE html&gt;
&lt;html lang="id"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;!-- Wajib: Tempat User Custom CSS --&gt;
  {{ if .ThemeInlineCSS }}&lt;style&gt;{{ .ThemeInlineCSS }}&lt;/style&gt;{{
                      end
                    }}
&lt;/head&gt;
&lt;body&gt;
  &lt;!-- Gunakan Snippets Helper di kiri --&gt;
  &lt;h1&gt;{{.GroomName}} &amp; {{.BrideName}}&lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;</pre
                  >
                </div>
              </div>

              <!-- Loops & Logic -->
              <div class="space-y-3">
                <h4 class="font-bold text-gray-900 flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs"
                    >2</span
                  >
                  Looping & Logika
                </h4>
                <p class="leading-relaxed">
                  Gunakan syntax <code v-pre>range</code> untuk data berulang
                  seperti Gallery, Love Story, atau Rekening.
                </p>
                <div class="bg-gray-900 rounded-lg p-3">
                  <pre
                    v-pre
                    class="text-xs font-mono text-purple-300 overflow-x-auto"
                  >
&lt;!-- Contoh Loop Love Story --&gt;
{{ range.LoveStory }}
  &lt;div class="item"&gt;
    &lt;img src="{{.Image}}" /&gt;
    &lt;h3&gt;{{.Year}} - {{.Title}}&lt;/h3&gt;
    &lt;p&gt;{{.Story}}&lt;/p&gt;
  &lt;/div&gt;
{{ end }}</pre
                  >
                </div>
                <div
                  class="bg-yellow-50 text-yellow-800 p-3 rounded text-xs border border-yellow-100 mt-2"
                >
                  💡 <strong>Tips:</strong> Gunakan tab
                  <strong>CSS Styles</strong> di editor bawah untuk CSS global
                  (reset, typography, color vars).
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">
          <!-- Snippets Sidebar (Col-span-2) -->
          <div
            class="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-sm h-full"
          >
            <div class="p-3 bg-gray-50 border-b border-gray-200">
              <h3
                class="font-bold text-gray-700 text-xs uppercase tracking-wider"
              >
                Parameters
              </h3>
              <p class="text-[10px] text-gray-500 mt-1">Click to insert</p>
            </div>
            <div class="flex-1 overflow-y-auto p-2 space-y-1">
              <button
                v-for="snippet in snippets"
                :key="snippet.code"
                type="button"
                @click="insertSnippet(snippet.code)"
                :title="snippet.description"
                class="w-full text-left px-2 py-2 text-xs font-mono text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 rounded transition-colors border border-transparent hover:border-indigo-100 relative group"
              >
                <div
                  class="font-bold text-gray-800 font-sans pointer-events-none"
                >
                  {{ snippet.label }}
                </div>
                <div
                  class="text-[10px] text-gray-400 pointer-events-none truncate"
                >
                  {{ snippet.code }}
                </div>
                <!-- Tooltip on hover -->
                <div
                  class="absolute left-full ml-2 top-0 hidden group-hover:block z-50 w-48 bg-gray-900 text-white text-[10px] p-2 rounded shadow-lg"
                >
                  {{ snippet.description || snippet.label }}
                </div>
              </button>
            </div>
          </div>

          <!-- Editors Column (Col-span-5) -->
          <div class="lg:col-span-5 flex flex-col gap-4 h-full">
            <!-- HTML Editor -->
            <div
              class="bg-gray-900 rounded-xl overflow-hidden flex flex-col border border-gray-700 shadow-lg h-1/2"
            >
              <div
                class="p-3 bg-gray-800 text-gray-300 text-xs font-mono uppercase tracking-widest border-b border-gray-700 flex justify-between"
              >
                <span>HTML Structure</span>
                <button
                  type="button"
                  @click="copyToClipboard(form.default_html)"
                  class="text-gray-500 hover:text-white transition"
                >
                  Copy
                </button>
              </div>
              <textarea
                ref="htmlEditorRef"
                v-model="form.default_html"
                class="flex-1 bg-transparent p-4 text-sm font-mono text-cyan-300 w-full resize-none focus:outline-none focus:bg-gray-800/50 transition-colors"
                spellcheck="false"
                @focus="activeEditor = 'html'"
                placeholder="Click here then select a snippet..."
              ></textarea>
            </div>

            <!-- CSS Editor -->
            <div
              class="bg-gray-900 rounded-xl overflow-hidden flex flex-col border border-gray-700 shadow-lg h-1/2"
            >
              <div
                class="p-3 bg-gray-800 text-gray-300 text-xs font-mono uppercase tracking-widest border-b border-gray-700 flex justify-between"
              >
                <span>CSS Styles</span>
                <button
                  type="button"
                  @click="copyToClipboard(form.default_css)"
                  class="text-gray-500 hover:text-white transition"
                >
                  Copy
                </button>
              </div>
              <textarea
                ref="cssEditorRef"
                v-model="form.default_css"
                class="flex-1 bg-transparent p-4 text-sm font-mono text-pink-300 w-full resize-none focus:outline-none focus:bg-gray-800/50 transition-colors"
                spellcheck="false"
                @focus="activeEditor = 'css'"
                placeholder="/* Global CSS */"
              ></textarea>
            </div>
          </div>

          <!-- Preview Column (Col-span-5) -->
          <div
            class="lg:col-span-5 bg-gray-100 rounded-xl overflow-hidden border border-gray-300 shadow-inner h-full flex flex-col sticky top-4"
          >
            <div
              class="p-2 bg-gray-200 border-b border-gray-300 flex justify-between items-center px-4"
            >
              <span class="text-xs font-bold text-gray-500 uppercase"
                >Live Preview</span
              >
            </div>
            <iframe
              :srcdoc="previewContent"
              class="flex-1 w-full bg-white"
              sandbox="allow-scripts allow-same-origin"
            ></iframe>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            :disabled="saving"
            class="btn-primary w-full md:w-auto px-12 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            {{ saving ? "Saving..." : "Update Category" }}
          </button>
        </div>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useAuthStore } from "~/stores/auth";

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const authStore = useAuthStore();
const loading = ref(true);
const saving = ref(false);
const showGuide = ref(false);
const categoryId = route.params.id;

const htmlEditorRef = ref<HTMLTextAreaElement | null>(null);
const cssEditorRef = ref<HTMLTextAreaElement | null>(null);
const activeEditor = ref<"html" | "css">("html");

const form = reactive({
  name: "",
  slug: "",
  description: "",
  default_html: "",
  default_css: "",
});

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
  const targetRef =
    activeEditor.value === "html" ? htmlEditorRef.value : cssEditorRef.value;
  const targetField =
    activeEditor.value === "html" ? "default_html" : "default_css";

  if (!targetRef) return;

  const start = targetRef.selectionStart || 0;
  const end = targetRef.selectionEnd || 0;
  const currentText = form[targetField] || "";

  const before = currentText.substring(0, start);
  const after = currentText.substring(end);
  form[targetField] = before + code + after;

  setTimeout(() => {
    targetRef.focus();
    const newPos = start + code.length;
    targetRef.setSelectionRange(newPos, newPos);
  }, 0);
};

const previewContent = computed(() => {
  let html = form.default_html || "";
  const css = form.default_css || "";

  if (css) {
    if (html.includes("</head>")) {
      html = html.replace("</head>", `<style>${css}</style></head>`);
    } else {
      html = `<style>${css}</style>` + html;
    }
  }

  const replacements: Record<string, string> = {
    "{{.GroomName}}": "Chandra",
    "{{.BrideName}}": "Kirana",
    "{{.GroomNickname}}": "Chandra",
    "{{.BrideNickname}}": "Kiran",
    "{{.AkadDateFormatted}}": "Minggu, 10 Agustus 2026",
    "{{.WeddingDateISO}}": "2026-08-10",
    "{{.AkadTime}}": "09:00 WIB",
    "{{.AkadAddress}}": "Gedung Pernikahan Indah, Jakarta",
    "{{.AkadMapsURL}}": "#",
    "{{.CoverImage}}":
      "https://plus.unsplash.com/premium_photo-1661676233405-b772c9162986?q=80&w=2664&auto=format&fit=crop",
    "{{.CouplePhoto}}":
      "https://images.unsplash.com/photo-1621621667797-e06afc217fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "{{.BackgroundImage}}":
      "https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "{{.MetaDescription}}": "Undangan Pernikahan Chandra & Kirana",
    "{{.MetaTitle}}": "The Wedding of Chandra & Kirana",
    "{{.Subdomain}}": "chandra-kirana",
    "{{.MusicURL}}": "",
  };

  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(key).join(value);
  }

  return html;
});

const fetchCategory = async () => {
  loading.value = true;
  try {
    const res: any = await $fetch(
      `${config.public.apiBaseUrl}/admin/categories/${categoryId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      },
    );

    if (res.data) {
      Object.assign(form, res.data);
    }
  } catch (error) {
    console.error("Failed to fetch category:", error);
    alert("Category not found or access denied.");
    router.push("/categories");
  } finally {
    loading.value = false;
  }
};

const updateCategory = async () => {
  saving.value = true;
  try {
    const payload = { ...form };

    await $fetch(`${config.public.apiBaseUrl}/admin/categories/${categoryId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      body: payload,
    });
    alert("Category updated successfully!");
    router.push("/categories");
  } catch (error) {
    console.error("Failed to update category:", error);
    alert("Failed to update category.");
  } finally {
    saving.value = false;
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard!");
};

onMounted(() => {
  if (categoryId) fetchCategory();
});
</script>
