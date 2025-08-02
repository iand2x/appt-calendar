<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-6xl mx-auto">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-[color:var(--color-primary)] mb-2">
          Appointments Dashboard
        </h1>
        <p class="text-gray-600">Welcome to the appointment calendar</p>
      </header>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Today's Schedule</h2>
        <p class="text-gray-500">Calendar functionality coming soon...</p>
        
        <div class="mt-6">
          <button 
            @click="handleLogout"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function handleLogout() {
  localStorage.removeItem('isLoggedIn')
  router.push('/')
}
</script>