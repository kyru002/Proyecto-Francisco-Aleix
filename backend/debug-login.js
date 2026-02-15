require('dotenv').config();
const mongoose = require('mongoose');

// Models
const TrabajadorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    telefono: String,
    puesto: { type: String, required: true },
    role: { type: String, enum: ["admin", "tecnico", "cliente"], default: "tecnico" },
    empresa: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
    password: { type: String, required: true },
    contraseñaTemporal: { type: Boolean, default: false },
    estado: { type: String, enum: ["activo", "inactivo", "suspendido"], default: "activo" }
});

const Trabajador = mongoose.model("Trabajador", TrabajadorSchema, "trabajadores");

async function testLogin() {
    const uri = process.env.MONGO_URI;
    console.log('--- DIAGNÒSTIC LOGIN V2 ---');
    console.log('1. Connectant a MongoDB...');

    try {
        await mongoose.connect(uri);
        console.log('✅ Connectat.');
    } catch (e) {
        console.error('❌ ERROR CONNEXIÓ:', e.message);
        if (e.codeName) console.error('   Codi:', e.codeName);
        return;
    }

    const email = 'admin@support.com';
    console.log(`2. Cercant usuari: ${email}...`);

    try {
        // Sense populate primer per aïllar problemes
        const trabajador = await Trabajador.findOne({ email: email.toLowerCase() });

        if (!trabajador) {
            console.log('⚠️ Usuari NO trobat. El seeder NO ha funcionat.');
        } else {
            console.log('✅ Usuari trobat:', trabajador.email);
            console.log('   ID:', trabajador._id);
            console.log('   Rol:', trabajador.role);

            // Ara amb populate (si falla aquí, és schema de Cliente)
            /* 
            try {
                await trabajador.populate('empresa');
                console.log('✅ Populate empresa OK');
            } catch (popError) {
                console.error('❌ Error populate:', popError.message);
            }
            */
        }

    } catch (error) {
        console.error('❌ EXCEPCIÓ DURANT LA CONSULTA:');
        console.error(error);
    } finally {
        setTimeout(() => {
            mongoose.disconnect();
            process.exit(0);
        }, 1000);
    }
}

testLogin();
