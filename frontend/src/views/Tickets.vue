<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../stores/appStore';
import { 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  MessageSquare,
  Clock,
  ExternalLink,
  FileText,
  CheckCircle
} from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();
const showCreateModal = ref(false);
const newTicket = ref({
  title: '',
  description: '',
  cliente: '',
  priority: 'media',
  tecnico: ''
});

onMounted(async () => {
  await store.fetchAll();
});

const editingTicket = ref(null);
const showEditModal = ref(false);
const searchQuery = ref('');
const filterStatus = ref('');
const filterPriority = ref('');

// Computed property para filtrar tickets
const filteredTickets = computed(() => {
  let tickets = store.tickets;

  // Filtro por búsqueda de texto
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    tickets = tickets.filter(ticket => {
      const title = ticket.title?.toLowerCase() || '';
      const id = ticket._id?.toLowerCase() || '';
      const clientName = ticket.cliente?.nombreEmpresa?.toLowerCase() || '';
      const clientContact = ticket.cliente?.nombreContacto?.toLowerCase() || '';
      
      return title.includes(query) || 
             id.includes(query) || 
             clientName.includes(query) ||
             clientContact.includes(query);
    });
  }

  // Filtro por estado
  if (filterStatus.value) {
    tickets = tickets.filter(ticket => ticket.status === filterStatus.value);
  }

  // Filtro por prioridad
  if (filterPriority.value) {
    tickets = tickets.filter(ticket => ticket.priority === filterPriority.value);
  }

  return tickets;
});

const handleCreateTicket = async () => {
  try {
    const createdTicket = await store.createTicket(newTicket.value);
    showCreateModal.value = false;
    newTicket.value = { title: '', description: '', cliente: '', priority: 'media', tecnico: '' };
    // Refrescar datos para que se actualicen todas las vistas
    await store.fetchAll();
  } catch (error) {
    console.error('Error al crear ticket:', error);
    alert('Error al crear el ticket');
  }
};

const handleEditTicket = (ticket) => {
  editingTicket.value = { ...ticket };
  showEditModal.value = true;
};

const handleSaveEdit = async () => {
  try {
    await store.updateTicket(editingTicket.value._id, editingTicket.value);
    showEditModal.value = false;
    editingTicket.value = null;
  } catch (error) {
    alert('Error al actualizar el ticket');
  }
};

const handleDeleteTicket = async (ticketId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este ticket?')) {
    try {
      await store.deleteTicket(ticketId);
    } catch (error) {
      alert('Error al eliminar el ticket');
    }
  }
};

const handleViewTicket = (ticket) => {
  router.push(`/tickets/${ticket._id}`);
};

