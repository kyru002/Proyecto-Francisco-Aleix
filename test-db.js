require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

console.log('--- TEST DE CONNEXIÓ MONGODB ---');
console.log(`Intentant connectar a: ${uri ? uri.split('@')[1] : 'UNDEFINED'} (ocultant credencials)`);

if (!uri) {
    console.error('❌ ERROR: No s\'ha trobat la variable MONGO_URI al fitxer .env');
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => {
        console.log('✅ ÈXIT: Connexió establerta correctament amb MongoDB Atlas!');
        console.log('    La base de dades està llesta per utilitzar.');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ ERROR: No s\'ha pogut connectar.');
        console.error('    Detalls de l\'error:', err.message);
        console.error('\nSUGGERIMENT: Revisa que la IP estigui a la "AllowList" de MongoDB Atlas o que la cadena de connexió sigui la correcta (mongodb+srv://...).');
        process.exit(1);
    });
