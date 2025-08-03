<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-blue-900">
        Welcome, {{ user?.username }}
      </h1>
      <button @click="logout" class="text-sm text-red-600 underline">
        Logout
      </button>
    </header>

    <section class="mb-6">
      <h2 class="text-lg font-semibold mb-2">Upcoming Appointments</h2>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 rounded-md p-4 mb-4"
      >
        <p class="text-red-600">{{ error }}</p>
        <button
          @click="appointmentStore.fetchAppointments(user?.email ?? '')"
          class="mt-2 text-sm text-red-700 underline hover:no-underline"
        >
          Try again
        </button>
      </div>

      <!-- Appointments list -->
      <AppointmentList v-else :appointments="appointments" />
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-2">Create New Appointment</h2>
      <AppointmentForm @submit="addAppointment" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useAppointmentStore } from "@/stores/appointments";
import AppointmentList from "@/components/AppointmentList.vue";
import AppointmentForm from "@/components/AppointmentForm.vue";
// Import from feature-specific types
import type { AppointmentFormData } from "@/features/appointments/types";

const authStore = useAuthStore();
const user = authStore.user;

const appointmentStore = useAppointmentStore();

// Computed property to get filtered appointments for current user
const appointments = computed(() =>
  appointmentStore.getAppointmentsForUser(user?.email ?? "")
);

// Loading and error states
const isLoading = computed(() => appointmentStore.isLoading);
const error = computed(() => appointmentStore.error);

// Fetch appointments when component mounts
onMounted(() => {
  if (user?.email) {
    appointmentStore.fetchAppointments(user.email);
  }
});

async function logout() {
  authStore.logout();
}

async function addAppointment(data: AppointmentFormData) {
  if (!user?.email) return;

  const result = await appointmentStore.addAppointment(
    {
      ...data,
      createdBy: user.email,
    },
    user.email
  );

  if (result.success) {
    // Optionally show success message
    console.log("Appointment created successfully!");
  } else {
    // Handle error
    console.error("Failed to create appointment:", result.message);
  }
}
</script>
