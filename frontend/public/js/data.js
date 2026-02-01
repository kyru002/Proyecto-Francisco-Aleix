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
let mockClients = [];

// Usuarios del equipo
let mockTeamUsers = [];

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

// Redundancia eliminada - El frontend ahora usa fetchTickets, createTicket, etc.

// ========================================
// Funciones CRUD para Usuarios del Equipo
// ========================================

async function fetchTeamUsers() {
  try {
    const response = await fetch(`${API_URL}/tecnicos`);
    const technicians = await handleResponse(response);

    // Adaptar formato
    const mapped = technicians.map(t => ({
      id: t._id,
      name: t.nombre,
      email: t.email,
      role: t.role || "technician",
      status: t.estado === "activo" ? "active" : "inactive",
      ticketsAssigned: t.totalTickets || 0,
      createdAt: t.fechaIncorporacion || t.createdAt
    }));

    mockTeamUsers = mapped; // Actualizar cache local
    return mapped;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    return mockTeamUsers; // Fallback a mock
  }
}

function getTeamUsers() {
  return mockTeamUsers;
}

async function addTeamUser(userData) {
  try {
    const response = await fetch(`${API_URL}/tecnicos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: userData.name,
        email: userData.email,
        role: userData.role,
        estado: userData.status === "active" ? "activo" : "inactivo"
      })
    });
    const saved = await handleResponse(response);
    await fetchTeamUsers(); // Recargar lista
    return saved;
  } catch (error) {
    console.error("Error adding technician:", error);
    throw error;
  }
}

async function updateTeamUser(id, updates) {
  try {
    const response = await fetch(`${API_URL}/tecnicos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: updates.name,
        email: updates.email,
        role: updates.role,
        estado: updates.status === "active" ? "activo" : "inactivo"
      })
    });
    const updated = await handleResponse(response);
    await fetchTeamUsers();
    return updated;
  } catch (error) {
    console.error("Error updating technician:", error);
    throw error;
  }
}

async function deleteTeamUser(id) {
  try {
    const response = await fetch(`${API_URL}/tecnicos/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      await fetchTeamUsers();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting technician:", error);
    return false;
  }
}

// ========================================
// Funciones CRUD para Clientes
// ========================================

async function fetchClients() {
  try {
    const response = await fetch(`${API_URL}/clientes`);
    const clientes = await handleResponse(response);

    // Adaptar formato
    const mapped = clientes.map(c => ({
      id: c._id,
      name: c.nombreContacto,
      company: c.nombreEmpresa,
      email: c.email,
      phone: c.telefono,
      ticketCount: 0, // Esto se podría calcular en el server
      createdAt: c.createdAt
    }));

    mockClients = mapped;
    return mapped;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return mockClients;
  }
}

function getClients() {
  return mockClients;
}

async function addClient(clientData) {
  try {
    const response = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombreContacto: clientData.name,
        nombreEmpresa: clientData.company,
        email: clientData.email,
        telefono: clientData.phone
      })
    });
    const saved = await handleResponse(response);
    await fetchClients();
    return saved;
  } catch (error) {
    console.error("Error adding client:", error);
    throw error;
  }
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
