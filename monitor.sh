#!/bin/bash

# ============================================
# Script de Monitoreo - Proyecto Francisco Aleix
# ============================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC} $1"
    echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
}

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Menú principal
show_menu() {
    echo ""
    echo "Selecciona una opción:"
    echo "  1) Ver estado de servicios"
    echo "  2) Ver logs en tiempo real"
    echo "  3) Ver logs de un servicio específico"
    echo "  4) Reiniciar servicios"
    echo "  5) Backup de base de datos"
    echo "  6) Restaurar base de datos"
    echo "  7) Limpiar datos y volúmenes"
    echo "  8) Actualizar código y redeploy"
    echo "  9) Ver uso de recursos"
    echo "  10) Salir"
    echo ""
    read -p "Opción (1-10): " option
}

# 1. Ver estado de servicios
check_status() {
    print_header "Estado de Servicios"
    echo ""
    docker-compose ps
    echo ""
    print_info "Estados: Running (verde) = Activo, Exited (gris) = Detenido"
}

# 2. Ver logs en tiempo real
view_logs_all() {
    print_header "Logs en Tiempo Real (Ctrl+C para salir)"
    echo ""
    docker-compose logs -f --tail=50
}

# 3. Ver logs de un servicio
view_logs_service() {
    echo ""
    echo "Servicios disponibles:"
    echo "  1) nginx"
    echo "  2) app (Backend)"
    echo "  3) mongodb"
    echo ""
    read -p "Selecciona servicio (1-3): " service_opt
    
    case $service_opt in
        1) SERVICE="nginx" ;;
        2) SERVICE="app" ;;
        3) SERVICE="mongodb" ;;
        *) print_error "Opción inválida"; return ;;
    esac
    
    print_header "Logs de $SERVICE (Ctrl+C para salir)"
    echo ""
    docker-compose logs -f --tail=100 $SERVICE
}

# 4. Reiniciar servicios
restart_services() {
    echo ""
    echo "¿Qué deseas reiniciar?"
    echo "  1) Todos los servicios"
    echo "  2) Solo Nginx"
    echo "  3) Solo Backend"
    echo "  4) Solo MongoDB"
    echo ""
    read -p "Opción (1-4): " restart_opt
    
    case $restart_opt in
        1) 
            print_info "Reiniciando todos los servicios..."
            docker-compose restart
            print_status "Servicios reiniciados"
            ;;
        2)
            print_info "Reiniciando Nginx..."
            docker-compose restart nginx
            print_status "Nginx reiniciado"
            ;;
        3)
            print_info "Reiniciando Backend..."
            docker-compose restart app
            print_status "Backend reiniciado"
            ;;
        4)
            print_info "Reiniciando MongoDB..."
            docker-compose restart mongodb
            print_status "MongoDB reiniciado"
            ;;
        *)
            print_error "Opción inválida"
            ;;
    esac
}

# 5. Backup de base de datos
backup_database() {
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_DIR="./backups/backup_$TIMESTAMP"
    
    print_header "Creando Backup de MongoDB"
    echo ""
    
    mkdir -p "./backups"
    
    print_info "Creando directorio de backup..."
    mkdir -p "$BACKUP_DIR"
    
    print_info "Ejecutando mongodump..."
    docker-compose exec -T mongodb mongodump --out /backup
    
    print_info "Copiando backup al host..."
    docker cp proyecto-mongodb:/backup "$BACKUP_DIR"
    
    print_status "Backup completado: $BACKUP_DIR"
    
    # Mostrar tamaño
    BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
    print_info "Tamaño del backup: $BACKUP_SIZE"
    
    echo ""
    read -p "¿Comprimir backup? (s/n): " compress
    if [ "$compress" = "s" ]; then
        print_info "Comprimiendo..."
        tar -czf "${BACKUP_DIR}.tar.gz" "$BACKUP_DIR"
        rm -rf "$BACKUP_DIR"
        print_status "Backup comprimido: ${BACKUP_DIR}.tar.gz"
    fi
}

# 6. Restaurar base de datos
restore_database() {
    print_header "Restaurar Base de Datos"
    echo ""
    
    if [ ! -d "./backups" ]; then
        print_error "No existen backups en ./backups"
        return
    fi
    
    echo "Backups disponibles:"
    ls -la ./backups/ | grep backup
    echo ""
    read -p "Nombre del backup a restaurar: " backup_name
    
    BACKUP_PATH="./backups/$backup_name"
    
    if [ ! -d "$BACKUP_PATH" ]; then
        print_error "Backup no encontrado: $BACKUP_PATH"
        return
    fi
    
    print_warning "¡CUIDADO! Esto sobrescribirá la base de datos actual"
    read -p "¿Estás seguro? Escribe 'sí' para confirmar: " confirm
    
    if [ "$confirm" != "sí" ]; then
        print_info "Operación cancelada"
        return
    fi
    
    print_info "Limpiando base de datos actual..."
    docker-compose exec -T mongodb mongosh --eval "db.dropDatabase()"
    
    print_info "Copiando backup al container..."
    docker cp "$BACKUP_PATH" proyecto-mongodb:/restore
    
    print_info "Restaurando datos..."
    docker-compose exec -T mongodb mongorestore /restore
    
    print_status "Base de datos restaurada exitosamente"
}

# 7. Limpiar datos
cleanup_data() {
    print_header "Limpiar Datos y Volúmenes"
    echo ""
    print_warning "¡CUIDADO! Esto eliminará TODOS los datos de la base de datos"
    read -p "¿Estás seguro? Escribe 'eliminar-todo' para confirmar: " confirm
    
    if [ "$confirm" != "eliminar-todo" ]; then
        print_info "Operación cancelada"
        return
    fi
    
    print_info "Deteniendo servicios..."
    docker-compose down
    
    print_info "Eliminando volúmenes..."
    docker-compose down -v
    
    print_info "Limpiando imágenes no utilizadas..."
    docker image prune -f
    
    print_status "Limpieza completada"
}

# 8. Actualizar código
update_code() {
    print_header "Actualizar Código y Redeploy"
    echo ""
    
    print_info "Pulling cambios de Git..."
    git pull origin main
    
    print_info "Reconstruyendo imágenes..."
    docker-compose build
    
    print_info "Reiniciando servicios..."
    docker-compose down
    docker-compose up -d
    
    echo ""
    sleep 3
    docker-compose ps
    
    print_status "Actualización completada"
}

# 9. Ver uso de recursos
view_resources() {
    print_header "Uso de Recursos Docker"
    echo ""
    docker stats --no-stream
}

# Main loop
while true; do
    show_menu
    
    case $option in
        1) check_status ;;
        2) view_logs_all ;;
        3) view_logs_service ;;
        4) restart_services ;;
        5) backup_database ;;
        6) restore_database ;;
        7) cleanup_data ;;
        8) update_code ;;
        9) view_resources ;;
        10) 
            print_info "¡Hasta luego!"
            exit 0
            ;;
        *)
            print_error "Opción inválida"
            ;;
    esac
    
    echo ""
    read -p "Presiona Enter para continuar..."
done
