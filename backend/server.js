require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./database");
const { Server } = require("socket.io");
const http = require("http");
const auth = require("./middleware/auth");
const CallLog = require("./models/CallLog");

// Crear servidor HTTP para Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Conectar a MongoDB
connectDB();

// Middlewares - CORS configurado para permitir Firebase
const corsOptions = {
  origin: ["https://supportdesk-b7836.web.app", "http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/tickets", require("./routes/tickets"));
app.use("/api/clientes", require("./routes/clientes"));
app.use("/api/albaranes", require("./routes/albaranes"));
app.use("/api/callLogs", require("./routes/callLogs"));
app.use("/api/trabajadores", require("./routes/trabajadores"));
app.use("/api/ai", auth, require("./routes/ai"));

// Ruta de prueba del estado del servidor
app.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusText = {
    0: "Desconectado",
    1: "Conectado ✅",
    2: "Conectando...",
    3: "Desconectando..."
  };
  res.send(`
    <h1>Estado del API</h1>
    <p>Servidor: <strong>Funcionando</strong></p>
    <p>Base de Datos (MongoDB): <strong>${statusText[dbStatus] || "Desconocido"}</strong></p>
    <p>Host: ${mongoose.connection.host || 'N/A'}</p>
  `);
});

// WebSocket - Manejo de videollamadas
const callRooms = new Map(); // Mapeo de ticket IDs a llamadas activas
const activeCallLogs = new Map(); // Mapeo de socket ID a CallLog ID para tracking

io.on("connection", (socket) => {
  console.log("✅ Cliente conectado:", socket.id);

  // Manejar mensajes de chat en tiempo real
  socket.on("chat-message", (data) => {
    const { ticketId, message } = data;
    const room = `ticket-${ticketId}`;
    // Retransmitir a todos en la sala EXCEPTO al que lo envió (él ya lo ve localmente)
    socket.broadcast.to(room).emit("new-chat-message", message);
  });

  // Unirse a sala de ticket
  socket.on("join-ticket-room", (ticketId, userData) => {
    const room = `ticket-${ticketId}`;
    socket.join(room);
    
    // Notificar a otros en la sala
    socket.broadcast.to(room).emit("user-joined", {
      userId: socket.id,
      userName: userData.name,
      userRole: userData.role
    });
  });

  // Manejar nueva llamada (inicial)
  socket.on("incoming-call", (data) => {
    const { ticketId, offer, callerName, callType } = data;
    const room = `ticket-${ticketId}`;
    
    // Enviar a todos en la sala EXCEPTO al que envia
    socket.broadcast.to(room).emit("incoming-call", {
      from: socket.id,
      callerName: callerName,
      callType: callType,
      offer: offer
    });
  });

  // Manejar oferta de renegotiación (durante una llamada en curso)
  socket.on("call-offer", (data) => {
    const { ticketId, offer, callerName, callType } = data;
    const room = `ticket-${ticketId}`;
    
    // Enviar a todos en la sala EXCEPTO al que envia
    socket.broadcast.to(room).emit("call-offer", {
      from: socket.id,
      callerName: callerName,
      callType: callType,
      offer: offer
    });
  });

  // Manejar respuesta de videollamada
  socket.on("call-answer", (data) => {
    const { ticketId, answer, to } = data;
    io.to(to).emit("call-answered", {
      from: socket.id,
      answer: answer
    });
  });

  // Manejar ICE candidates
  socket.on("ice-candidate", (data) => {
    const { ticketId, candidate, to } = data;
    io.to(to).emit("ice-candidate", {
      from: socket.id,
      candidate: candidate
    });
  });

  // Rechazar llamada
  socket.on("reject-call", (data) => {
    const { to } = data;
    io.to(to).emit("call-rejected", {
      from: socket.id
    });
  });

  // Terminar llamada
  socket.on("end-call", (data) => {
    const { ticketId, to } = data;
    io.to(to).emit("call-ended", {
      from: socket.id
    });
  });

  // Screen share iniciado
  socket.on("screen-share-started", (data) => {
    const { ticketId, from } = data;
    const room = `ticket-${ticketId}`;
    socket.broadcast.to(room).emit("screen-share-started", {
      from: socket.id
    });
  });

  // Screen share detenido
  socket.on("screen-share-stopped", (data) => {
    const { ticketId, from } = data;
    const room = `ticket-${ticketId}`;
    socket.broadcast.to(room).emit("screen-share-stopped", {
      from: socket.id
    });
  });

  // Registrar inicio de llamada
  socket.on("call-started", async (data) => {
    try {
      const { callerSocketId, callerName, receiverSocketId, receiverName, ticketId, callType } = data;

      const newCallLog = new CallLog({
        callerSocketId,
        callerName,
        receiverSocketId: receiverSocketId || null,
        receiverName: receiverName || null,
        ticket: ticketId || null,
        callType,
        status: "iniciada",
        startTime: new Date()
      });

      const savedCallLog = await newCallLog.save();
      activeCallLogs.set(callerSocketId, savedCallLog._id.toString());
    } catch (error) {
      console.error("❌ Error registrando inicio de llamada:", error.message);
    }
  });

  // Registrar aceptación de llamada
  socket.on("call-accepted", async (data) => {
    try {
      const { callerSocketId, receiverSocketId, receiverName } = data;
      const callLogId = activeCallLogs.get(callerSocketId);

      if (callLogId) {
        await CallLog.findByIdAndUpdate(
          callLogId,
          {
            status: "aceptada",
            receiverSocketId: receiverSocketId || socket.id,
            receiverName: receiverName || 'Usuario'
          },
          { new: true }
        );
        // Registrar también en el Map para el receiver
        activeCallLogs.set(socket.id, callLogId);
      }
    } catch (error) {
      console.error("❌ Error registrando aceptación de llamada:", error.message);
    }
  });

  // Registrar rechazo de llamada
  socket.on("call-rejected", async (data) => {
    try {
      const { callerSocketId } = data;
      const callLogId = activeCallLogs.get(callerSocketId) || activeCallLogs.get(socket.id);

      if (callLogId) {
        await CallLog.findByIdAndUpdate(
          callLogId,
          {
            status: "rechazada",
            endTime: new Date(),
            duration: 0
          },
          { new: true }
        );
        activeCallLogs.delete(callerSocketId);
        activeCallLogs.delete(socket.id);
      }
    } catch (error) {
      console.error("❌ Error registrando rechazo de llamada:", error.message);
    }
  });

  // Registrar término de llamada
  socket.on("call-ended", async (data) => {
    try {
      const { duration, screenShared } = data;
      const callLogId = activeCallLogs.get(socket.id);

      if (callLogId) {
        await CallLog.findByIdAndUpdate(
          callLogId,
          {
            status: "completada",
            duration: duration || 0,
            screenShared: screenShared || false,
            endTime: new Date()
          },
          { new: true }
        );

        // Limpiar del mapa
        activeCallLogs.forEach((value, key) => {
          if (value === callLogId) {
            activeCallLogs.delete(key);
          }
        });
      }
    } catch (error) {
      console.error("❌ Error registrando término de llamada:", error.message);
    }
  });

  // Desconexión
  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado:", socket.id);
    io.emit("user-disconnected", {
      userId: socket.id
    });
  });
});

// Inicio del servidor
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`WebSocket disponible en ws://localhost:${PORT}`);
});
