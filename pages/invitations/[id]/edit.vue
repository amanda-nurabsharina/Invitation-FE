<template>
  <NuxtLayout name="dashboard">
    <div class="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <!-- Header -->
      <header
        class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 z-20 shadow-sm"
      >
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/invitations"
            class="text-gray-400 hover:text-gray-600 transition flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-sm font-medium">Back</span>
          </NuxtLink>
          <div>
            <h1 class="text-xl font-bold text-gray-900 leading-tight">
              Edit Invitation
            </h1>

            <!-- Editable Tenant Name -->
            <div v-if="!isEditingName" class="flex items-center gap-2 group">
              <p class="text-xs text-gray-500 mt-0.5">
                {{ tenant?.name }} ({{ tenant?.subdomain }})
              </p>
              <button
                @click="startEditingName"
                class="text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Edit Name"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  />
                </svg>
              </button>
            </div>

            <form
              v-else
              @submit.prevent="saveTenantName"
              class="flex items-center gap-2 mt-0.5"
            >
              <input
                ref="nameInputRef"
                v-model="editNameForm.name"
                type="text"
                class="text-xs border border-gray-300 rounded px-2 py-0.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none w-48"
                placeholder="Invitation Name"
                required
              />
              <button
                type="submit"
                class="text-green-600 hover:text-green-700 disabled:opacity-50"
                :disabled="savingName"
                title="Save"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <button
                type="button"
                @click="cancelEditingName"
                class="text-gray-500 hover:text-gray-700"
                title="Cancel"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
        <div class="flex gap-3">
          <NuxtLink
            :to="`/invitations/${tenantId}/guests`"
            class="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition border border-indigo-200 flex items-center gap-2"
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Guests
          </NuxtLink>
          <button
            v-if="invitation && !invitation.is_published"
            @click="publishInvitation"
            class="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition border border-green-200"
          >
            Publish Live
          </button>
          <button
            v-else-if="invitation?.is_published"
            @click="unpublishInvitation"
            class="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-100 transition border border-yellow-200"
          >
            Unpublish
          </button>
          <button
            @click="saveInvitation"
            :disabled="saving"
            class="btn-primary px-6 py-2 shadow-sm flex items-center gap-2"
          >
            <svg
              v-if="saving"
              class="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ saving ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </header>

      <!-- Content -->
      <div v-if="loading" class="flex-1 flex items-center justify-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"
        ></div>
      </div>

      <div v-else class="flex-1 overflow-hidden">
        <div class="h-full flex flex-col xl:flex-row">
          <!-- Scrollable Form Container -->
          <div class="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div
              class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <!-- LEFT COLUMN: Basic Info -->
              <div class="space-y-6">
                <!-- Couple Info -->
                <div
                  class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h2
                    class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"
                  >
                    <span class="p-1.5 bg-rose-100 text-rose-600 rounded-lg"
                      >💖</span
                    >
                    Couple Information
                  </h2>
                  <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="label text-xs">Groom Nickname</label>
                        <input
                          v-model="form.groom_nickname"
                          class="input"
                          placeholder="e.g. Adam"
                        />
                      </div>
                      <div>
                        <label class="label text-xs">Bride Nickname</label>
                        <input
                          v-model="form.bride_nickname"
                          class="input"
                          placeholder="e.g. Eve"
                        />
                      </div>
                    </div>
                    <div>
                      <label class="label text-xs">Groom Full Name</label>
                      <input
                        v-model="form.groom_name"
                        class="input"
                        placeholder="Full Name"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="label text-xs">Father's Name</label>
                        <input v-model="form.groom_father" class="input" />
                      </div>
                      <div>
                        <label class="label text-xs">Mother's Name</label>
                        <input v-model="form.groom_mother" class="input" />
                      </div>
                    </div>

                    <div class="border-t border-gray-100 my-4"></div>

                    <div>
                      <label class="label text-xs">Bride Full Name</label>
                      <input
                        v-model="form.bride_name"
                        class="input"
                        placeholder="Full Name"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="label text-xs">Father's Name</label>
                        <input v-model="form.bride_father" class="input" />
                      </div>
                      <div>
                        <label class="label text-xs">Mother's Name</label>
                        <input v-model="form.bride_mother" class="input" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Events Info -->
                <div
                  class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h2
                    class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"
                  >
                    <span class="p-1.5 bg-blue-100 text-blue-600 rounded-lg"
                      >📅</span
                    >
                    Events
                  </h2>

                  <!-- Akad -->
                  <div class="mb-6">
                    <h3
                      class="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider"
                    >
                      Akad / Ceremony
                    </h3>
                    <div class="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label class="label text-xs">Date</label>
                        <input
                          v-model="form.akad_date"
                          type="date"
                          class="input"
                        />
                      </div>
                      <div>
                        <label class="label text-xs">Time</label>
                        <input
                          v-model="form.akad_time"
                          class="input"
                          placeholder="08:00 - 10:00"
                        />
                      </div>
                    </div>
                    <div class="space-y-3">
                      <div>
                        <label class="label text-xs">Location Name</label>
                        <input v-model="form.akad_location" class="input" />
                      </div>
                      <div>
                        <label class="label text-xs">Address</label>
                        <textarea
                          v-model="form.akad_address"
                          class="input"
                          rows="2"
                        ></textarea>
                      </div>
                      <div>
                        <label class="label text-xs">Maps URL</label>
                        <input
                          v-model="form.akad_maps_url"
                          class="input text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Reception -->
                  <div>
                    <h3
                      class="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider"
                    >
                      Reception
                    </h3>
                    <div class="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label class="label text-xs">Date</label>
                        <input
                          v-model="form.reception_date"
                          type="date"
                          class="input"
                        />
                      </div>
                      <div>
                        <label class="label text-xs">Time</label>
                        <input
                          v-model="form.reception_time"
                          class="input"
                          placeholder="11:00 - 13:00"
                        />
                      </div>
                    </div>
                    <div class="space-y-3">
                      <div>
                        <label class="label text-xs">Location Name</label>
                        <input
                          v-model="form.reception_location"
                          class="input"
                        />
                      </div>
                      <div>
                        <label class="label text-xs">Address</label>
                        <textarea
                          v-model="form.reception_address"
                          class="input"
                          rows="2"
                        ></textarea>
                      </div>
                      <div>
                        <label class="label text-xs">Maps URL</label>
                        <input
                          v-model="form.reception_maps_url"
                          class="input text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- LOVE STORY MANAGER -->
                <div
                  v-if="loveStoryGroups.length > 0"
                  class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h2
                    class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"
                  >
                    <span class="p-1.5 bg-rose-100 text-rose-600 rounded-lg"
                      >💑</span
                    >
                    Love Story
                  </h2>

                  <div class="space-y-6">
                    <div
                      v-for="story in loveStoryGroups"
                      :key="story.index"
                      class="p-4 border border-gray-100 rounded-xl bg-gray-50/50"
                    >
                      <h3
                        class="text-sm font-bold text-gray-700 mb-3 block border-b border-gray-200 pb-2"
                      >
                        Story #{{ story.index }}
                      </h3>
                      <div class="space-y-3">
                        <div class="grid grid-cols-2 gap-3">
                          <div>
                            <label class="label text-xs">Year</label>
                            <input
                              v-model="form.content_data[story.year]"
                              class="input text-xs"
                              placeholder="e.g. 2021"
                            />
                          </div>
                          <div>
                            <label class="label text-xs">Title</label>
                            <input
                              v-model="form.content_data[story.title]"
                              class="input text-xs"
                              placeholder="Title"
                            />
                          </div>
                        </div>
                        <div>
                          <label class="label text-xs">Description</label>
                          <textarea
                            v-model="form.content_data[story.desc]"
                            class="input text-xs"
                            rows="3"
                            placeholder="Description..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- RIGHT COLUMN: Theme, Assets, Content -->
              <div class="space-y-6">
                <!-- Theme Selection -->
                <div
                  class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h2
                    class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"
                  >
                    <span class="p-1.5 bg-purple-100 text-purple-600 rounded-lg"
                      >🎨</span
                    >
                    Theme & Global
                  </h2>
                  <div class="space-y-4">
                    <div>
                      <label class="label text-xs">Selected Theme</label>
                      <select v-model="form.theme_id" class="input">
                        <option value="">-- Select Theme --</option>
                        <option v-for="t in themes" :key="t.id" :value="t.id">
                          {{ t.name }} ({{ t.category || "General" }})
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="label text-xs"
                        >Background Music (MP3)</label
                      >
                      <div class="flex flex-col gap-2">
                        <div class="flex gap-2">
                          <input
                            type="text"
                            v-model="form.music_url"
                            class="input flex-1 text-xs"
                            placeholder="https://... or upload"
                            readonly
                          />
                          <label
                            class="btn-secondary text-xs px-3 py-2 cursor-pointer whitespace-nowrap"
                          >
                            Upload MP3
                            <input
                              type="file"
                              class="hidden"
                              accept="audio/mpeg,audio/mp3,audio/wav"
                              @change="uploadMusic"
                            />
                          </label>
                        </div>
                        <audio
                          v-if="form.music_url"
                          :src="resolveUrl(form.music_url)"
                          controls
                          class="w-full h-8 mt-1"
                        ></audio>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- WEDDING GIFT MANAGER -->
                <div
                  class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h2
                    class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"
                  >
                    <span class="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg"
                      >🎁</span
                    >
                    Wedding Gift
                  </h2>

                  <div class="space-y-4">
                    <div
                      class="p-4 border border-gray-100 rounded-xl bg-gray-50/50"
                    >
                      <div class="space-y-3">
                        <div>
                          <label class="label text-xs">Bank Name</label>
                          <select
                            v-model="form.content_data.GiftBankName"
                            class="input text-xs"
                          >
                            <option value="">-- Select Bank --</option>
                            <option value="Bank Central Asia">
                              BCA (Bank Central Asia)
                            </option>
                            <option value="Bank Mandiri">Mandiri</option>
                            <option value="Bank Rakyat Indonesia">
                              BRI (Bank Rakyat Indonesia)
                            </option>
                            <option value="Bank Negara Indonesia">
                              BNI (Bank Negara Indonesia)
                            </option>
                            <option value="CIMB Niaga">CIMB Niaga</option>
                            <option value="Bank Syariah Indonesia">
                              BSI (Bank Syariah Indonesia)
                            </option>
                            <option value="Permata Bank">Permata Bank</option>
                            <option value="Bank Danamon">Danamon</option>
                            <option value="Jenius BTPN">Jenius (BTPN)</option>
                            <option value="Bank Jago">Bank Jago</option>
                            <option value="SeaBank">SeaBank</option>
                            <option value="Bank Tabungan Negara">BTN</option>
                            <option value="OCBC NISP">OCBC NISP</option>
                            <option value="Panin Bank">Panin Bank</option>
                          </select>
                        </div>
                        <div>
                          <label class="label text-xs">Account Number</label>
                          <input
                            v-model="form.content_data.GiftAccountNumber"
                            class="input text-xs"
                            placeholder="e.g. 1234567890"
                            type="text"
                          />
                        </div>
                        <div>
                          <label class="label text-xs"
                            >Account Holder Name</label
                          >
                          <input
                            v-model="form.content_data.GiftAccountHolder"
                            class="input text-xs"
                            placeholder="e.g. Alya Ramadhani"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- GALLERY MANAGER -->
                <div
                  class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div class="flex justify-between items-center mb-4">
                    <h2
                      class="text-lg font-bold text-gray-800 flex items-center gap-2"
                    >
                      <span
                        class="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"
                        >🖼️</span
                      >
                      Gallery & Assets
                    </h2>
                    <label
                      class="btn-secondary text-xs px-3 py-1.5 cursor-pointer"
                    >
                      + Upload Image
                      <input
                        type="file"
                        class="hidden"
                        accept="image/*"
                        @change="uploadGalleryImage"
                        multiple
                      />
                    </label>
                  </div>

                  <div
                    v-if="uploading"
                    class="text-xs text-center py-2 text-indigo-600 animate-pulse"
                  >
                    Uploading...
                  </div>

                  <!-- Gallery Grid -->
                  <!-- Gallery Grid -->
                  <div
                    v-if="gallery.length > 0"
                    class="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1 custom-scrollbar"
                  >
                    <div
                      v-for="img in gallery"
                      :key="img.id"
                      class="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex flex-col"
                    >
                      <div class="aspect-square relative w-full">
                        <img
                          :src="resolveUrl(img.image_url)"
                          class="w-full h-full object-cover"
                          loading="lazy"
                          @error="
                            $event.target.src =
                              'https://placehold.co/100x100?text=Broken+Link'
                          "
                        />
                        <!-- Delete Overlay -->
                        <div
                          class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                        >
                          <button
                            @click="deleteGalleryItem(img.id)"
                            class="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                            title="Delete"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                        <!-- URL Copy Helper -->
                        <button
                          @click="copyToClipboard(resolveUrl(img.image_url))"
                          class="absolute bottom-0 w-full text-[10px] bg-black/70 text-white text-center py-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          Copy URL
                        </button>
                      </div>
                      <!-- DEBUG URL TEXT -->
                      <div
                        class="p-1 text-[8px] text-gray-500 font-mono break-all leading-tight bg-gray-100 border-t border-gray-200"
                      >
                        {{ resolveUrl(img.image_url) }}
                      </div>
                    </div>
                  </div>
                  <div
                    v-else
                    class="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300"
                  >
                    <p class="text-xs text-gray-400">No images uploaded yet</p>
                  </div>
                </div>

                <!-- DYNAMIC CONTENT MAPPING -->
                <div
                  class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h2
                    class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"
                  >
                    <span class="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg"
                      >🔌</span
                    >
                    Dynamic Content
                  </h2>
                  <div
                    class="mb-4 p-3 bg-blue-50 text-blue-800 rounded text-xs border border-blue-100"
                  >
                    <strong>How to use:</strong> Map parameter keys to your
                    image URLs or text.
                    <ul class="list-disc pl-4 mt-1 space-y-1" v-pre>
                      <li>
                        Key: <code>HeroImage</code> &rarr; matches
                        <code>{{.ContentData.HeroImage}}</code> in theme HTML.
                      </li>
                      <li>
                        Key: <code>Gallery1</code> &rarr; matches
                        <code>{{.ContentData.Gallery1}}</code> in theme HTML.
                      </li>
                      <li>
                        Contact your theme developer for the list of supported
                        keys.
                      </li>
                    </ul>
                  </div>

                  <!-- Params List -->
                  <div class="space-y-4">
                    <div
                      v-for="key in dynamicContentKeys"
                      :key="key"
                      class="p-3 border rounded-lg relative hover:border-indigo-300 transition bg-white"
                      :class="
                        isDetected(key)
                          ? 'border-indigo-200 bg-indigo-50/30'
                          : 'border-gray-200'
                      "
                    >
                      <div class="flex justify-between items-center mb-2">
                        <div class="flex items-center gap-2">
                          <span
                            class="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded"
                            >{{ key }}</span
                          >
                          <span
                            v-if="isDetected(key)"
                            class="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full"
                            >Automated</span
                          >
                        </div>
                        <button
                          @click="clearContentKey(key)"
                          class="text-gray-400 hover:text-red-500"
                          title="Clear Value"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      <div class="flex gap-2 mb-2">
                        <input
                          v-model="form.content_data[key]"
                          placeholder="Paste URL here..."
                          class="input text-xs flex-1"
                        />
                      </div>

                      <!-- Quick Select from Gallery -->
                      <div
                        v-if="gallery.length > 0"
                        class="flex gap-1 overflow-x-auto pb-1 custom-scrollbar"
                      >
                        <button
                          v-for="img in gallery"
                          :key="img.id"
                          @click="
                            form.content_data[key] = resolveUrl(img.image_url)
                          "
                          class="w-8 h-8 rounded border shrink-0 overflow-hidden hover:ring-2 ring-indigo-500 transition relative"
                          :class="
                            form.content_data[key] === resolveUrl(img.image_url)
                              ? 'ring-2 ring-indigo-500'
                              : 'border-gray-200'
                          "
                          :title="img.image_url"
                        >
                          <img
                            :src="resolveUrl(img.image_url)"
                            class="w-full h-full object-cover"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="dynamicContentKeys.length === 0"
                    class="text-center py-6 text-gray-400 text-xs italic"
                  >
                    No other dynamic content parameters detected.
                  </div>
                </div>

                <!-- Settings -->
                <div
                  class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h2
                    class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"
                  >
                    <span class="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg"
                      >⚙️</span
                    >
                    Settings
                  </h2>

                  <div class="space-y-4">
                    <div>
                      <label class="label"
                        >Expiration Date (Auto-Unpublish)</label
                      >
                      <input
                        type="datetime-local"
                        v-model="form.expires_at"
                        class="input"
                      />
                      <p class="text-xs text-gray-500 mt-1">
                        Invitation will become inaccessible after this date.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Live Preview Sticky Sidebar -->
          <div
            class="w-[400px] shrink-0 bg-gray-100 border-l border-gray-200 flex flex-col hidden xl:flex"
          >
            <div
              class="bg-white p-3 border-b border-gray-200 flex justify-between items-center shadow-sm z-10"
            >
              <span
                class="text-xs font-bold text-gray-500 uppercase tracking-wider"
                >Live Preview</span
              >
              <a
                :href="previewUrl"
                target="_blank"
                class="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Open New Tab
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
                  />
                  <path
                    d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
                  />
                </svg>
              </a>
            </div>
            <div
              class="flex-1 p-6 flex items-center justify-center overflow-hidden relative"
            >
              <div
                class="w-full h-full bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-[6px] border-gray-800 relative ring-4 ring-gray-200"
              >
                <div
                  class="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-6 bg-gray-800 rounded-b-xl z-20"
                ></div>
                <!-- Iframe pointing to Backend Rendered Page -->
                <iframe
                  v-if="previewUrl"
                  :src="previewUrl"
                  :key="iframeKey"
                  class="w-full h-full bg-white"
                  frameborder="0"
                ></iframe>
                <div
                  v-else
                  class="flex flex-col items-center justify-center h-full text-gray-400 p-4 text-center"
                >
                  <p>Preview loading...</p>
                </div>
              </div>
            </div>
            <div class="bg-white p-3 border-t border-gray-200 text-center">
              <p class="text-[10px] text-gray-400">
                Preview refreshes after saving changes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from "vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: false,
});

