<script setup>
import { onMounted, ref } from 'vue';
import { useAppStore } from '../stores/appStore';
import { 
  Plus, 
  Search, 
  Mail, 
  Shield, 
  Circle,
  MoreVertical,
  UserPlus
} from 'lucide-vue-next';

const store = useAppStore();
const showCreateModal = ref(false);
const newTecnico = ref({
  nombre: '',
  email: '',
  role: 'technician',
  estado: 'active'
});

onMounted(async () => {
  await store.fetchAll();
});

const handleCreateTecnico = async () => {
  try {
    await store.createTecnico(newTecnico.value);
    showCreateModal.value = false;
    newTecnico.value = { nombre: '', email: '', role: 'technician', estado: 'active' };
  } catch (error) {
    alert('Error al crear el técnico');
  }
};
</script>

<template>
  <div class="page-content">
    <div class="page-header">
      <div>
        <h1 class="page-title">Equipo de Soporte</h1>
        <p class="page-subtitle">Administra los técnicos y sus roles en el sistema</p>
      </div>
      <button @click="showCreateModal = true" class="btn btn-primary">
        <UserPlus />
        Nuevo Miembro
      </button>
    </div>

    <!-- Tabla de Técnicos -->
    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Miembro</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Tickets</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tecnico in store.tecnicos" :key="tecnico.id">
              <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <div class="sidebar-avatar">{{ tecnico.nombre.charAt(0) }}</div>
                  <div>
                    <div style="font-weight: 500;">{{ tecnico.nombre }}</div>
                    <div style="font-size: 0.75rem; color: var(--muted-foreground);">{{ tecnico.email }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div style="display: flex; align-items: center; gap: 0.375rem; font-size: 0.875rem;">
                  <Shield style="width: 14px; height: 14px; color: var(--primary);" />
                  {{ tecnico.role === 'admin' ? 'Administrador' : 'Técnico' }}
                </div>
              </td>
              <td>
                <span class="badge" :class="tecnico.estado === 'activo' || tecnico.estado === 'active' ? 'badge-active' : 'badge-inactive'">
                  {{ tecnico.estado === 'activo' || tecnico.estado === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>{{ tecnico.ticketsAssigned || 0 }}</td>
              <td>
                <button class="btn btn-ghost btn-icon">
                  <MoreVertical />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Creación -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Añadir Miembro al Equipo</h2>
        </div>
        <form @submit.prevent="handleCreateTecnico">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Nombre Completo</label>
              <input v-model="newTecnico.nombre" type="text" class="form-input" required placeholder="Ej: Carlos Soporte">
            </div>
            <div class="form-group">
              <label class="form-label">Correo Electrónico</label>
              <input v-model="newTecnico.email" type="email" class="form-input" required placeholder="carlos@support.com">
            </div>
            <div class="form-group">
              <label class="form-label">Rol del Usuario</label>
              <select v-model="newTecnico.role" class="form-input form-select" required>
                <option value="technician">Técnico</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="showCreateModal = false" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary">Añadir Miembro</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
