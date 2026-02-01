const mongoose = require("mongoose");

const AlbaraniSchema = new mongoose.Schema({
    numeroAlbaran: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    tecnico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tecnico',
        required: false
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: false
    },
    estado: {
        type: String,
        enum: ["pendiente", "entregado", "devuelto", "cancelado"],
        default: "pendiente",
        required: true
    },
    fechaAlbaran: {
        type: Date,
        default: Date.now,
        required: true
    },
    fechaEntrega: {
        type: Date
    },
    descripcion: {
        type: String,
        required: false,
        trim: true
    },
    lineas: [
        {
            concepto: {
                type: String,
                required: true,
                trim: true
            },
            cantidad: {
                type: Number,
                required: true,
                min: 0.01
            },
            unidad: {
                type: String,
                default: "unidad",
                trim: true
            },
            precioUnitario: {
                type: Number,
                required: true,
                min: 0
            },
            porcentajeDescuento: {
                type: Number,
                default: 0,
                min: 0,
                max: 100
            },
            importe: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],
    subtotal: {
        type: Number,
        default: 0,
        min: 0
    },
    porcentajeIVA: {
        type: Number,
        default: 21,
        min: 0,
        max: 100
    },
    iva: {
        type: Number,
        default: 0,
        min: 0
    },
    total: {
        type: Number,
        default: 0,
        min: 0
    },
    notas: {
        type: String,
        trim: true
    },
    observaciones: {
        type: String,
        trim: true
    },
    anexos: [
        {
            nombre: String,
            url: String,
            fecha: {
                type: Date,
                default: Date.now
            }
        }
    ],
    firmante: {
        nombre: String,
        apellidos: String,
        dni: String,
        fecha: Date
    }
}, {
    timestamps: true
});

// Middleware para calcular automáticamente totales
AlbaraniSchema.pre('save', async function() {
    try {
        // Calcular subtotal desde las líneas
        if (this.lineas && Array.isArray(this.lineas)) {
            this.subtotal = this.lineas.reduce((sum, linea) => {
                return sum + (parseFloat(linea.importe) || 0);
            }, 0);
        } else {
            this.subtotal = 0;
        }

        // Calcular IVA
        const porcentajeIVA = parseFloat(this.porcentajeIVA) || 21;
        this.iva = this.subtotal * (porcentajeIVA / 100);

        // Calcular total
        this.total = this.subtotal + this.iva;
    } catch (error) {
        console.error('Error en middleware pre save:', error);
        throw error;
    }
});

module.exports = mongoose.model("Albarani", AlbaraniSchema);
