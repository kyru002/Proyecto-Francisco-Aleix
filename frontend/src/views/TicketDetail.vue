<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '../stores/appStore';
import {
  ArrowLeft,
  MessageCircle,
  Send,
  AlertCircle,
  Clock,
  User,
  Shield,
  CheckCircle,
  FileText
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const store = useAppStore();

const ticket = ref(null);
const messages = ref([]);
const newMessage = ref('');
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    loading.value = true;
    const ticketId = route.params.id;
    
    // Obtener detalles del ticket
    const ticketData = await store.ticketsService?.getById?.(ticketId);
    if (!ticketData) {
      // Si la API no está implementada, obtener del store
      const foundTicket = store.tickets.find(t => t._id === ticketId);
      if (foundTicket) {
        ticket.value = foundTicket;
        messages.value = foundTicket.messages || [];
      } else {
        error.value = 'Ticket no encontrado';
      }
    } else {
      ticket.value = ticketData;
      
      // Obtener mensajes
      try {
        messages.value = await store.getTicketMessages(ticketId);
      } catch (err) {
        messages.value = ticketData.messages || [];
      }
    }
  } catch (err) {
    error.value = 'Error al cargar el ticket: ' + err.message;
  } finally {
    loading.value = false;
  }
});

const handleSendMessage = async () => {
  if (!newMessage.value.trim()) {
    alert('Por favor, escribe un mensaje');
    return;
  }

  try {
    const messageData = {
      author: store.currentUser?.name || 'Usuario Anónimo',
      role: store.currentUser?.role || 'admin',
      content: newMessage.value
    };

    const updatedTicket = await store.sendTicketMessage(route.params.id, messageData);
    messages.value = updatedTicket.messages || [];
    newMessage.value = '';
    
    // Scroll al último mensaje
    setTimeout(() => {
      const messagesContainer = document.querySelector('[style*="overflow-y"]');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 0);
  } catch (err) {
    alert('Error al enviar mensaje: ' + err.message);
  }
};

const handleChangeStatus = async (newStatus) => {
  try {
    await store.updateTicket(route.params.id, {
      ...ticket.value,
      status: newStatus
    });
    ticket.value.status = newStatus;
    alert('Estado actualizado correctamente');
  } catch (err) {
    alert('Error al cambiar el estado: ' + err.message);
  }
};

const handleReopenTicket = async () => {
  if (!confirm('¿Deseas reabrir este ticket?')) {
    return;
  }

  try {
    await store.updateTicket(route.params.id, {
      ...ticket.value,
      status: 'abierto',
      endDate: null
    });
    ticket.value.status = 'abierto';
    ticket.value.endDate = null;
    alert('Ticket reabierto correctamente');
  } catch (err) {
    alert('Error al reabrir ticket: ' + err.message);
  }
};

const handleCloseTicketAndCreateAlbaran = async () => {
  if (!confirm('¿Deseas cerrar este ticket y crear un albarán con la información?')) {
    return;
  }

  try {
    // Primero cerrar el ticket
    await store.updateTicket(route.params.id, {
      ...ticket.value,
      status: 'cerrado',
      endDate: new Date()
    });

    // Guardar los datos del ticket en sessionStorage para pre-llenar el albarán
    const albaranData = {
      cliente: ticket.value.cliente || '',
      tecnico: ticket.value.tecnico || '',
      ticket: route.params.id,
      descripcion: `Servicio relacionado con: ${ticket.value.title}`,
      numeroAlbaran: 'AUTO_GENERATE',
      lineas: []
    };

    sessionStorage.setItem('ticketAlbaranData', JSON.stringify(albaranData));
    
    // Navegar a Albaranes
    router.push('/albaranes');
  } catch (err) {
    alert('Error al cerrar ticket: ' + err.message);
  }
};

const getStatusColor = (status) => {
  switch(status) {
    case 'abierto': return 'badge-abierto';
    case 'en progreso': return 'badge-in-progress';
    case 'cerrado': return 'badge-cerrado';
    default: return 'badge-default';
  }
};

const getPriorityColor = (priority) => {
  switch(priority) {
    case 'alta': return 'badge-high';
    case 'media': return 'badge-medium';
    case 'baja': return 'badge-low';
    default: return 'badge-default';
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleString('es-ES');
};
</script>

<template>
  <div class="page-content">
    <!-- Header -->
    <div class="page-header">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <button @click="router.back()" class="btn btn-ghost btn-icon">
          <ArrowLeft />
        </button>
        <div v-if="ticket">
          <h1 class="page-title">{{ ticket.title }}</h1>
          <p class="page-subtitle">#{{ ticket._id?.slice(-6).toUpperCase() }} - {{ ticket.client }}</p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card">
      <p style="text-align: center; padding: 2rem;">Cargando ticket...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="card" style="background-color: #fee; border-color: #fcc;">
      <div style="display: flex; gap: 1rem; align-items: flex-start;">
        <AlertCircle style="color: #c33; flex-shrink: 0;" />
        <div>
          <h3 style="color: #c33; margin: 0 0 0.5rem 0;">Error</h3>
          <p style="margin: 0; color: #666;">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Ticket Details -->
    <div v-else-if="ticket" class="container-layout">
      <!-- Panel Izquierdo - Detalles -->
      <div class="card" style="flex: 1; min-width: 0;">
        <div class="card-header">
          <h2 class="card-title">Detalles del Ticket</h2>
        </div>
        <div class="card-content">
          <!-- Estado y Prioridad -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div>
              <div style="font-size: 0.875rem; color: var(--muted-foreground); margin-bottom: 0.5rem;">Estado</div>
              <div v-if="ticket.status !== 'cerrado'" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span :class="['badge', getStatusColor(ticket.status)]">{{ ticket.status }}</span>
                <select 
                  :value="ticket.status" 
                  @change="(e) => {
                    if (e.target.value === 'cerrado') {
                      handleCloseTicketAndCreateAlbaran();
                    } else {
                      handleChangeStatus(e.target.value);
                    }
                  }"
                  style="padding: 0.4rem 0.6rem; border: 1px solid var(--border); border-radius: 4px; font-size: 0.875rem;"
                >
                  <option value="abierto">Abierto</option>
                  <option value="en progreso">En Progreso</option>
                  <option value="cerrado">Cerrar y crear albarán</option>
                </select>
              </div>
              <div v-else style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                <span :class="['badge', getStatusColor(ticket.status)]">{{ ticket.status }}</span>
                <button @click="handleReopenTicket" class="btn btn-secondary" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; font-size: 0.875rem;">
                  <CheckCircle style="width: 16px; height: 16px;" />
                  Reabrir Ticket
                </button>
                <button @click="handleCloseTicketAndCreateAlbaran" class="btn btn-primary" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; font-size: 0.875rem;">
                  <FileText style="width: 16px; height: 16px;" />
                  Crear Albarán
                </button>
              </div>
            </div>
            <div>
              <div style="font-size: 0.875rem; color: var(--muted-foreground); margin-bottom: 0.5rem;">Prioridad</div>
              <span :class="['badge', getPriorityColor(ticket.priority)]">{{ ticket.priority }}</span>
            </div>
          </div>

          <!-- Información del Ticket -->
          <div style="border-top: 1px solid var(--border); padding-top: 1rem; margin-top: 1rem;">
            <div style="display: grid; gap: 1rem;">
              <div>
                <div style="font-size: 0.875rem; color: var(--muted-foreground); margin-bottom: 0.25rem;">Cliente</div>
                <p style="margin: 0; font-weight: 500;">{{ ticket.cliente?.nombreEmpresa || 'Sin asignar' }}</p>
              </div>

              <div>
                <div style="font-size: 0.875rem; color: var(--muted-foreground); margin-bottom: 0.25rem;">Técnico Asignado</div>
                <p style="margin: 0; font-weight: 500;">{{ ticket.tecnico?.nombre || 'Sin asignar' }}</p>
              </div>

              <div>
                <div style="font-size: 0.875rem; color: var(--muted-foreground); margin-bottom: 0.25rem;">Descripción</div>
                <p style="margin: 0; line-height: 1.5;">{{ ticket.description }}</p>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <div style="font-size: 0.875rem; color: var(--muted-foreground); margin-bottom: 0.25rem;">Fecha de Apertura</div>
                  <p style="margin: 0; font-size: 0.875rem;">{{ formatDate(ticket.startDate) }}</p>
                </div>
                <div v-if="ticket.endDate">
                  <div style="font-size: 0.875rem; color: var(--muted-foreground); margin-bottom: 0.25rem;">Fecha de Cierre</div>
                  <p style="margin: 0; font-size: 0.875rem;">{{ formatDate(ticket.endDate) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel Derecho - Mensajes -->
      <div class="card" style="flex: 1.2; min-width: 0; display: flex; flex-direction: column;">
        <div class="card-header">
          <h2 class="card-title">
            <MessageCircle style="width: 20px; height: 20px; display: inline; margin-right: 0.5rem;" />
            Conversación
          </h2>
        </div>

        <!-- Área de Mensajes -->
        <div class="card-content" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; max-height: 400px;">
          <div v-if="messages.length === 0" style="text-align: center; color: var(--muted-foreground); padding: 2rem 1rem;">
            <MessageCircle style="width: 40px; height: 40px; opacity: 0.2; margin-bottom: 1rem;" />
            <p>No hay mensajes aún. Sé el primero en escribir.</p>
          </div>

          <div v-for="(msg, index) in messages" :key="index" class="message-item">
            <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
              <div style="
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: var(--primary);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 0.875rem;
                flex-shrink: 0;
              ">
                {{ msg.author.charAt(0).toUpperCase() }}
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                  <strong style="font-size: 0.875rem;">{{ msg.author }}</strong>
                  <span style="
                    font-size: 0.75rem;
                    padding: 0.2rem 0.5rem;
                    background-color: var(--muted);
                    border-radius: 3px;
                    text-transform: capitalize;
                  ">{{ msg.role }}</span>
                  <span style="font-size: 0.75rem; color: var(--muted-foreground);">{{ formatDate(msg.createdAt) }}</span>
                </div>
                <p style="margin: 0; line-height: 1.4; word-break: break-word;">{{ msg.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Input de Mensaje -->
        <div class="card-footer" style="border-top: 1px solid var(--border); padding-top: 1rem; margin-top: auto;">
          <form @submit.prevent="handleSendMessage" style="display: flex; gap: 0.75rem;">
            <input
              v-model="newMessage"
              type="text"
              class="form-input"
              placeholder="Escribe tu mensaje..."
              style="flex: 1;"
            />
            <button type="submit" class="btn btn-primary" style="display: flex; align-items: center; gap: 0.5rem;">
              <Send style="width: 18px; height: 18px;" />
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.message-item {
  padding: 0.75rem;
  background-color: var(--background);
  border-radius: 6px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .container-layout {
    grid-template-columns: 1fr;
  }
}
</style>
