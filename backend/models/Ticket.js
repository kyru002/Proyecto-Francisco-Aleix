const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
    client: {
        type: String, // Podría ser ObjectId si hubiera un modelo de Cliente
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["abierto", "en progreso", "cerrado"],
        default: "abierto",
        required: true
    },
    priority: {
        type: String,
        enum: ["alta", "media", "baja"],
        default: "media",
        required: true
    },
    technician: {
        type: String,
        required: false,
        trim: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    description: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Ticket", TicketSchema);
