#!/bin/bash

# =========================================
# Script de deployment para Azure App Service
# =========================================

# 1. Salir si hay errores
set -e

echo "🚀 Iniciando deployment en Azure..."

# 2. Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install --production
cd ..

# 3. Copiar archivos necesarios
echo "📋 Preparando archivos..."

# 4. Verificar que server.js existe
if [ ! -f "backend/server.js" ]; then
    echo "❌ ERROR: backend/server.js no encontrado"
    exit 1
fi

echo "✅ Backend listo para deployment"

# 5. Configurar variables de entorno (se deben configurar en Azure Portal)
echo ""
echo "⚠️  IMPORTANTE: Configurar en Azure Portal → Configuration:"
echo "   - MONGO_URI: tu MongoDB Atlas connection string"
echo "   - JWT_SECRET: tu clave secreta"
echo "   - NODE_ENV: production"
echo "   - PORT: 8080 (o el que use Azure)"
echo ""

echo "✅ Deployment completado"
