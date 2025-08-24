<template>
  <div>
    <!-- Empty state -->
    <div
      v-if="appointments.length === 0"
      class="text-center py-8 bg-white rounded-lg shadow"
    >
      <div class="text-gray-400 text-4xl mb-4">📅</div>
      <h3 class="text-lg font-medium text-gray-600 mb-2">
        No appointments scheduled
      </h3>
      <p class="text-gray-500">
        Create your first appointment using the form above.
      </p>
    </div>

    <!-- Appointments list -->
    <div v-else class="space-y-4">
      <div
        v-for="appt in appointments"
        :key="appt.id"
        class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 hover:shadow-md hover:bg-gray-50 transition-shadow transition-colors hover:cursor-pointer group"
        @click="$emit('view', appt)"
      >
        <!-- Header with date and dentist -->
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1">
            <h3 class="font-semibold text-lg text-gray-800">
              {{ formatDate(appt.date) }}
              <span class="text-sm text-gray-500 font-normal">{{
                formatTime(appt.date)
              }}</span>
            </h3>
          </div>
          <div class="text-right">
            <span
              class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-bold"
            >
              {{ appt.dentist }}
            </span>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-500 italic"
            >Click to view details</span
          >
          <div class="flex space-x-2">
            <button
              @click.stop="$emit('edit', appt)"
              aria-label="Edit appointment"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium hover:cursor-pointer"
            >
              <PencilIcon class="h-4 w-4 inline-block" />
            </button>
            <button
              @click.stop="$emit('delete', appt.id)"
              aria-label="Delete appointment"
              class="text-red-600 hover:text-red-800 text-sm font-medium hover:cursor-pointer"
            >
              <TrashIcon class="h-4 w-4 inline-block" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Appointment } from "@/features/appointments/appointmentTypes";
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";

defineProps<{
  appointments: Appointment[];
}>();

defineEmits<{
  edit: [appointment: Appointment];
  delete: [id: string];
  view: [appointment: Appointment];
}>();

// Helper functions for date formatting
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
</script>
