<template>
  <div class="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto w-full bg-white rounded-xl shadow-lg border p-4 flex items-start gap-3 border-gray-100"
      >
        <!-- Icon -->
        <span class="text-lg shrink-0">
          <span v-if="toast.type === 'success'">✅</span>
          <span v-else-if="toast.type === 'error'">❌</span>
          <span v-else-if="toast.type === 'warning'">⚠️</span>
          <span v-else>ℹ️</span>
        </span>

        <!-- Message -->
        <div class="flex-1">
          <p class="text-xs font-semibold" :class="{
            'text-green-800': toast.type === 'success',
            'text-red-800': toast.type === 'error',
            'text-amber-800': toast.type === 'warning',
            'text-gray-800': toast.type === 'info',
          }">
            {{ toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : toast.type === 'warning' ? 'Warning' : 'Info' }}
          </p>
          <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ toast.message }}</p>
        </div>

        <!-- Close Button -->
        <button
          @click="remove(toast.id)"
          class="text-gray-400 hover:text-gray-600 transition shrink-0 focus:outline-none"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'
const { toasts, remove } = useToast()
</script>
