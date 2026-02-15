<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from './stores/appStore';
import Sidebar from './components/Sidebar.vue';
import PWAInstallBanner from './components/PWAInstallBanner.vue';
import { Menu } from 'lucide-vue-next';

const route = useRoute();
const store = useAppStore();
const mobileMenuOpen = ref(false);

const isLoginPage = computed(() => route.path === '/login' || route.path === '/register');

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};
</script>

<template>
  <div v-if="isLoginPage">
    <router-view />
  </div>
  <div v-else class="app-layout">
    <!-- Botón hamburguesa para móvil -->
    <button 
      v-if="!isLoginPage" 
      @click="toggleMobileMenu" 
      class="mobile-menu-btn"
      aria-label="Abrir menú"
    >
      <Menu :size="24" />
    </button>

    <!-- Overlay para cerrar menú en móvil -->
    <div 
      v-if="mobileMenuOpen" 
      class="sidebar-overlay active" 
      @click="closeMobileMenu"
    ></div>

    <Sidebar :mobile-open="mobileMenuOpen" @close="closeMobileMenu" />
    <main class="main-content with-sidebar">
      <router-view />
    </main>
  </div>
  
  <!-- Banner de instalación PWA -->
  <PWAInstallBanner />
</template>

<style>
/* Los estilos globales están en assets/main.css */
</style>
