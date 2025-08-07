<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <header class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-blue-900">
          Welcome, {{ user?.username }}
        </h1>
        <p
          v-if="user?.role === 'admin'"
          class="text-sm text-green-600 font-medium"
        >
          👑 Administrator View - Viewing all appointments
        </p>
      </div>
      <button @click="logout" class="text-sm text-red-600 underline">
        Logout
      </button>
    </header>

    <section class="mb-6 max-w-2xl mx-auto">
      <h2 class="text-lg font-semibold mb-2 text-center">
        Create New Appointment
      </h2>
      <AppointmentForm @submit="addAppointment" />
    </section>
    <section>
      <h2 class="text-lg font-semibold mb-2">
        {{
          user?.role === "admin" ? "All Appointments" : "Upcoming Appointments"
        }}
      </h2>

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
          @click="
            user?.role === 'admin'
              ? appointmentStore.fetchAllAppointments()
              : appointmentStore.fetchAppointments(user?.email ?? '')
          "
          class="mt-2 text-sm text-red-700 underline hover:no-underline"
        >
          Try again
        </button>
      </div>

      <!-- Appointments list -->
      <AppointmentList
        v-else
        :appointments="appointments"
        @edit="handleEdit"
        @delete="handleDelete"
        @view="handleView"
      />
    </section>

    <!-- Modals -->
    <AppointmentDetail
      :show="showDetailModal"
      :appointment="viewingAppointment || undefined"
      @close="closeDetailModal"
      @edit="handleEditFromDetail"
      @delete="handleDeleteFromDetail"
    />

    <EditAppointmentModal
      :show="showEditModal"
      :appointment="editingAppointment || undefined"
      @close="closeEditModal"
      @submit="handleEditSubmit"
    />

    <DeleteConfirmationModal
      :show="showDeleteModal"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useAppointmentStore } from "@/stores/appointmentsStore";
import { useAuthGuard } from "@/composables/useAuthGuard";
import AppointmentList from "@/components/AppointmentList.vue";
import AppointmentForm from "@/components/AppointmentForm.vue";
import EditAppointmentModal from "@/components/EditAppointmentModal.vue";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";
import AppointmentDetail from "@/components/AppointmentDetail.vue";
// Import from feature-specific types
import type {
  AppointmentFormData,
  AppointmentUpdateData,
  Appointment,
} from "@/features/appointments/appointmentTypes";

definePage({
  meta: {
    requiresAuth: true,
  },
});

const authStore = useAuthStore();
const router = useRouter();

// Use the auth guard composable for component-level protection
useAuthGuard();
const user = authStore.user;

const appointmentStore = useAppointmentStore();

// Modal state for editing
const showEditModal = ref(false);
const editingAppointment = ref<Appointment | null>(null);

// Modal state for delete confirmation
const showDeleteModal = ref(false);
const deletingAppointmentId = ref<string | null>(null);

// Modal state for appointment detail view
const showDetailModal = ref(false);
const viewingAppointment = ref<Appointment | null>(null);

// View appointment based on user role
const appointments = computed(() =>
  user?.role === "admin"
    ? appointmentStore.appointmentsByDate
    : appointmentStore.getAppointmentsForUser(user?.email ?? "")
);

// Loading and error states
const isLoading = computed(() => appointmentStore.isLoading);
const error = computed(() => appointmentStore.error);

// Fetch appointments when component mounts
onMounted(async () => {
  if (user?.email) {
    if (user.role === "admin") {
      appointmentStore.fetchAllAppointments();
    } else {
      appointmentStore.fetchAppointments(user.email);
    }
  }
});

async function logout() {
  authStore.logout();
  router.push("/");
}

async function addAppointment(data: AppointmentFormData) {
  if (!user?.email) return;

  const result = await appointmentStore.addAppointment(
    {
      ...data,
    },
    user.email
  );

  if (result.success) {
    console.log("Appointment created successfully!");
  } else {
    console.error("Failed to create appointment:", result.message);
  }
}

function handleEdit(appointment: Appointment) {
  editingAppointment.value = appointment;
  showEditModal.value = true;
}

function handleView(appointment: Appointment) {
  viewingAppointment.value = appointment;
  showDetailModal.value = true;
}

function closeDetailModal() {
  showDetailModal.value = false;
  viewingAppointment.value = null;
}

function handleEditFromDetail(appointment: Appointment) {
  // Close detail modal and open edit modal
  closeDetailModal();
  handleEdit(appointment);
}

function handleDeleteFromDetail(appointmentId: string) {
  // Close detail modal and open delete confirmation
  closeDetailModal();
  handleDelete(appointmentId);
}

function closeEditModal() {
  showEditModal.value = false;
  editingAppointment.value = null;
}

async function handleEditSubmit(data: AppointmentUpdateData & { id?: string }) {
  if (!user?.email || !data.id) return;
  console.log("Submitting edit for appointment:", data);

  // Extract id and pass only the update fields
  const { id, ...updateData } = data;

  const result = await appointmentStore.updateAppointment(
    id,
    updateData,
    user.email,
    user.role
  );

  if (result.success) {
    console.log("Appointment updated successfully!");
    closeEditModal();
  } else {
    console.error("Failed to update appointment:", result.message);
  }
}

function handleDelete(appointmentId: string) {
  deletingAppointmentId.value = appointmentId;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  deletingAppointmentId.value = null;
}

async function confirmDelete() {
  if (!user?.email || !deletingAppointmentId.value) return;

  const result = await appointmentStore.deleteAppointment(
    deletingAppointmentId.value,
    user.email,
    user.role
  );

  if (result.success) {
    console.log("Appointment deleted successfully!");
    closeDeleteModal();
  } else {
    console.error("Failed to delete appointment:", result.message);
  }
}
</script>