const route = useRoute();
const config = useRuntimeConfig();
const authStore = useAuthStore();

const tenantId = route.params.id as string;
const invitation = ref<any>(null);
const tenant = ref<any>(null);
const themes = ref<any[]>([]);
const gallery = ref<any[]>([]);

const loading = ref(true);
const saving = ref(false);
const uploading = ref(false);
const iframeKey = ref(0);
const newContentKey = ref("");

// Edit Name Logic
const isEditingName = ref(false);
const savingName = ref(false);
const editNameForm = reactive({ name: "" });
const nameInputRef = ref<HTMLInputElement | null>(null);

const startEditingName = async () => {
  editNameForm.name = tenant.value?.name || "";
  isEditingName.value = true;
  await nextTick();
  nameInputRef.value?.focus();
};

const cancelEditingName = () => {
  isEditingName.value = false;
};

const saveTenantName = async () => {
  if (!tenant.value) return;
  savingName.value = true;
  try {
    await $fetch(`${config.public.apiBaseUrl}/tenants/${tenantId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      body: { name: editNameForm.name },
    });

    tenant.value.name = editNameForm.name;
    isEditingName.value = false;
  } catch (e: any) {
    alert(e.data?.message || "Failed to update name");
  } finally {
    savingName.value = false;
  }
};

const form = reactive({
  // Basic Info
  groom_name: "",
  groom_nickname: "",
  groom_father: "",
  groom_mother: "",
  bride_name: "",
  bride_nickname: "",
  bride_father: "",
  bride_mother: "",
  akad_date: "",
  akad_time: "",
  akad_location: "",
  akad_address: "",
  akad_maps_url: "",
  reception_date: "",
  reception_time: "",
  reception_location: "",
  reception_address: "",
  reception_maps_url: "",

  // Config
  theme_id: "",
  music_url: "",
  expires_at: "",

  // Dynamic Content
  content_data: {} as Record<string, any>,
});

const detectedKeys = computed(() => {
  const t = themes.value.find((t) => t.id === form.theme_id);
  const html = t?.custom_html || "";
  if (!html) return [];

  const matches = new Set<string>();

  // Pattern 1: {{.ContentData.KeyName}}
  const regexDot = /{{\s*\.?ContentData\.([a-zA-Z0-9_]+)\s*}}/g;
  let match;
  while ((match = regexDot.exec(html)) !== null) {
    matches.add(match[1]);
  }

  // Pattern 2: index .ContentData "KeyName"
  const regexIndex = /index\s+\.?ContentData\s+"([a-zA-Z0-9_]+)"/g;
  while ((match = regexIndex.exec(html)) !== null) {
    matches.add(match[1]);
  }

  return Array.from(matches).sort();
});

const displayedKeys = computed(() => {
  const fromTheme = new Set(detectedKeys.value);
  const fromForm = new Set(Object.keys(form.content_data || {}));
  const combined = new Set([...fromTheme, ...fromForm]);
  return Array.from(combined).sort();
});

const isDetected = (key: string) => {
  return detectedKeys.value.includes(key);
};

const isLoveStoryKey = (key: string) => /^Story\d+(Year|Title|Desc)$/.test(key);
const isGiftKey = (key: string) =>
  ["GiftBankName", "GiftAccountNumber", "GiftAccountHolder"].includes(key);

const dynamicContentKeys = computed(() => {
  return detectedKeys.value.filter(
    (key) => !isLoveStoryKey(key) && !isGiftKey(key),
  );
});

const loveStoryGroups = computed(() => {
  const groups = new Map<number, any>();
  detectedKeys.value.forEach((key) => {
    const match = key.match(/^Story(\d+)(Year|Title|Desc)$/);
    if (match) {
      const idx = parseInt(match[1]);
      if (!groups.has(idx)) {
        groups.set(idx, {
          index: idx,
          year: `Story${idx}Year`,
          title: `Story${idx}Title`,
          desc: `Story${idx}Desc`,
        });
      }
    }
  });
  return Array.from(groups.values()).sort((a, b) => a.index - b.index);
});

const previewUrl = computed(() => {
  if (!tenant.value) return "";
  return `http://localhost:8080/${tenant.value.subdomain}`;
});

const fetchData = async () => {
  loading.value = true;
  try {
    const headers = { Authorization: `Bearer ${authStore.accessToken}` };

    // Parallel fetch
    const [tenantRes, invRes, themesRes] = await Promise.all([
      $fetch<any>(`${config.public.apiBaseUrl}/tenants/${tenantId}`, {
        headers,
      }),
      $fetch<any>(
        `${config.public.apiBaseUrl}/tenants/${tenantId}/invitation`,
        { headers },
      ),
      $fetch<any>(`${config.public.apiBaseUrl}/themes`, { headers }),
    ]);

    tenant.value = tenantRes.data;
    invitation.value = invRes.data || {};
    themes.value = themesRes.data || [];

    if (invitation.value) {
      Object.assign(form, invitation.value);

      if (invitation.value.akad_date)
        form.akad_date = invitation.value.akad_date.split("T")[0];
      if (invitation.value.reception_date)
        form.reception_date = invitation.value.reception_date.split("T")[0];

      // Map ExpiresAt (RFC3339 to datetime-local)
      if (invitation.value.expires_at) {
        // Take YYYY-MM-DDTHH:MM
        form.expires_at = invitation.value.expires_at.slice(0, 16);
      }

      if (!form.content_data) form.content_data = {};

      // Fetch Gallery
      await fetchGallery(invitation.value.id);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to load data");
  } finally {
    loading.value = false;
  }
};

const fetchGallery = async (invId: string) => {
  try {
    const res = await $fetch<any>(
      `${config.public.apiBaseUrl}/invitations/${invId}/gallery`,
      {
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      },
    );
    gallery.value = res.data || [];
  } catch (e) {
    console.error("Failed to fetch gallery", e);
  }
};

const resolveUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;

  // Clean base URL: remove trailing slash and 'api/v1' suffix if present
  let baseUrl = (config.public.apiBaseUrl || "").replace(/\/$/, "");
  if (baseUrl.endsWith("/api/v1")) {
    baseUrl = baseUrl.substring(0, baseUrl.length - 7); // remove /api/v1
  }

  const path = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${path.replace(/\\/g, "/")}`; // Normalize windows path
};

const uploadMusic = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append("file", input.files[0]);
    const uploadRes: any = await $fetch(
      `${config.public.apiBaseUrl}/upload/music`,
      {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      },
    );
    if (uploadRes.data && uploadRes.data.url) {
      form.music_url = uploadRes.data.url;
    }
  } catch (e: any) {
    console.error(e);
    alert(e.data?.message || "Upload failed");
  } finally {
    uploading.value = false;
    input.value = "";
  }
};

const uploadGalleryImage = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length || !invitation.value) return;

  uploading.value = true;
  try {
    const file = input.files[0];

    // 1. Upload File
    const formData = new FormData();
    formData.append("file", file);
    const uploadRes: any = await $fetch(
      `${config.public.apiBaseUrl}/upload/image?type=gallery`,
      {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      },
    );
    const imageUrl = uploadRes.data.url;

    // 2. Add to Gallery
    await $fetch(
      `${config.public.apiBaseUrl}/invitations/${invitation.value.id}/gallery`,
      {
        method: "POST",
        body: { image_url: imageUrl },
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      },
    );

    // Refresh Gallery
    await fetchGallery(invitation.value.id);
  } catch (e: any) {
    console.error(e);
    alert(e.data?.message || "Upload failed");
  } finally {
    uploading.value = false;
    input.value = "";
  }
};

const deleteGalleryItem = async (id: string) => {
  if (!confirm("Delete this image?")) return;
  try {
    await $fetch(`${config.public.apiBaseUrl}/gallery/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });
    // Remove from list immediately
    gallery.value = gallery.value.filter((g) => g.id !== id);
  } catch (e) {
    alert("Failed to delete");
  }
};

