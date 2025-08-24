<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Edit Appointment</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 hover:cursor-pointer"
        >
          ✕
        </button>
      </div>
      <AppointmentForm
        :appointment="appointment"
        :is-edit-mode="true"
        @submit="$emit('submit', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppointmentForm from "@/components/AppointmentForm.vue";
import type {
  Appointment,
  AppointmentUpdateData,
} from "@/features/appointments/appointmentTypes";

interface Props {
  show: boolean;
  appointment?: Appointment;
}

defineProps<Props>();

defineEmits<{
  close: [];
  submit: [data: AppointmentUpdateData & { id?: string }];
}>();
</script>
