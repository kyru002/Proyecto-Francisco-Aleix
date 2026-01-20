const express = require("express");
const app = express();
const connectDB = require("./database");


// Conectar a MongoDB
connectDB();

// Middlewares
app.use(express.json());

// Ruta inicial
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// Inicio del servidor
app.listen(5001, () => {
  console.log("Servidor ejecutándose en http://localhost:5001");
});
