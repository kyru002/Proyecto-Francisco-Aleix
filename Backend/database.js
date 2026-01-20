const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/miapp");
    console.log("✅ MongoDB conectado correctamente");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
  }
}

module.exports = connectDB;