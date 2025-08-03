<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
      <h2
        class="text-2xl font-bold text-[color:var(--color-primary)] mb-4 text-center"
      >
        Technician Login
      </h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            v-model="email"
            id="email"
            type="email"
            required
            class="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            v-model="password"
            id="password"
            type="password"
            required
            class="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-[color:var(--color-primary)] text-white py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? "Signing In..." : "Sign In" }}
        </button>
      </form>

      <p v-if="error" class="mt-4 text-sm text-red-600 text-center">
        {{ error }}
      </p>

      <!-- Test Accounts Helper -->
      <div class="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Test Accounts:</h3>
        <div class="space-y-2">
          <div
            v-for="account in testAccounts"
            :key="account.email"
            class="flex justify-between items-center text-xs bg-white p-2 rounded cursor-pointer hover:bg-gray-50"
            @click="fillTestAccount(account)"
          >
            <div>
              <div class="font-medium">{{ account.role }}</div>
              <div class="text-gray-500">{{ account.email }}</div>
            </div>
            <div class="text-gray-400">{{ account.password }}</div>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">Click any account to auto-fill</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);
const router = useRouter();
const auth = useAuthStore();

// Display available test accounts
const testAccounts = [
  { email: "tech@example.com", password: "password123", role: "Technician" },
  { email: "dr.smith@clinic.com", password: "dentist456", role: "Dentist" },
  { email: "admin@clinic.com", password: "admin789", role: "Admin" },
];

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = "Please fill in all fields";
    return;
  }

  isLoading.value = true;
  error.value = "";

  const result = await auth.login({
    email: email.value,
    password: password.value,
  });

  isLoading.value = false;

  if (result.success) {
    router.push("/dashboard");
  } else {
    error.value = result.message || "Login failed";
  }
}

function fillTestAccount(account) {
  email.value = account.email;
  password.value = account.password;
}
</script>
