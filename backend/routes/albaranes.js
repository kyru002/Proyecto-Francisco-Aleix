const express = require("express");
const router = express.Router();
const Albaran = require("../models/Albaran");
const Cliente = require("../models/Cliente");
const Trabajador = require("../models/Trabajador");

// Obtener próximo número de albarán (DEBE estar antes de /:id)
router.get("/numero/siguiente", async (req, res) => {
    try {
        const ultimoAlbaran = await Albaran.findOne().sort({ createdAt: -1 });

        let proximoNumero = "ALB-2026-001";
        if (ultimoAlbaran && ultimoAlbaran.numeroAlbaran) {
            const partes = ultimoAlbaran.numeroAlbaran.split('-');
            const numero = parseInt(partes[partes.length - 1]) + 1;
            proximoNumero = `ALB-${new Date().getFullYear()}-${String(numero).padStart(3, '0')}`;
        }

        res.json({ proximoNumero });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener próximo número", error: error.message });
    }
});

// Obtener albaranes por estado (DEBE estar antes de /:id)
router.get("/estado/:estado", async (req, res) => {
    try {
        const albaranes = await Albaran.find({ estado: req.params.estado })
            .populate('cliente')
            .populate('tecnico')
            .populate('ticket')
            .sort({ fechaAlbaran: -1 });
        res.json(albaranes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener albaranes por estado", error: error.message });
    }
});

// Obtener albaranes por cliente (DEBE estar antes de /:id)
router.get("/cliente/:clienteId", async (req, res) => {
    try {
        const albaranes = await Albaran.find({ cliente: req.params.clienteId })
            .populate('cliente')
            .populate('tecnico')
            .populate('ticket')
            .sort({ fechaAlbaran: -1 });
        res.json(albaranes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener albaranes del cliente", error: error.message });
    }
});

// Obtener todos los albaranes
router.get("/", async (req, res) => {
    try {
        const { cliente } = req.query;
        const filter = {};
        if (cliente) filter.cliente = cliente;

        const albaranes = await Albaran.find(filter)
            .populate('cliente')
            .populate('tecnico')
            .populate('ticket')
            .sort({ fechaAlbaran: -1 });
        res.json(albaranes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener albaranes", error: error.message });
    }
});

// Obtener un albarán por ID (DEBE estar después de las rutas específicas)
router.get("/:id", async (req, res) => {
    try {
        const albaran = await Albaran.findById(req.params.id)
            .populate('cliente')
            .populate('tecnico')
            .populate('ticket');

        if (!albaran) {
            return res.status(404).json({ message: "Albarán no encontrado" });
        }

        res.json(albaran);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el albarán", error: error.message });
    }
});

// Crear nuevo albarán
router.post("/", async (req, res) => {
    try {
        console.log('POST /albaranes - Datos recibidos:', JSON.stringify(req.body, null, 2));

        const { numeroAlbaran, cliente, tecnico, ticket, descripcion, lineas, porcentajeIVA, notas, observaciones } = req.body;

        // Validar campos requeridos
        if (!numeroAlbaran || numeroAlbaran.trim() === '') {
            console.error('Error: numeroAlbaran no proporcionado o vacío');
            return res.status(400).json({ message: "El número de albarán es requerido" });
        }

        if (!cliente) {
            console.error('Error: cliente no proporcionado');
            return res.status(400).json({ message: "El cliente es requerido" });
        }

        if (!lineas || !Array.isArray(lineas) || lineas.length === 0) {
            console.error('Error: lineas no proporcionadas o vacías. Tipo:', typeof lineas, 'Es array:', Array.isArray(lineas), 'Cantidad:', lineas?.length);
            return res.status(400).json({ message: "Debes agregar al menos una línea" });
        }

        // Validar estructura de líneas
        console.log('Validando líneas...');
        for (let i = 0; i < lineas.length; i++) {
            const linea = lineas[i];
            console.log(`Línea ${i}:`, linea);

            if (!linea.concepto || linea.concepto.toString().trim() === '') {
                console.error(`Error en línea ${i}: concepto no válido`);
                return res.status(400).json({ message: `Línea ${i + 1}: el concepto es requerido` });
            }

            if (typeof linea.cantidad !== 'number' || linea.cantidad <= 0) {
                console.error(`Error en línea ${i}: cantidad no válida. Valor:`, linea.cantidad, 'Tipo:', typeof linea.cantidad);
                return res.status(400).json({ message: `Línea ${i + 1}: la cantidad (horas) debe ser un número mayor a 0` });
            }
        }
        console.log('Todas las líneas son válidas');

        // Validar que exista el cliente
        console.log('Buscando cliente con ID:', cliente);
        const clienteExistente = await Cliente.findById(cliente);
        if (!clienteExistente) {
            console.error('Cliente no encontrado:', cliente);
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        console.log('Cliente encontrado:', clienteExistente.nombre);

        // Validar que el técnico exista (si se proporciona)
        if (tecnico && tecnico !== null && tecnico.toString().trim() !== '') {
            console.log('Buscando técnico con ID:', tecnico);
            const tecnicoExistente = await Trabajador.findById(tecnico);
            if (!tecnicoExistente) {
                console.error('Técnico no encontrado:', tecnico);
                return res.status(404).json({ message: "Técnico no encontrado" });
            }
            console.log('Técnico encontrado');
        }

        // Validar que el ticket exista (si se proporciona)
        if (ticket && ticket !== null && ticket.toString().trim() !== '') {
            console.log('Buscando ticket con ID:', ticket);
            const Ticket = require("../models/Ticket");
            const ticketExistente = await Ticket.findById(ticket);
            if (!ticketExistente) {
                console.error('Ticket no encontrado:', ticket);
                return res.status(404).json({ message: "Ticket no encontrado" });
            }
            console.log('Ticket encontrado');
        }

        // Crear el albarán
        console.log('Creando nuevo albarán...');
        const nuevoAlbaran = new Albaran({
            numeroAlbaran: numeroAlbaran.trim(),
            cliente,
            tecnico: tecnico && tecnico.toString().trim() !== '' ? tecnico : null,
            ticket: ticket && ticket.toString().trim() !== '' ? ticket : null,
            descripcion: descripcion || '',
            lineas: lineas.map(linea => ({
                concepto: linea.concepto.toString().trim(),
                cantidad: Number(linea.cantidad)
            })),
            notas: notas || '',
            observaciones: observaciones || ''
        });

        console.log('Albarán antes de guardar:', JSON.stringify(nuevoAlbaran, null, 2));

        const albaranGuardado = await nuevoAlbaran.save();
        console.log('Albarán guardado con éxito. ID:', albaranGuardado._id);

        const albaranPopulado = await albaranGuardado.populate(['cliente', 'tecnico', 'ticket']);

        console.log('Albarán creado y poblado exitosamente');
        res.status(201).json(albaranPopulado);

    } catch (error) {
        console.error('Error al crear albarán:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({
            message: "Error al crear el albarán",
            error: error.message,
            details: error.errors
        });
    }
});

// Actualizar albarán
router.put("/:id", async (req, res) => {
    try {
        const { numeroAlbaran, cliente, tecnico, estado, descripcion, lineas, porcentajeIVA, notas, observaciones, fechaEntrega, firmante } = req.body;

        // Validar cliente si se actualiza
        if (cliente) {
            const clienteExistente = await Cliente.findById(cliente);
            if (!clienteExistente) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }
        }

        // Validar técnico si se actualiza
        if (tecnico) {
            const tecnicoExistente = await Trabajador.findById(tecnico);
            if (!tecnicoExistente) {
                return res.status(404).json({ message: "Técnico no encontrado" });
            }
        }

        const actualizacion = {
            numeroAlbaran,
            cliente,
            tecnico: tecnico && tecnico.toString().trim() !== '' ? tecnico : null,
            estado,
            descripcion,
            lineas,
            porcentajeIVA,
            notas,
            observaciones,
            fechaEntrega,
            firmante
        };

        const albaran = await Albaran.findByIdAndUpdate(
            req.params.id,
            actualizacion,
            { new: true, runValidators: true }
        ).populate(['cliente', 'tecnico', 'ticket']);

        if (!albaran) {
            return res.status(404).json({ message: "Albarán no encontrado" });
        }

        res.json(albaran);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar el albarán", error: error.message });
    }
});

// Cambiar estado del albarán
router.patch("/:id/estado", async (req, res) => {
    try {
        const { estado } = req.body;

        if (!['pendiente', 'entregado', 'devuelto', 'cancelado'].includes(estado)) {
            return res.status(400).json({ message: "Estado inválido" });
        }

        const albaran = await Albaran.findByIdAndUpdate(
            req.params.id,
            { estado },
            { new: true }
        ).populate(['cliente', 'tecnico', 'ticket']);

        if (!albaran) {
            return res.status(404).json({ message: "Albarán no encontrado" });
        }

        res.json(albaran);
    } catch (error) {
        res.status(400).json({ message: "Error al cambiar el estado", error: error.message });
    }
});

// Marcar como entregado
router.patch("/:id/entregar", async (req, res) => {
    try {
        const { firmante } = req.body;

        const albaran = await Albaran.findByIdAndUpdate(
            req.params.id,
            {
                estado: 'entregado',
                fechaEntrega: new Date(),
                firmante
            },
            { new: true }
        ).populate(['cliente', 'tecnico', 'ticket']);

        if (!albaran) {
            return res.status(404).json({ message: "Albarán no encontrado" });
        }

        res.json(albaran);
    } catch (error) {
        res.status(400).json({ message: "Error al marcar como entregado", error: error.message });
    }
});

// Eliminar albarán
router.delete("/:id", async (req, res) => {
    try {
        const albaran = await Albaran.findByIdAndDelete(req.params.id);

        if (!albaran) {
            return res.status(404).json({ message: "Albarán no encontrado" });
        }

        res.json({ message: "Albarán eliminado correctamente", albaran });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el albarán", error: error.message });
    }
});

module.exports = router;
