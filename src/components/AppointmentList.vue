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
        Create your first appointment using the form below.
      </p>
    </div>

    <!-- Appointments list -->
    <div v-else class="space-y-4">
      <div
        v-for="appt in appointments"
        :key="appt.id"
        class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 hover:shadow-md transition-shadow"
      >
        <!-- Header with date and equipment -->
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1">
            <h3 class="font-semibold text-lg text-gray-800">
              {{ formatDate(appt.date) }}
            </h3>
            <p class="text-sm text-gray-500">{{ formatTime(appt.date) }}</p>
          </div>
          <span
            class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
          >
            {{ appt.equipment }}
          </span>
        </div>

        <!-- Details -->
        <div class="space-y-2">
          <div class="flex items-center">
            <span class="text-gray-500 text-sm font-medium w-20">Dentist:</span>
            <span class="text-gray-800">{{ appt.dentist }}</span>
          </div>

          <div v-if="appt.notes" class="flex items-start">
            <span class="text-gray-500 text-sm font-medium w-20 mt-0.5"
              >Notes:</span
            >
            <span class="text-gray-700 text-sm">{{ appt.notes }}</span>
          </div>
        </div>

        <!-- Status indicator -->
        <div class="mt-4 flex justify-between items-center">
          <div class="flex items-center text-xs text-gray-500">
            <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Scheduled
          </div>

          <!-- Action buttons -->
          <div class="flex space-x-2">
            <button
              @click="$emit('edit', appt)"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit
            </button>
            <button
              @click="$emit('delete', appt.id)"
              class="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Appointment } from "@/features/appointments/appointmentTypes";

defineProps<{
  appointments: Appointment[];
}>();

defineEmits<{
  edit: [appointment: Appointment];
  delete: [id: string];
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
