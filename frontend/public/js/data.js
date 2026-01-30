// ========================================
// SERVICORE - Datos y Estado de la Aplicacion
// ========================================


// Configuración API
const API_URL = 'http://localhost:5001/api';

// Función auxiliar para manejar errores
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.msg || 'Error en la petición');
  }
  return response.json();
}

// ========================================
// Datos MOCK (Restaurados para compatibilidad)
// ========================================

// Clientes
const mockClients = [
  { id: "c1", name: "Acme Corporation", email: "contact@acme.com", company: "Acme Corp", phone: "+1 555-0101", ticketCount: 12, createdAt: "2024-01-15" },
  { id: "c2", name: "TechStart Inc", email: "support@techstart.io", company: "TechStart", phone: "+1 555-0102", ticketCount: 8, createdAt: "2024-02-20" },
  { id: "c3", name: "Global Solutions", email: "help@globalsol.com", company: "Global Solutions Ltd", phone: "+1 555-0103", ticketCount: 5, createdAt: "2024-03-10" },
  { id: "c4", name: "DataFlow Systems", email: "admin@dataflow.net", company: "DataFlow", phone: "+1 555-0104", ticketCount: 15, createdAt: "2024-01-05" },
  { id: "c5", name: "CloudNine Services", email: "info@cloudnine.co", company: "CloudNine", phone: "+1 555-0105", ticketCount: 3, createdAt: "2024-04-01" },
];

// Usuarios del equipo
let mockTeamUsers = [
  { id: "1", name: "Admin Usuario", email: "admin@support.com", role: "admin", status: "active", ticketsAssigned: 0, createdAt: "2024-01-01" },
  { id: "2", name: "Juan Tecnico", email: "tech@support.com", role: "technician", status: "active", ticketsAssigned: 4, createdAt: "2024-01-15" },
  { id: "3", name: "Sara Soporte", email: "sara@support.com", role: "technician", status: "active", ticketsAssigned: 6, createdAt: "2024-02-01" },
  { id: "4", name: "Miguel Ayuda", email: "miguel@support.com", role: "technician", status: "inactive", ticketsAssigned: 0, createdAt: "2024-03-01" },
];

// Mensajes de chat
let mockMessages = [
  { id: "m1", ticketId: "t1", senderId: "c1", senderName: "Acme Corporation", senderRole: "client", content: "Estamos viendo este problema en todas nuestras oficinas. Se esta volviendo critico.", timestamp: "2024-06-01T10:30:00" },
  { id: "m2", ticketId: "t1", senderId: "2", senderName: "Juan Tecnico", senderRole: "technician", content: "Entiendo la urgencia. Estoy revisando los logs del servidor. Puede confirmar a que cluster de base de datos se conectan?", timestamp: "2024-06-01T10:45:00" },
  { id: "m3", ticketId: "t1", senderId: "c1", senderName: "Acme Corporation", senderRole: "client", content: "Estamos en el cluster DB-WEST-02. El timeout comenzo alrededor de las 9 AM de hoy.", timestamp: "2024-06-01T11:00:00" },
  { id: "m4", ticketId: "t1", senderId: "2", senderName: "Juan Tecnico", senderRole: "technician", content: "Lo encontre. Hubo un cambio de configuracion de red que afecto ese cluster. Estoy revirtiendo los cambios ahora.", timestamp: "2024-06-01T14:20:00" },
];

// Albaranes (Notas de entrega)
let mockDeliveryNotes = [
  { id: "dn1", ticketId: "t4", ticketTitle: "Fallo de autenticacion tras resetear contrasena", clientId: "c4", clientName: "DataFlow Systems", technicianId: "2", technicianName: "Juan Tecnico", hoursWorked: 3.5, description: "Se corrigio el flujo de autenticacion actualizando la validacion del token de restablecimiento de contrasena. Probado en todos los navegadores principales.", createdAt: "2024-05-25T10:30:00" },
];

// ========================================
// Autenticacion y Estado (MOCK)
// ========================================

// Credenciales de usuarios para login (Simulación)
const userCredentials = [
  { email: "admin@support.com", password: "admin123", id: "1", name: "Admin Usuario", role: "admin" },
  { email: "tech@support.com", password: "tech123", id: "2", name: "Juan Tecnico", role: "technician" },
  { email: "client@company.com", password: "client123", id: "c1-user", name: "Usuario Acme", role: "client", companyId: "c1", companyName: "Acme Corporation" },
  { email: "techstart@client.com", password: "client123", id: "c2-user", name: "Usuario TechStart", role: "client", companyId: "c2", companyName: "TechStart Inc" },
  { email: "global@client.com", password: "client123", id: "c3-user", name: "Usuario Global", role: "client", companyId: "c3", companyName: "Global Solutions" },
];

// Estado de la aplicacion
let appState = {
  currentUser: null,
  currentPage: 'login',
  sidebarOpen: false,
  tickets: [], // Almacenar tickets cargados
};

// Función navigateTo (será sobreescrita por app.js pero necesaria para evitar undefined en data.js)
function navigateTo(page) {
  appState.currentPage = page;
}

// Funciones de Auth
function login(email, password) {
  const user = userCredentials.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    appState.currentUser = { ...user };
    delete appState.currentUser.password;
    localStorage.setItem('currentUser', JSON.stringify(appState.currentUser));
    // Redireccion handled in app.js or here
    return true;
  }
  return false;
}

