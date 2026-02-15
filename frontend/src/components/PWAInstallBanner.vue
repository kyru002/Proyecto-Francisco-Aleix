<script setup>
import { ref, onMounted, computed } from 'vue';
import { X, Download, Smartphone } from 'lucide-vue-next';

const showBanner = ref(false);
const deferredPrompt = ref(null);
const isIOS = ref(false);
const isAndroid = ref(false);

onMounted(() => {
  // Detectar plataforma
  const userAgent = window.navigator.userAgent.toLowerCase();
  isIOS.value = /iphone|ipad|ipod/.test(userAgent);
  isAndroid.value = /android/.test(userAgent);
  
  // Detectar si ya está instalada
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true;
  
  if (isStandalone) {
    return;
  }

  // Detectar si ya rechazó antes (se resetea después de 3 días)
  const dismissed = localStorage.getItem('pwa-banner-dismissed');
  const dismissedTime = localStorage.getItem('pwa-banner-dismissed-time');
  
  if (dismissed && dismissedTime) {
    const daysSince = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
    if (daysSince < 3) {
      return;
    } else {
      localStorage.removeItem('pwa-banner-dismissed');
      localStorage.removeItem('pwa-banner-dismissed-time');
    }
  }

  // Para iOS, mostrar siempre instrucciones (no tiene beforeinstallprompt)
  if (isIOS.value) {
    setTimeout(() => {
      showBanner.value = true;
    }, 2000);
    return;
  }

  // Para Android/Desktop: esperar evento
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    
    setTimeout(() => {
      showBanner.value = true;
    }, 2000);
  });

  // Si después de 5 segundos no hay evento y es móvil, mostrar de todas formas
  if (isAndroid.value || /mobile/i.test(userAgent)) {
    setTimeout(() => {
      if (!showBanner.value) {
        showBanner.value = true;
      }
    }, 5000);
  }
});

const bannerTitle = computed(() => {
  if (isIOS.value) return '🍎 Añadir a Inicio';
  if (isAndroid.value) return '📱 Instalar App';
  return '💻 Instalar SupportDesk';
});

const bannerText = computed(() => {
  if (isIOS.value) return 'Toca el botón Compartir ⬆️ y luego "Añadir a pantalla de inicio"';
  if (isAndroid.value && !deferredPrompt.value) return 'Abre el menú (⋮) y selecciona "Añadir a pantalla de inicio"';
  return 'Instala la app para acceso rápido sin abrir el navegador';
});

const install = async () => {
  if (!deferredPrompt.value) {
    // Si no hay prompt en móvil, dar instrucciones manuales
    if (isAndroid.value) {
      alert('📱 Abre el menú (⋮) del navegador y selecciona "Añadir a pantalla de inicio" o "Instalar aplicación"');
    } else if (isIOS.value) {
      alert('🍎 Toca el botón Compartir ⬆️ en Safari y selecciona "Añadir a pantalla de inicio"');
    }
    return;
  }

  // Mostrar prompt nativo
  deferredPrompt.value.prompt();

  // Esperar respuesta del usuario
  const { outcome } = await deferredPrompt.value.userChoice;
  
  if (outcome === 'accepted') {
    console.log('✅ PWA instalada correctamente');
  }

  // Limpiar
  deferredPrompt.value = null;
  showBanner.value = false;
};

const dismiss = () => {
  showBanner.value = false;
  localStorage.setItem('pwa-banner-dismissed', 'true');
  localStorage.setItem('pwa-banner-dismissed-time', Date.now().toString());
};
</script>

<template>
  <Transition name="slide-up">
    <div v-if="showBanner" class="pwa-banner">
      <div class="pwa-banner-content">
        <div class="pwa-banner-icon">
          <Smartphone :size="32" :stroke-width="1.5" />
        </div>
        <div class="pwa-banner-text">
          <h3>{{ bannerTitle }}</h3>
          <p>{{ bannerText }}</p>
        </div>
        <div class="pwa-banner-actions">
          <button 
            v-if="!isIOS" 
            @click="install" 
            class="btn-install"
          >
            <Download :size="18" />
            {{ deferredPrompt ? 'Instalar' : 'Cómo instalar' }}
          </button>
          <button 
            v-else
            @click="install"
            class="btn-install"
          >
            ℹ️ Ver cómo
          </button>
          <button @click="dismiss" class="btn-close" aria-label="Cerrar">
            <X :size="18" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.pwa-banner {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 16px 20px;
  max-width: 90%;
  width: 500px;
  display: flex;
  animation: slideUp 0.3s ease-out;
}

.pwa-banner-content {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.pwa-banner-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.pwa-banner-text {
  flex: 1;
}

.pwa-banner-text h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.pwa-banner-text p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.pwa-banner-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.btn-install {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-install:hover {
  background: #4338ca;
}

.btn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-close:hover {
  background: #e5e7eb;
}

/* Transiciones */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* Responsive */
@media (max-width: 640px) {
  .pwa-banner {
    bottom: 10px;
    left: 10px;
    right: 10px;
    transform: none;
    width: auto;
    max-width: none;
  }

  .pwa-banner-content {
    flex-wrap: wrap;
  }

  .pwa-banner-actions {
    width: 100%;
    justify-content: stretch;
  }

  .btn-install {
    flex: 1;
  }
}
</style>
