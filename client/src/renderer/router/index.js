import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
// Routes
import SharedRoutes from '@/router/Shared/SharedRoutes'
import AdminRoutes from '@/router/Admin/AdminRoutes'

Vue.use(VueRouter)

// Assemble all routes
var allRoutes = [].concat(SharedRoutes, AdminRoutes)
const routes = allRoutes

const router = new VueRouter({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes: routes
})

/* Route guards
======================================== */
router.beforeEach((to, from, next) => {
	/* Admin routes that require authentication
	======================================== */
	if (to.matched.some(record => record.meta.requiresAuth === 'admin')) {
		// TODO: Use isAdminLoggedIn getter instead
		const isLoggedIn = store.getters.isLoggedIn
		const loggedInUser = store.getters.getUser
		const isAdmin = loggedInUser !== null ? loggedInUser.roles.includes('admin') : false

		if (isLoggedIn && isAdmin) {
			return next()
		} else {
			return next('/forbidden')
		}

	/* User routes that require authentication
	======================================== */
	} else if (to.matched.some(record => record.meta.requiresAuth === 'user')) {
		// TODO: Use isUserLoggedIn getter instead
		const isLoggedIn = store.getters.isLoggedIn
		const loggedInUser = store.getters.getUser
		const isUser = loggedInUser !== null ? loggedInUser.roles.includes('user') : false

		if (isLoggedIn && isUser) {
			return next()
		} else {
			return next('/forbidden')
		}
	} else {
		// Routes that do not require either 'user' or 'admin' authentication
		return next()
	}
})

export default router
