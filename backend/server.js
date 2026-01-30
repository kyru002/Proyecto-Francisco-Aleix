const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./database");

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tickets", require("./routes/tickets"));

// Ruta inicial se mantiene para verificar estado
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// Inicio del servidor
app.listen(5001, () => {
  console.log("Servidor ejecutándose en http://localhost:5001");
});
