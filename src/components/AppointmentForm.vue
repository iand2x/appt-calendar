<template>
  <form @submit.prevent="submit">
    <div class="grid gap-2">
      <input
        v-model="form.date"
        type="datetime-local"
        required
        class="p-2 border rounded"
      />
      <input
        v-model="form.dentist"
        type="text"
        placeholder="Dentist Name"
        required
        class="p-2 border rounded"
      />
      <select v-model="form.equipment" required class="p-2 border rounded">
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
        class="px-4 py-2 rounded transition-colors bg-blue-600 text-white hover:bg-blue-700"
      >
        Add
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
const emit = defineEmits(["submit"]);

const form = ref({
  date: "",
  dentist: "",
  equipment: "",
  notes: "",
});

function submit() {
  emit("submit", { ...form.value });
  form.value = { date: "", dentist: "", equipment: "", notes: "" };
}
</script>