const clearContentKey = (key: string) => {
  if (form.content_data[key] !== undefined) {
    form.content_data[key] = "";
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  // Optional: Toast
};

const saveInvitation = async () => {
  saving.value = true;
  try {
    // Create payload
    const payload = { ...form };

    // Format expires_at (datetime-local to RFC3339/ISO)
    if (payload.expires_at) {
      // datetime-local gives "YYYY-MM-DDTHH:MM"
      // Convert to Date object (local time) then to ISO (UTC)
      // Strip milliseconds to ensure Go RFC3339 compatibility if needed
      const date = new Date(payload.expires_at);
      payload.expires_at = date.toISOString().split(".")[0] + "Z";
    } else {
      (payload as any).expires_at = null;
    }

    await $fetch(
      `${config.public.apiBaseUrl}/invitations/${invitation.value.id}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
        body: payload,
      },
    );
    // Refresh iframe to show changes (since render is server-side)
    iframeKey.value++;
    // Update local invitation state
    invitation.value = { ...invitation.value, ...payload };
  } catch (e) {
    console.error(e);
    alert("Failed to save");
  } finally {
    saving.value = false;
  }
};

const publishInvitation = async () => {
  if (!invitation.value) return;
  try {
    await $fetch(
      `${config.public.apiBaseUrl}/invitations/${invitation.value.id}/publish`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      },
    );
    invitation.value.is_published = true;
    alert("Published successfully!");
  } catch (e) {
    alert("Failed to publish");
  }
};

const unpublishInvitation = async () => {
  if (!invitation.value) return;
  try {
    await $fetch(
      `${config.public.apiBaseUrl}/invitations/${invitation.value.id}/unpublish`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      },
    );
    invitation.value.is_published = false;
    alert("Unpublished successfully");
  } catch (e) {
    alert("Failed to unpublish");
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
