<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '../stores/appStore';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  LogOut,
  FileText,
  ChevronRight,
  Plus
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const store = useAppStore();

const allNavItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'tecnico', 'cliente'] },
  { name: 'Tickets', path: '/tickets', icon: Ticket, roles: ['admin', 'tecnico', 'cliente'] },
  { name: 'Albaranes', path: '/albaranes', icon: FileText, roles: ['admin', 'tecnico', 'cliente'] },
  { name: 'Equipo', path: '/technicians', icon: Users, roles: ['admin', 'tecnico'] },
  { name: 'Clientes', path: '/clients', icon: Users, roles: ['admin', 'tecnico'] },
];

const navItems = computed(() => {
  const userRole = store.currentUser?.role || 'cliente';
  return allNavItems.filter(item => item.roles.includes(userRole));
});

const handleLogout = () => {
  store.logout();
  router.push('/login');
};
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <Ticket />
      </div>
      <span class="sidebar-title">SupportDesk</span>
    </div>

    <nav class="sidebar-nav">
      <router-link 
        v-for="item in navItems" 
        :key="item.path"
        :to="item.path"
        class="sidebar-nav-item"
        :class="{ active: route.path === item.path }"
      >
        <component :is="item.icon" />
        {{ item.name }}
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div v-if="store.currentUser" class="sidebar-user">
        <div class="sidebar-avatar">
          {{ store.currentUser.name.charAt(0) }}
        </div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name truncate">{{ store.currentUser.name }}</div>
          <div class="sidebar-user-email truncate">{{ store.currentUser.email }}</div>
        </div>
      </div>
      <button @click="handleLogout" class="sidebar-logout">
        <LogOut />
        Cerrar Sesión
      </button>
    </div>
  </aside>
</template>
