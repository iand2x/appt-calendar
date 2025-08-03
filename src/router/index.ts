import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate} from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

if (import.meta.hot) { 
  handleHotUpdate(router) 
}

router.beforeEach((to, from, next) => {
  // Check if any of the matched route records require authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Replace this with your actual authentication check
    const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      next({
        path: '/',
        query: { redirect: to.fullPath }, // Optional: redirect back after login
      });
    } else {
      next(); // Proceed if authenticated
    }
  } else {
    next(); // Always call next() for routes that don't require auth
  }
});

export default router