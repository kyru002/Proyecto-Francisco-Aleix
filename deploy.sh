#!/bin/bash

# ============================================
# Script de Despliegue - Proyecto Francisco Aleix
# ============================================

set -e

echo "🚀 Iniciando despliegue de la aplicación..."
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir messages
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado"
    exit 1
fi
print_status "Docker encontrado"

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose no está instalado"
    exit 1
fi
print_status "Docker Compose encontrado"

# Verificar si .env existe
if [ ! -f .env ]; then
    print_warning ".env no encontrado, creando desde .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        print_status ".env creado desde template"
        print_warning "POR FAVOR: Edita .env con tus valores de producción"
    else
        print_error ".env.example no encontrado"
        exit 1
    fi
fi

echo ""
echo "📦 Construyendo imágenes de Docker..."
docker-compose build

echo ""
echo "🔄 Iniciando servicios..."
docker-compose up -d

echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 5

echo ""
echo "📊 Estado de los servicios:"
docker-compose ps

echo ""
echo "🔍 Verificando conectividad..."

# Verificar MongoDB
print_status "Verificando MongoDB..."
if docker-compose exec -T mongodb mongosh admin --eval "db.adminCommand('ping')" &> /dev/null; then
    print_status "✓ MongoDB está funcionando"
else
    print_warning "MongoDB aún está iniciando..."
fi

echo ""
echo "📋 Logs iniciales (últimas 15 líneas):"
echo ""
docker-compose logs --tail=15

echo ""
echo "============================================"
echo -e "${GREEN}✓ ¡Despliegue completado!${NC}"
echo "============================================"
echo ""
echo "📍 URL de acceso:"
echo "   http://localhost"
echo ""
echo "📊 Comandos útiles:"
echo "   Ver logs:              docker-compose logs -f"
echo "   Logs de un servicio:   docker-compose logs -f app"
echo "   Reiniciar servicios:   docker-compose restart"
echo "   Detener servicios:     docker-compose down"
echo "   Actualizar código:     git pull && docker-compose build && docker-compose up -d"
echo ""
echo "🔒 IMPORTANTE - Configuración de producción:"
echo "   - Cambiar JWT_SECRET en .env"
echo "   - Configurar BASE_URL con tu dominio"
echo "   - Habilitar HTTPS si es necesario"
echo ""
