# 🌐 Despliegue Rápido en Linux

## TL;DR (Lo más importante)

### 1️⃣ En tu máquina Linux, ejecuta:

```bash
# Clonar el proyecto
git clone https://github.com/kyru002/Proyecto-Francisco-Aleix.git
cd Proyecto-Francisco-Aleix

# Crear archivo de configuración
cp .env.example .env

# Dar permisos de ejecución al script
chmod +x deploy.sh

# Ejecutar despliegue
./deploy.sh
```

### 2️⃣ ¡Accede a: `http://tu-ip-del-servidor`

---

## ✅ Requisitos Mínimos

- **Linux** (Ubuntu, Debian, CentOS)
- **Docker** instalado
- **Docker Compose** instalado
- **Git** (para clonar)

---

## 🚀 Despliegue Manual (Sin script)

Si prefieres hacerlo paso a paso:

```bash
# 1. Ir al directorio del proyecto
cd Proyecto-Francisco-Aleix

# 2. Construir imágenes
docker-compose build

# 3. Iniciar todos los servicios
docker-compose up -d

# 4. Verificar que está todo funcionando
docker-compose ps

# 5. Ver logs
docker-compose logs -f
```

Luego accede a: **`http://tu-servidor`**

---

## 📊 Servicios que se inician

| Servicio | Puerto | URL |
|----------|--------|-----|
| MongoDB | 27017 | No expuesto |
| Backend | 5001 | http://servidor/api |
| Nginx | 80 | http://servidor |

---

## 🛑 Para detener

```bash
docker-compose down
```

---

## 🔄 Para actualizar código

```bash
git pull origin main
docker-compose build
docker-compose restart
```

---

## 📝 Cambiar configuración

Editar `.env`:

```bash
nano .env
```

Valores importantes para producción:

- `JWT_SECRET` → Cambiar por una clave segura
- `VITE_API_URL` → Actualizar con tu dominio
- `VITE_SOCKET_URL` → Actualizar con tu dominio

---

## 🆘 Problemas Comunes

### Puerto 80 ocupado
```bash
# Usar otro puerto
# Editar docker-compose.yml:
# Cambiar "80:80" por "8080:80"
# Luego acceder a: http://servidor:8080
```

### Permisos denegados
```bash
# Agregar usuario a grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

### MongoDB no inicia
```bash
# Reiniciar MongoDB
docker-compose restart mongodb

# Ver logs
docker-compose logs mongodb
```

---

## 📞 ¿Más ayuda?

Ver la guía completa:
→ [Ver DEPLOY.md](./DEPLOY.md)

---

**¡Listo! La aplicación ya está online 🎉**
