<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
      <div class="flex items-center mb-4">
        <div
          class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100"
        >
          <svg
            class="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      </div>
      <div class="text-center">
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Delete Appointment
        </h3>
        <p class="text-sm text-gray-500 mb-6">
          Are you sure you want to delete this appointment? This action cannot
          be undone.
        </p>
        <div class="flex space-x-3 justify-center">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="$emit('confirm')"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors hover:cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
}

defineProps<Props>();

defineEmits<{
  close: [];
  confirm: [];
}>();
</script>
