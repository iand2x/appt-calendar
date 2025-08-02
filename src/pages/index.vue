<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
      <h2 class="text-2xl font-bold text-[color:var(--color-primary)] mb-4 text-center">
        Technician Login
      </h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            id="email"
            type="email"
            required
            class="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
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
          class="w-full bg-[color:var(--color-primary)] text-white py-2 rounded-md hover:bg-blue-800 transition"
        >
          Sign In
        </button>
      </form>

      <p v-if="error" class="mt-4 text-sm text-red-600 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Hardcoded credentials (for now)
const VALID_EMAIL = 'tech@example.com'
const VALID_PASSWORD = 'password123'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

function handleLogin() {
  if (email.value === VALID_EMAIL && password.value === VALID_PASSWORD) {
    // You can store a flag in localStorage/sessionStorage to simulate "logged in"
    localStorage.setItem('isLoggedIn', 'true')
    router.push('/appointments')
  } else {
    error.value = 'Invalid email or password.'
  }
}
</script>
