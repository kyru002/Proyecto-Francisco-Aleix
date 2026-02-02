const express = require("express");
const router = express.Router();
const CallLog = require("../models/CallLog");

// Crear nuevo registro de llamada
router.post("/", async (req, res) => {
  try {
    const { callerSocketId, callerName, receiverSocketId, receiverName, ticket, callType, status } = req.body;

    if (!callerSocketId || !callerName || !receiverSocketId || !receiverName || !callType) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const newCallLog = new CallLog({
      callerSocketId,
      callerName,
      receiverSocketId,
      receiverName,
      ticket: ticket || null,
      callType,
      status: status || "iniciada",
      startTime: new Date()
    });

    const savedCallLog = await newCallLog.save();
    res.status(201).json(savedCallLog);
  } catch (error) {
    res.status(500).json({ message: "Error al crear registro de llamada", error: error.message });
  }
});

// Actualizar registro de llamada (para terminar)
router.patch("/:id", async (req, res) => {
  try {
    const { status, duration, screenShared, endTime } = req.body;

    const callLog = await CallLog.findByIdAndUpdate(
      req.params.id,
      {
        status: status || "completada",
        duration: duration || 0,
        screenShared: screenShared || false,
        endTime: endTime || new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!callLog) {
      return res.status(404).json({ message: "Registro de llamada no encontrado" });
    }

    res.json(callLog);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar registro de llamada", error: error.message });
  }
});

// Obtener registros de llamadas por ticket
router.get("/ticket/:ticketId", async (req, res) => {
  try {
    const callLogs = await CallLog.find({ ticket: req.params.ticketId })
      .populate("ticket")
      .sort({ startTime: -1 });

    res.json(callLogs);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener registros de llamadas", error: error.message });
  }
});

// Obtener todos los registros de llamadas
router.get("/", async (req, res) => {
  try {
    const callLogs = await CallLog.find()
      .populate("ticket")
      .sort({ startTime: -1 });

    res.json(callLogs);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener registros de llamadas", error: error.message });
  }
});

// Obtener un registro específico
router.get("/:id", async (req, res) => {
  try {
    const callLog = await CallLog.findById(req.params.id).populate("ticket");

    if (!callLog) {
      return res.status(404).json({ message: "Registro de llamada no encontrado" });
    }

    res.json(callLog);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener registro de llamada", error: error.message });
  }
});

module.exports = router;
