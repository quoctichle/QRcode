// Middleware để bảo vệ trang - tự động redirect về login nếu chưa đăng nhập
export default defineRouteMiddleware((to, from) => {
  // Kiểm tra localStorage
  if (process.client) {
    const savedEmail = localStorage.getItem('userEmail')

    // Nếu chưa đăng nhập và không phải trang login
    if (!savedEmail && to.path !== '/login') {
      return navigateTo('/login')
    }

    // Nếu đã đăng nhập và đang ở trang login, redirect về dashboard
    if (savedEmail && to.path === '/login') {
      return navigateTo('/dashboard')
    }
  }
})
