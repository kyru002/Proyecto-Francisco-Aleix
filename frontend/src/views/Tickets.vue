<script setup>
import { onMounted, ref, computed } from 'vue';
import { useAppStore } from '../stores/appStore';
import { 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  MessageSquare,
  Clock,
  ExternalLink
} from 'lucide-vue-next';

const store = useAppStore();
const showCreateModal = ref(false);
const newTicket = ref({
  title: '',
  description: '',
  client: '',
  priority: 'media',
  technician: ''
});

onMounted(async () => {
  await store.fetchAll();
});

const handleCreateTicket = async () => {
  try {
    await store.createTicket(newTicket.value);
    showCreateModal.value = false;
    newTicket.value = { title: '', description: '', client: '', priority: 'media', technician: '' };
  } catch (error) {
    alert('Error al crear el ticket');
  }
};
</script>

<template>
  <div class="page-content">
    <div class="page-header">
      <div>
        <h1 class="page-title">Tickets de Soporte</h1>
        <p class="page-subtitle">Gestiona y responde a las solicitudes de ayuda</p>
      </div>
      <button @click="showCreateModal = true" class="btn btn-primary">
        <Plus />
        Nuevo Ticket
      </button>
    </div>

    <!-- Barra de Filtros -->
    <div class="card" style="margin-bottom: 1.5rem; padding: 1rem;">
      <div class="filters-bar">
        <div class="input-with-icon" style="flex: 1;">
          <Search />
          <input type="text" class="form-input" placeholder="Buscar por título, ID o cliente...">
        </div>
        <select class="form-input form-select">
          <option value="">Todos los estados</option>
          <option value="abierto">Abierto</option>
          <option value="en progreso">En Progreso</option>
          <option value="cerrado">Cerrado</option>
        </select>
        <select class="form-input form-select">
          <option value="">Cualquier prioridad</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>
    </div>

    <!-- Lista de Tickets -->
    <div v-if="store.tickets.length === 0" class="empty-state">
      <Ticket style="width: 48px; height: 48px; opacity: 0.2; margin-bottom: 1rem;" />
      <p>No se encontraron tickets con los filtros actuales.</p>
    </div>

    <div v-else class="card" style="padding: 1rem;">
      <div v-for="ticket in store.tickets" :key="ticket.id" class="ticket-list-item">
        <div class="ticket-info">
          <div class="ticket-title">{{ ticket.title }}</div>
          <div class="ticket-meta">
            <span>#{{ ticket.id.slice(-6).toUpperCase() }}</span> • 
            <span>{{ ticket.client }}</span> • 
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              <Clock style="width: 12px; height: 12px;" />
              {{ new Date(ticket.createdAt).toLocaleDateString() }}
            </span>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 1.5rem;">
          <div style="display: flex; gap: 0.5rem;">
            <span class="badge" :class="'badge-' + (ticket.status === 'en progreso' ? 'in-progress' : ticket.status)">
              {{ ticket.status }}
            </span>
            <span class="badge" :class="'badge-' + (ticket.priority === 'media' ? 'medium' : (ticket.priority === 'baja' ? 'low' : 'high'))">
              {{ ticket.priority }}
            </span>
          </div>
          
          <div style="display: flex; align-items: center; gap: 0.75rem; color: var(--muted-foreground); font-size: 0.875rem;">
            <div style="display: flex; align-items: center; gap: 0.25rem;">
              <MessageSquare style="width: 14px; height: 14px;" />
              {{ ticket.messages?.length || 0 }}
            </div>
            <button class="btn btn-ghost btn-icon">
              <ExternalLink />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Creación -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal" style="max-width: 600px;">
        <div class="modal-header">
          <h2 class="modal-title">Crear Nuevo Ticket</h2>
        </div>
        <form @submit.prevent="handleCreateTicket">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Título del Problema</label>
              <input v-model="newTicket.title" type="text" class="form-input" required placeholder="Ej: No puedo acceder al correo">
            </div>
            <div class="form-group">
              <label class="form-label">Cliente / Empresa</label>
              <select v-model="newTicket.client" class="form-input form-select" required>
                <option value="" disabled>Seleccionar cliente</option>
                <option v-for="c in store.clientes" :key="c.id" :value="c.company">{{ c.company }} ({{ c.name }})</option>
              </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Prioridad</label>
                <select v-model="newTicket.priority" class="form-input form-select">
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Asignar a Técnico</label>
                <select v-model="newTicket.technician" class="form-input form-select">
                  <option value="">Sin asignar</option>
                  <option v-for="t in store.tecnicos" :key="t.id" :value="t.name">{{ t.name }}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Descripción Detallada</label>
              <textarea v-model="newTicket.description" class="form-input form-textarea" required placeholder="Describe el problema con el mayor detalle posible..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="showCreateModal = false" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary">Crear Ticket</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
