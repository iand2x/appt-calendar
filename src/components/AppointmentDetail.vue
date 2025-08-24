<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Appointment Details</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 hover:cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div v-if="appointment" class="space-y-4">
        <!-- Date and Time -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-gray-800 mb-2">
            {{ formatDate(appointment.date) }}
          </h4>
          <p class="text-sm text-gray-600">
            {{ formatTime(appointment.date) }}
          </p>
        </div>

        <!-- Details -->
        <div class="space-y-3">
          <div class="flex items-center">
            <span class="text-gray-500 text-sm font-medium w-24">Dentist:</span>
            <span class="text-gray-800">{{ appointment.dentist }}</span>
          </div>

          <div class="flex items-center">
            <span class="text-gray-500 text-sm font-medium w-24"
              >Equipment:</span
            >
            <span
              class="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {{ appointment.equipment }}
            </span>
          </div>

          <div v-if="appointment.notes" class="flex items-start">
            <span class="text-gray-500 text-sm font-medium w-24 mt-0.5"
              >Notes:</span
            >
            <span class="text-gray-700 text-sm">{{ appointment.notes }}</span>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex space-x-2 pt-4">
          <button
            @click="$emit('edit', appointment)"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors hover:cursor-pointer"
          >
            Edit Appointment
          </button>
          <button
            @click="$emit('delete', appointment.id)"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors hover:cursor-pointer"
          >
            Delete Appointment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Appointment } from "@/features/appointments/appointmentTypes";

interface Props {
  show: boolean;
  appointment?: Appointment;
}

defineProps<Props>();

defineEmits<{
  close: [];
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
