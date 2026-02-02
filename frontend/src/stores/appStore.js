import { defineStore } from 'pinia';
import { ticketsService, tecnicosService, clientesService, albaranesService, trabajadoresService } from '../services/api';

export const useAppStore = defineStore('app', {
    state: () => ({
        tickets: [],
        tecnicos: [],
        clientes: [],
        albaranes: [],
        trabajadores: [],
        loading: false,
        currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    }),
    actions: {
        async fetchAll() {
            this.loading = true;
            try {
                // Si es cliente, filtrar tickets y albaranes por su ID
                let ticketsPromise;
                let albaranesPromise;
                let tecnicosPromise;
                let clientesPromise;
                
                if (this.currentUser?.role === 'cliente' && this.currentUser?.clienteId) {
                    ticketsPromise = ticketsService.getAll({ clienteId: this.currentUser.clienteId });
                    albaranesPromise = albaranesService.getAll({ cliente: this.currentUser.clienteId });
                    // Los clientes no necesitan ver la lista de técnicos ni otros clientes
                    tecnicosPromise = Promise.resolve([]);
                    clientesPromise = Promise.resolve([]);
                } else {
                    ticketsPromise = ticketsService.getAll();
                    albaranesPromise = albaranesService.getAll();
                    tecnicosPromise = tecnicosService.getAll();
                    clientesPromise = clientesService.getAll();
                }
                
                // Ejecutar en paralelo pero capturar errores individualmente para no bloquear todo
                const results = await Promise.allSettled([
                    ticketsPromise,
                    tecnicosPromise,
                    clientesPromise,
                    albaranesPromise,
                ]);

                if (results[0].status === 'fulfilled') this.tickets = results[0].value;
                else console.error('Error fetching tickets:', results[0].reason);

                if (results[1].status === 'fulfilled') this.tecnicos = results[1].value;
                else console.error('Error fetching tecnicos:', results[1].reason);

                if (results[2].status === 'fulfilled') this.clientes = results[2].value;
                else console.error('Error fetching clientes:', results[2].reason);

                if (results[3].status === 'fulfilled') this.albaranes = results[3].value;
                else console.error('Error fetching albaranes:', results[3].reason);

            } catch (error) {
                console.error('Unexpected error in fetchAll:', error);
            } finally {
                this.loading = false;
            }
        },
        async createTicket(data) {
            const newTicket = await ticketsService.create(data);
            this.tickets.unshift(newTicket);
            return newTicket;
        },
        async createTecnico(data) {
            const newTecnico = await tecnicosService.create(data);
            this.tecnicos.unshift(newTecnico);
            return newTecnico;
        },
        async createCliente(data) {
            const newCliente = await clientesService.create(data);
            this.clientes.unshift(newCliente);
            return newCliente;
        },
        async updateCliente(id, data) {
            const updatedCliente = await clientesService.update(id, data);
            const index = this.clientes.findIndex(c => c._id === id);
            if (index !== -1) {
                this.clientes[index] = updatedCliente;
            }
            return updatedCliente;
        },
        async deleteCliente(id) {
            await clientesService.delete(id);
            this.clientes = this.clientes.filter(c => c._id !== id);
        },
        async createTrabajador(data) {
            const nuevoTrabajador = await trabajadoresService.create(data);
            this.trabajadores.unshift(nuevoTrabajador);
            return nuevoTrabajador;
        },
        async updateTrabajador(id, data) {
            const updatedTrabajador = await trabajadoresService.update(id, data);
            const index = this.trabajadores.findIndex(t => t._id === id);
            if (index !== -1) {
                this.trabajadores[index] = updatedTrabajador;
            }
            return updatedTrabajador;
        },
        async deleteTrabajador(id) {
            await trabajadoresService.delete(id);
            this.trabajadores = this.trabajadores.filter(t => t._id !== id);
        },
        async cambiarPasswordTrabajador(id, data) {
            return await trabajadoresService.cambiarPassword(id, data);
        },
        async updateTecnico(id, data) {
            const updatedTecnico = await tecnicosService.update(id, data);
            const index = this.tecnicos.findIndex(t => t._id === id);
            if (index !== -1) {
                this.tecnicos[index] = updatedTecnico;
            }
            return updatedTecnico;
        },
        async deleteTecnico(id) {
            await tecnicosService.delete(id);
            this.tecnicos = this.tecnicos.filter(t => t._id !== id);
        },
        async updateTicket(id, data) {
            const updatedTicket = await ticketsService.update(id, data);
            const index = this.tickets.findIndex(t => t._id === id);
            if (index !== -1) {
                this.tickets[index] = updatedTicket;
            }
            return updatedTicket;
        },
        async deleteTicket(id) {
            await ticketsService.delete(id);
            this.tickets = this.tickets.filter(t => t._id !== id);
        },
        async getTicketMessages(id) {
            return await ticketsService.getMessages(id);
        },
        async sendTicketMessage(id, messageData) {
            const updatedTicket = await ticketsService.sendMessage(id, messageData);
            const index = this.tickets.findIndex(t => t._id === id);
            if (index !== -1) {
                this.tickets[index] = updatedTicket;
            }
            return updatedTicket;
        },
        async createAlbarani(data) {
            const nuevoAlbarani = await albaranesService.create(data);
            this.albaranes.unshift(nuevoAlbarani);
            return nuevoAlbarani;
        },
        async updateAlbarani(id, data) {
            const updatedAlbarani = await albaranesService.update(id, data);
            const index = this.albaranes.findIndex(a => a._id === id);
            if (index !== -1) {
                this.albaranes[index] = updatedAlbarani;
            }
            return updatedAlbarani;
        },
        async deleteAlbarani(id) {
            await albaranesService.delete(id);
            this.albaranes = this.albaranes.filter(a => a._id !== id);
        },
        async cambiarEstadoAlbarani(id, estado) {
            const updatedAlbarani = await albaranesService.cambiarEstado(id, estado);
            const index = this.albaranes.findIndex(a => a._id === id);
            if (index !== -1) {
                this.albaranes[index] = updatedAlbarani;
            }
            return updatedAlbarani;
        },
        async entregarAlbarani(id, firmante) {
            const updatedAlbarani = await albaranesService.entregar(id, firmante);
            const index = this.albaranes.findIndex(a => a._id === id);
            if (index !== -1) {
                this.albaranes[index] = updatedAlbarani;
            }
            return updatedAlbarani;
        },
        logout() {
            this.currentUser = null;
            localStorage.removeItem('currentUser');
        },
        login(user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
    },
});
