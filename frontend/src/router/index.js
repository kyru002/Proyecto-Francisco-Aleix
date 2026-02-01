import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Tickets from '../views/Tickets.vue';
import Technicians from '../views/Technicians.vue';
import Clients from '../views/Clients.vue';
import Login from '../views/Login.vue';

const routes = [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', name: 'Login', component: Login },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/tickets', name: 'Tickets', component: Tickets, meta: { requiresAuth: true } },
    { path: '/technicians', name: 'Technicians', component: Technicians, meta: { requiresAuth: true } },
    { path: '/clients', name: 'Clients', component: Clients, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (to.meta.requiresAuth && !currentUser) {
        next('/login');
    } else {
        next();
    }
});

export default router;