function logout() {
  appState.currentUser = null;
  localStorage.removeItem('currentUser');
  if (typeof navigateTo === 'function') navigateTo('login');
}

function checkAuth() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    appState.currentUser = JSON.parse(savedUser);
    return true;
  }
  return false;
}

function isAdmin() {
  return appState.currentUser?.role === 'admin';
}

function isTechnician() {
  return appState.currentUser?.role === 'technician';
}

function isClient() {
  return appState.currentUser?.role === 'client';
}

// ========================================
// Funciones CRUD para Tickets (CONECTADO A BD)
// ========================================

async function fetchTickets() {
  try {
    const response = await fetch(`${API_URL}/tickets`);
    const tickets = await handleResponse(response);

    // Adaptar formato de ID de Mongo (_id) al formato que usa el front (id)
    const mappedTickets = tickets.map(t => ({
      ...t,
      id: t._id, // Mapear _id a id
      clientName: t.client || 'Cliente', // Ajuste temporal
      clientId: 'c1', // Hardcodeado temporalmente
      assignedToName: t.technician || 'Sin asignar'
    }));

    appState.tickets = mappedTickets;
    return mappedTickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
}

// Reemplazar legacy getTickets para que use el cache de appState
function getTickets() {
  return appState.tickets || [];
}

async function fetchTicketById(id) {
  const tickets = await fetchTickets();
  return tickets.find(t => t.id === id);
}

async function createTicket(ticketData) {
  try {
    const response = await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: ticketData.title,
        description: ticketData.description,
        client: ticketData.clientName || "Cliente Web",
        priority: ticketData.priority,
        status: ticketData.status || 'abierto',
        technician: ticketData.assignedToName
      })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
}

async function updateTicketAPI(id, updates) {
  try {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updates,
        status: updates.status, // Asegurar que status se envía
        priority: updates.priority
      })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
}

async function deleteTicketAPI(id) {
  try {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return false;
  }
}

// ========================================
// Funciones Legacy (Adaptadores temporales)
// ========================================
// Estas funciones se mantienen para evitar errores mientras migramos app.js
function getTickets() { return []; }
function getTicketById(id) { return null; }
function addTicket(data) { console.warn("Use createTicket instead"); }
function updateTicket(id, data) { console.warn("Use updateTicketAPI instead"); }
function deleteTicket(id) { console.warn("Use deleteTicketAPI instead"); }

// ========================================
// Funciones CRUD para Usuarios del Equipo
// ========================================

function getTeamUsers() {
  return mockTeamUsers;
}

function addTeamUser(userData) {
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    ticketsAssigned: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };
  mockTeamUsers.push(newUser);
  return newUser;
}

function updateTeamUser(id, updates) {
  const index = mockTeamUsers.findIndex(u => u.id === id);
  if (index !== -1) {
    mockTeamUsers[index] = { ...mockTeamUsers[index], ...updates };
    return mockTeamUsers[index];
  }
  return null;
}

function deleteTeamUser(id) {
  const index = mockTeamUsers.findIndex(u => u.id === id);
  if (index !== -1) {
    mockTeamUsers.splice(index, 1);
    return true;
  }
  return false;
}

// ========================================
// Funciones CRUD para Clientes
// ========================================

function getClients() {
  return mockClients;
}

function addClient(clientData) {
  const newClient = {
    id: 'c' + Date.now(),
    ...clientData,
    ticketCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };
  mockClients.push(newClient);
  return newClient;
}

// ========================================
// Funciones para Mensajes
// ========================================

function getMessagesByTicketId(ticketId) {
  return mockMessages.filter(m => m.ticketId === ticketId);
}

function addMessage(messageData) {
  const newMessage = {
    id: 'm' + Date.now(),
    ...messageData,
    timestamp: new Date().toISOString(),
  };
  mockMessages.push(newMessage);
  return newMessage;
}

// ========================================
// Funciones para Albaranes
// ========================================

function getDeliveryNotes() {
  if (isTechnician() && appState.currentUser) {
    return mockDeliveryNotes.filter(n => n.technicianId === appState.currentUser.id);
  }
  return mockDeliveryNotes;
}

function addDeliveryNote(noteData) {
  const newNote = {
    id: 'dn' + Date.now(),
    ...noteData,
    createdAt: new Date().toISOString(),
  };
  mockDeliveryNotes.push(newNote);
  return newNote;
}

// ========================================
// Funciones de Estadisticas
// ========================================

function getStats() {
  const tickets = getTickets();
  return {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'abierto' || t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'en progreso' || t.status === 'in_progress').length,
    closed: tickets.filter(t => t.status === 'cerrado' || t.status === 'closed').length,
    highPriority: tickets.filter(t => (t.priority === 'alta' || t.priority === 'high') && (t.status !== 'cerrado' && t.status !== 'closed')).length,
    clients: mockClients.length,
  };
}

// ========================================
// Funciones de Utilidad
// ========================================

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getStatusLabel(status) {
  const labels = {
    open: 'Abierto',
    in_progress: 'En Progreso',
    closed: 'Cerrado',
    active: 'Activo',
    inactive: 'Inactivo',
  };
  return labels[status] || status;
}

function getPriorityLabel(priority) {
  const labels = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  };
  return labels[priority] || priority;
}

function getRoleLabel(role) {
  const labels = {
    admin: 'Administrador',
    technician: 'Tecnico',
    client: 'Cliente',
  };
  return labels[role] || role;
}