const handleMarkAsCompleted = async (ticket) => {
  if (confirm(`¿Marcar el ticket "${ticket.title}" como completado?`)) {
    try {
      await store.updateTicket(ticket._id, {
        ...ticket,
        status: 'cerrado',
        endDate: new Date()
      });
      alert('Ticket marcado como completado');
      // Refrescar datos para que se actualicen todas las vistas
      await store.fetchAll();
    } catch (error) {
      console.error('Error al marcar como completado:', error);
      alert(`Error al marcar como completado: ${error.response?.data?.message || error.message || 'Error desconocido'}`);
    }
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
      <button v-if="store.currentUser?.role !== 'cliente'" @click="showCreateModal = true" class="btn btn-primary">
        <Plus />
        Nuevo Ticket
      </button>
    </div>

    <!-- Barra de Filtros -->
    <div class="card" style="margin-bottom: 1.5rem; padding: 1rem;">
      <div class="filters-bar">
        <div class="input-with-icon" style="flex: 1;">
          <Search />
          <input v-model="searchQuery" type="text" class="form-input" placeholder="Buscar por título, ID o cliente...">
        </div>
        <select v-model="filterStatus" class="form-input form-select">
          <option value="">Todos los estados</option>
          <option value="abierto">Abierto</option>
          <option value="en progreso">En Progreso</option>
          <option value="cerrado">Cerrado</option>
        </select>
        <select v-model="filterPriority" class="form-input form-select">
          <option value="">Cualquier prioridad</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>
    </div>

    <!-- Lista de Tickets -->
    <div v-if="filteredTickets.length === 0" class="empty-state">
      <FileText style="width: 48px; height: 48px; opacity: 0.2; margin-bottom: 1rem;" />
      <p v-if="store.tickets.length === 0">No hay tickets creados aún.</p>
      <p v-else>No se encontraron tickets con los filtros actuales.</p>
    </div>

    <!-- Lista de Tickets -->
    <div v-if="filteredTickets.length === 0" class="empty-state">
      <FileText style="width: 48px; height: 48px; opacity: 0.2; margin-bottom: 1rem;" />
      <p v-if="store.tickets.length === 0">No hay tickets creados aún.</p>
      <p v-else>No se encontraron tickets con los filtros actuales.</p>
    </div>

    <div v-else class="card" style="padding: 1rem;">
      <!-- Indicador de resultados filtrados -->
      <div v-if="store.tickets.length > filteredTickets.length" style="padding: 0.75rem 1rem; background-color: var(--muted); border-radius: var(--radius); margin-bottom: 1rem; font-size: 0.875rem; color: var(--muted-foreground);">
        Mostrando {{ filteredTickets.length }} de {{ store.tickets.length }} tickets
      </div>
      
      <div v-for="ticket in filteredTickets" :key="ticket._id" class="ticket-list-item" :class="{ 'ticket-completed': ticket.status === 'cerrado' }">
        <div class="ticket-info">
          <div class="ticket-title">
            {{ ticket.title }}
            <span v-if="ticket.status === 'cerrado'" style="color: var(--success); font-size: 0.75rem; margin-left: 0.5rem;">
              ✓ Completado
            </span>
          </div>
          <div class="ticket-meta">
            <span>#{{ ticket._id ? ticket._id.slice(-6).toUpperCase() : 'N/A' }}</span> • 
            <span>{{ ticket.cliente?.nombreEmpresa || 'Sin cliente' }}</span> • 
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              <Clock style="width: 12px; height: 12px;" />
              {{ ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A' }}
            </span>
            <span v-if="ticket.endDate" style="margin-left: 0.5rem; color: var(--success);">
              • Finalizado: {{ new Date(ticket.endDate).toLocaleDateString() }}
            </span>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 1.5rem;">
          <div style="display: flex; gap: 0.5rem;">
            <span class="badge" :class="'badge-' + (ticket.status === 'en progreso' ? 'in-progress' : ticket.status)">
              <CheckCircle v-if="ticket.status === 'cerrado'" style="width: 12px; height: 12px; margin-right: 0.25rem;" />
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
            <button 
              v-if="ticket.status !== 'cerrado'" 
              @click="handleMarkAsCompleted(ticket)" 
              class="btn btn-success btn-icon" 
              title="Marcar como completado"
            >
              <CheckCircle style="width: 14px; height: 14px;" />
            </button>
            <button @click="handleEditTicket(ticket)" class="btn btn-secondary btn-icon" title="Editar">
              <MessageSquare style="width: 14px; height: 14px;" />
            </button>
            <button @click="handleViewTicket(ticket)" class="btn btn-ghost btn-icon" title="Ver detalles">
              <ExternalLink />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Edición -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal" style="max-width: 600px;">
        <div class="modal-header">
          <h2 class="modal-title">Editar Ticket</h2>
        </div>
        <form @submit.prevent="handleSaveEdit" v-if="editingTicket">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Título del Problema</label>
              <input v-model="editingTicket.title" type="text" class="form-input" required placeholder="Ej: No puedo acceder al correo">
            </div>
            <div class="form-group">
              <label class="form-label">Cliente / Empresa</label>
              <select v-model="editingTicket.cliente" class="form-input form-select" required>
                <option value="" disabled>Seleccionar cliente</option>
                <option v-for="c in store.clientes" :key="c._id" :value="c._id">{{ c.nombreEmpresa || c.company }} ({{ c.nombreContacto || c.name }})</option>
              </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Prioridad</label>
                <select v-model="editingTicket.priority" class="form-input form-select">
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Estado</label>
                <select v-model="editingTicket.status" class="form-input form-select">
                  <option value="abierto">Abierto</option>
                  <option value="en progreso">En Progreso</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Asignar a Técnico</label>
              <select v-model="editingTicket.tecnico" class="form-input form-select">
                <option value="">Sin asignar</option>
                <option v-for="t in store.tecnicos" :key="t._id" :value="t._id">{{ t.nombre || t.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Descripción Detallada</label>
              <textarea v-model="editingTicket.description" class="form-input form-textarea" required placeholder="Describe el problema con el mayor detalle posible..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="showEditModal = false" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
          </div>
        </form>
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
              <select v-model="newTicket.cliente" class="form-input form-select" required>
                <option value="" disabled>Seleccionar cliente</option>
                <option v-for="c in store.clientes" :key="c._id" :value="c._id">{{ c.nombreEmpresa }} ({{ c.nombreContacto }})</option>
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
                <select v-model="newTicket.tecnico" class="form-input form-select">
                  <option value="">Sin asignar</option>
                <option v-for="t in store.tecnicos" :key="t._id" :value="t._id">{{ t.nombre }}</option>
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
