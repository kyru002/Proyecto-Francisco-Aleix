import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const ticketsService = {
    getAll: () => api.get('/tickets').then(res => res.data),
    getById: (id) => api.get(`/tickets/${id}`).then(res => res.data),
    create: (data) => api.post('/tickets', data).then(res => res.data),
    update: (id, data) => api.put(`/tickets/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`/tickets/${id}`).then(res => res.data),
    getMessages: (id) => api.get(`/tickets/${id}/messages`).then(res => res.data),
    sendMessage: (id, messageData) => api.post(`/tickets/${id}/messages`, messageData).then(res => res.data),
};

export const tecnicosService = {
    getAll: () => api.get('/tecnicos').then(res => res.data),
    create: (data) => api.post('/tecnicos', data).then(res => res.data),
    update: (id, data) => api.put(`/tecnicos/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`/tecnicos/${id}`).then(res => res.data),
};

export const clientesService = {
    getAll: () => api.get('/clientes').then(res => res.data),
    create: (data) => api.post('/clientes', data).then(res => res.data),
    update: (id, data) => api.put(`/clientes/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`/clientes/${id}`).then(res => res.data),
};

export const albaranesService = {
    getAll: () => api.get('/albaranes').then(res => res.data),
    getById: (id) => api.get(`/albaranes/${id}`).then(res => res.data),
    getByCliente: (clienteId) => api.get(`/albaranes/cliente/${clienteId}`).then(res => res.data),
    getByEstado: (estado) => api.get(`/albaranes/estado/${estado}`).then(res => res.data),
    create: (data) => api.post('/albaranes', data).then(res => res.data),
    update: (id, data) => api.put(`/albaranes/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`/albaranes/${id}`).then(res => res.data),
    cambiarEstado: (id, estado) => api.patch(`/albaranes/${id}/estado`, { estado }).then(res => res.data),
    entregar: (id, firmante) => api.patch(`/albaranes/${id}/entregar`, { firmante }).then(res => res.data),
    obtenerProximoNumero: () => api.get('/albaranes/numero/siguiente').then(res => res.data),
};

export const callLogsService = {
    getAll: () => api.get('/callLogs').then(res => res.data),
    getById: (id) => api.get(`/callLogs/${id}`).then(res => res.data),
    getByTicket: (ticketId) => api.get(`/callLogs/ticket/${ticketId}`).then(res => res.data),
    create: (data) => api.post('/callLogs', data).then(res => res.data),
    update: (id, data) => api.patch(`/callLogs/${id}`, data).then(res => res.data),
};

export default api;
