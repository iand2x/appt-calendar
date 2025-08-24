<template>
  <form @submit.prevent="submit">
    <div class="grid gap-2">
      <input
        v-model="form.date"
        type="date"
        required
        class="p-2 border rounded hover:cursor-pointer"
      />
      <input
        v-model="form.time"
        type="time"
        required
        class="p-2 border rounded hover:cursor-pointer"
      />
      <input
        v-model="form.dentist"
        type="text"
        placeholder="Dentist Name"
        required
        class="p-2 border rounded"
      />
      <select
        v-model="form.equipment"
        required
        class="p-2 border rounded hover:cursor-pointer"
      >
        <option disabled value="">Select Equipment</option>
        <option>Compressor</option>
        <option>Suction Machine</option>
        <option>Scanner</option>
        <option>Hygiene Equipment</option>
      </select>
      <textarea
        v-model="form.notes"
        placeholder="Notes"
        class="p-2 border rounded"
      />
      <button
        type="submit"
        class="px-4 py-2 rounded transition-colors bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer"
      >
        {{ isEditMode ? "Update" : "Add" }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Appointment } from "@/features/appointments/appointmentTypes";

interface Props {
  appointment?: Appointment;
  isEditMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  appointment: undefined,
  isEditMode: false,
});

const emit = defineEmits(["submit"]);

const form = ref({
  date: "",
  time: "",
  dentist: "",
  equipment: "",
  notes: "",
});

// Watch for appointment prop changes to populate form for editing
watch(
  () => props.appointment,
  (newAppointment) => {
    if (newAppointment && props.isEditMode) {
      const appointmentDate = new Date(newAppointment.date);
      form.value = {
        date: appointmentDate.toISOString().split("T")[0], // YYYY-MM-DD format
        time: appointmentDate.toTimeString().slice(0, 5), // HH:MM format
        dentist: newAppointment.dentist,
        equipment: newAppointment.equipment,
        notes: newAppointment.notes || "",
      };
    }
  },
  { immediate: true }
);

function submit() {
  let datetime = "";
  if (form.value.date && form.value.time) {
    const dt = new Date(`${form.value.date}T${form.value.time}`);
    datetime = dt.toISOString();
  }

  const submissionData = {
    dentist: form.value.dentist,
    equipment: form.value.equipment,
    notes: form.value.notes,
    date: datetime, // Submit as 'date' to match Appointment interface
    ...(props.isEditMode && props.appointment
      ? { id: props.appointment.id }
      : {}),
  };

  emit("submit", submissionData);

  // Only reset form if not in edit mode
  if (!props.isEditMode) {
    form.value = { date: "", time: "", dentist: "", equipment: "", notes: "" };
  }
}
</script>
