# 🚀 Guía de Despliegue en Linux

Este documento explica cómo hostear la aplicación en una máquina Linux con acceso HTTP simple (sin SSL).

---

## 📋 Requisitos Previos

- **Linux** (Ubuntu 20.04+, Debian, CentOS, etc.)
- **Docker** instalado
- **Docker Compose** instalado
- **Git** (opcional, para clonar el repositorio)
- **Un dominio o IP pública** (opcional)

### Instalación de Docker y Docker Compose

```bash
# En Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verificar instalación
docker --version
docker-compose --version
```

---

## 📁 Preparación del Proyecto

### 1. Clonar o copiar el proyecto

```bash
# Opción 1: Clonar desde Git
git clone https://github.com/kyru002/Proyecto-Francisco-Aleix.git
cd Proyecto-Francisco-Aleix

# Opción 2: Copiar archivos via SCP
scp -r /ruta/local/Proyecto-Francisco-Aleix user@servidor:/home/user/
```

### 2. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar con tu información
nano .env
```

Asegúrate de cambiar estos valores si es necesario:

```env
NODE_ENV=production
MONGO_URI=mongodb://mongodb:27017/proyecto-db
JWT_SECRET=tu-clave-secreta-muy-segura-CAMBIAR
VITE_API_URL=http://tu-dominio.com/api
VITE_SOCKET_URL=http://tu-dominio.com
BASE_URL=http://tu-dominio.com
```

### 3. Preparar permisos

```bash
# Dar permisos de ejecución
chmod +x start-app.sh

# Dar permisos al usuario para Docker (opcional, para no usar sudo)
sudo usermod -aG docker $USER
newgrp docker
```

---

## 🐳 Despliegue con Docker Compose

### Opción A: Despliegue Rápido (Recomendado)

```bash
# 1. Construir todas las imágenes
docker-compose build

# 2. Iniciar todos los servicios
docker-compose up -d

# 3. Verificar estado
docker-compose ps

# 4. Ver logs
docker-compose logs -f

# 5. Detener servicios
docker-compose down
```

### Opción B: Despliegue Manual

```bash
# 1. Construir el Dockerfile principal
docker build -t proyecto-app:latest .

# 2. Construir el Dockerfile de Nginx
docker build -f Dockerfile.nginx -t proyecto-nginx:latest .

# 3. Crear red de Docker
docker network create app-network

# 4. Iniciar MongoDB
docker run -d \
  --name proyecto-mongodb \
  --network app-network \
  -v mongo-data:/data/db \
  -p 27017:27017 \
  mongo:latest

# 5. Iniciar Backend
docker run -d \
  --name proyecto-app \
  --network app-network \
  -e MONGO_URI=mongodb://proyecto-mongodb:27017/proyecto-db \
  -e NODE_ENV=production \
  -e JWT_SECRET=tu-clave-secreta \
  -p 5001:5001 \
  proyecto-app:latest

# 6. Iniciar Nginx
docker run -d \
  --name proyecto-nginx \
  --network app-network \
  -p 80:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf:ro \
  proyecto-nginx:latest
```

---

## 🌍 Acceso a la Aplicación

Una vez desplegada, accede a:

```
http://tu-servidor-o-ip
```

**Ejemplo:**
- `http://192.168.1.100`
- `http://tu-dominio.com`
- `http://localhost` (si es local)

---

## 📊 Monitoreo y Mantenimiento

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f nginx
docker-compose logs -f app
docker-compose logs -f mongodb
```

### Reiniciar servicios

```bash
# Reiniciar todo
docker-compose restart

# Reiniciar servicio específico
docker-compose restart app
docker-compose restart nginx
```

### Actualizar código

```bash
# 1. Hacer pull de cambios
git pull origin main

# 2. Reconstruir imágenes
docker-compose build

# 3. Reiniciar servicios
docker-compose down
docker-compose up -d
```

### Limpiar datos y volúmenes

```bash
# Detener y eliminar contenedores
docker-compose down

# Eliminar también volúmenes (¡CUIDADO! Borra la BD)
docker-compose down -v

# Limpiar imágenes no utilizadas
docker image prune -a
```

---

## 🔧 Configuración de Dominio

### Opción 1: Mediante DNS (Recomendado)

1. Apunta tu dominio a la IP del servidor en tu proveedor de DNS
2. La aplicación estará disponible en `http://tu-dominio.com`

### Opción 2: Con SSL (Nginx Proxy Manager)

Si quieres HTTPS con Let's Encrypt:

```bash
# Usar Nginx Proxy Manager como proxy inverso
# Ver: https://nginxproxymanager.com/
```

---

## 🚨 Solución de Problemas

### Problema: Puerto 80 en uso

```bash
# Buscar qué proceso usa el puerto 80
sudo lsof -i :80

# Liberar puerto o usar otro puerto
# Editar docker-compose.yml: "8080:80" en lugar de "80:80"
```

### Problema: Conexión a MongoDB fallida

```bash
# Verificar que MongoDB está corriendo
docker-compose ps

# Ver logs de MongoDB
docker-compose logs mongodb

# Reiniciar MongoDB
docker-compose restart mongodb
```

### Problema: Frontend no carga

```bash
# Verificar que el build del frontend se completó
docker-compose logs nginx

# Reconstruir desde cero
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Problema: Permisos denegados (Permission denied)

```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Aplicar cambios
newgrp docker

# O usar sudo
sudo docker-compose up -d
```

---

## 📦 Datos Persistentes

La aplicación utiliza volúmenes de Docker para persistencia:

- **mongo-data**: Base de datos MongoDB
- **frontend-dist**: Archivos compilados del frontend

Para ver volúmenes:

```bash
docker volume ls
docker volume inspect proyecto-francisco-aleix_mongo-data
```

---

## 🔐 Seguridad en Producción

### Tareas importantes:

1. **Cambiar JWT_SECRET**
   ```bash
   # Generar una clave segura
   openssl rand -base64 32
   
   # Actualizar en .env
   JWT_SECRET=tu-clave-generada-aqui
   ```

2. **Habilitar HTTPS** (recomendado)
   - Usar Let's Encrypt + Certbot
   - O usar Nginx Proxy Manager

3. **Configurar firewall**
   ```bash
   # Permitir solo puertos necesarios
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp (si uses HTTPS)
   sudo ufw enable
   ```

4. **Backups de BD**
   ```bash
   # Exportar base de datos
   docker-compose exec mongodb mongodump --out /backup
   ```

---

## 📞 Contacto y Soporte

Para problemas o preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo

---

## ✅ Checklist de Despliegue

- [ ] Docker y Docker Compose instalados
- [ ] Código clonado/copiado al servidor
- [ ] Archivo `.env` configurado
- [ ] Permisos correctos para Docker
- [ ] `docker-compose build` completado
- [ ] `docker-compose up -d` ejecutado
- [ ] Acceso a `http://servidor` funciona
- [ ] Frontend carga correctamente
- [ ] API responde en `/api`
- [ ] Base de datos conectada
- [ ] JWT_SECRET cambiado en producción
- [ ] Backups configurados

---

**¡Listo para producción! 🎉**
