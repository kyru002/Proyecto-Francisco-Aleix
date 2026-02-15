const mongoose = require("mongoose");

async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/MyApp";
  
  try {
    await mongoose.connect(MONGO_URI);
    const maskedURI = MONGO_URI.replace(/:([^@]+)@/, ":****@");
    console.log(`✅ MongoDB conectado correctamente a: ${maskedURI}`);

    // Auto-seeding de cuentas base
    const seedDatabase = require("./utils/seeder");
    await seedDatabase();
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;