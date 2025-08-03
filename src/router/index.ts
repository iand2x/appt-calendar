import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";
import { handleHotUpdate } from "vue-router/auto-routes";
import { useAuthStore } from "@/stores/authStore";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Hot module replacement support for development
if (import.meta.hot) {
  handleHotUpdate(router);
}

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  // Try to load stored authentication on first visit
  if (!authStore.isAuthenticated && localStorage.getItem("auth_token")) {
    await authStore.loadStoredAuth();
  }

  // Check if any of the matched route records require authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      // Redirect to login page if not authenticated
      next({
        path: "/",
        query: { redirect: to.fullPath }, // Optional: redirect back after login
      });
    } else {
      next(); // Proceed if authenticated
    }
  } else {
    // For login page, redirect to dashboard if already authenticated
    if (to.path === "/" && authStore.isAuthenticated) {
      next("/dashboard");
    } else {
      next(); // Always call next() for routes that don't require auth
    }
  }
});

export default router;
