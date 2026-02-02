const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./database");
const { Server } = require("socket.io");
const http = require("http");

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

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tickets", require("./routes/tickets"));
app.use("/api/tecnicos", require("./routes/tecnicos"));
app.use("/api/clientes", require("./routes/clientes"));
app.use("/api/albaranes", require("./routes/albaranes"));

// Ruta inicial
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// WebSocket - Manejo de videollamadas
const callRooms = new Map(); // Mapeo de ticket IDs a llamadas activas

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado:", socket.id);

  // Unirse a sala de ticket
  socket.on("join-ticket-room", (ticketId, userData) => {
    const room = `ticket-${ticketId}`;
    socket.join(room);
    console.log(`${userData.name} (${userData.role}) se unió a ${room}`);
    
    // Notificar a otros en la sala
    socket.broadcast.to(room).emit("user-joined", {
      userId: socket.id,
      userName: userData.name,
      userRole: userData.role
    });
  });

  // Manejar oferta de videollamada (inicio de llamada)
  socket.on("call-offer", (data) => {
    const { ticketId, offer, callerName, callType } = data;
    const room = `ticket-${ticketId}`;
    console.log(`\n📞 CALL-OFFER RECIBIDO`);
    console.log(`   Caller: ${callerName}`);
    console.log(`   Type: ${callType}`);
    console.log(`   Room: ${room}`);
    console.log(`   Socket ID: ${socket.id}`);
    
    const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;
    console.log(`   Total en sala: ${roomSize}`);
    
    // Obtener todos los sockets en la sala
    const socketsInRoom = io.sockets.adapter.rooms.get(room);
    console.log(`   Sockets en sala:`, socketsInRoom ? Array.from(socketsInRoom) : []);
    
    // Enviar a todos en la sala EXCEPTO al que envia
    console.log(`   📤 Emitiendo 'incoming-call' a otros...`);
    socket.broadcast.to(room).emit("incoming-call", {
      from: socket.id,
      callerName: callerName,
      callType: callType,
      offer: offer
    });
    
    console.log(`   ✅ Evento emitido\n`);
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
    console.log(`Usuario ${from} comenzó a compartir pantalla`);
    socket.broadcast.to(room).emit("screen-share-started", {
      from: socket.id
    });
  });

  // Screen share detenido
  socket.on("screen-share-stopped", (data) => {
    const { ticketId, from } = data;
    const room = `ticket-${ticketId}`;
    console.log(`Usuario ${from} dejó de compartir pantalla`);
    socket.broadcast.to(room).emit("screen-share-stopped", {
      from: socket.id
    });
  });

  // Desconexión
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
    io.emit("user-disconnected", {
      userId: socket.id
    });
  });
});

// Inicio del servidor
server.listen(5001, () => {
  console.log("Servidor ejecutándose en http://localhost:5001");
  console.log("WebSocket disponible en ws://localhost:5001");
});
