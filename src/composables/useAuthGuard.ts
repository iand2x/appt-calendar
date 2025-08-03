import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

/**
 * Composable for component-level authentication guard
 * Use this in components that require authentication
 */
export function useAuthGuard() {
  const authStore = useAuthStore();
  const router = useRouter();

  const checkAuth = async () => {
    // If not authenticated, try to load from storage
    if (!authStore.isAuthenticated) {
      await authStore.loadStoredAuth();
    }

    // If still not authenticated after loading, redirect to login
    if (!authStore.isAuthenticated) {
      router.push("/");
      return false;
    }

    return true;
  };

  // Auto-check on mount
  onMounted(checkAuth);

  return {
    checkAuth,
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
  };
}
