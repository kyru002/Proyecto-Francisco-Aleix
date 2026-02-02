<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../stores/appStore';
import { Ticket, Mail, Lock, AlertCircle } from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

const email = ref('');
const password = ref('');
const error = ref('');

const handleLogin = () => {
  // Simulación de login - múltiples cuentas de prueba
  const users = {
    'admin@support.com': { id: "1", name: "Admin Usuario", role: "admin", password: "admin123", clienteId: null },
    'tecnico@support.com': { id: "2", name: "Juan García (Técnico)", role: "tecnico", password: "tecnico123", clienteId: null },
    'cliente@support.com': { id: "3", name: "María López (Cliente)", role: "cliente", password: "cliente123", clienteId: "697fd860d39080019956aa07" }
  };

  const user = users[email.value];
  
  if (user && password.value === user.password) {
    store.login({
      id: user.id,
      name: user.name,
      email: email.value,
      role: user.role,
      clienteId: user.clienteId
    });
    router.push('/dashboard');
  } else {
    error.value = 'Credenciales no válidas. Consulta la sección de cuentas de demostración.';
  }
};
</script>

<template>
  <div class="login-page">
    <div class="card login-card">
      <div class="login-header">
        <div class="login-logo">
          <Ticket />
        </div>
        <h1 class="login-title">SupportDesk</h1>
        <p class="login-description">Ingresa a tu cuenta para gestionar el soporte</p>
      </div>

      <div class="login-body">
        <div v-if="error" class="login-error">
          <AlertCircle style="width: 16px; height: 16px;" />
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label class="form-label">Correo Electrónico</label>
            <div class="input-with-icon">
              <Mail />
              <input v-model="email" type="email" class="form-input" placeholder="correo@ejemplo.com" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <div class="input-with-icon">
              <Lock />
              <input v-model="password" type="password" class="form-input" placeholder="••••••••" required>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem; height: 44px;">
            Iniciar Sesión
          </button>
        </form>

        <div class="login-demo">
          <div class="login-demo-title">CUENTAS DE DEMOSTRACIÓN</div>
          <div class="login-demo-credentials">
            <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb;">
              <strong style="color: #6366f1;">Administrador:</strong><br>
              Email: <strong>admin@support.com</strong><br>
              Pass: <strong>admin123</strong>
            </div>
            <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb;">
              <strong style="color: #f59e0b;">Técnico:</strong><br>
              Email: <strong>tecnico@support.com</strong><br>
              Pass: <strong>tecnico123</strong>
            </div>
            <div>
              <strong style="color: #10b981;">Cliente:</strong><br>
              Email: <strong>cliente@support.com</strong><br>
              Pass: <strong>cliente123</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
