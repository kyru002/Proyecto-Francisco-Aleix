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
  // Simulación de login (el backend real solo tiene técnicos/clientes pero no auth completa aún)
  if (email.value === 'admin@support.com' && password.value === 'admin123') {
    store.login({
      id: "1",
      name: "Admin Usuario",
      email: "admin@support.com",
      role: "admin"
    });
    router.push('/dashboard');
  } else {
    error.value = 'Credenciales no válidas. Prueba con admin@support.com / admin123';
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
          <div class="login-demo-title">CUENTA DE DEMOSTRACIÓN</div>
          <div class="login-demo-credentials">
            Email: <strong>admin@support.com</strong><br>
            Pass: <strong>admin123</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
