# 🌐 Guía de Deployment en Azure App Service

## 📋 Resumen Rápido

Tu aplicación ya está configurada para Azure. Sigue estos pasos:

---

## ✅ Paso 1: Configurar MongoDB Atlas (Base de Datos en la Nube)

**IMPORTANTE:** Azure no puede usar MongoDB local. Necesitas MongoDB Atlas:

1. Ve a https://www.mongodb.com/cloud/atlas/register
2. Crea una cuenta gratuita
3. Crea un cluster (M0 Free tier)
4. En **Security → Network Access**: Añade tu IP o `0.0.0.0/0` (cualquier IP)
5. En **Security → Database Access**: Crea un usuario con contraseña
6. En **Databases → Connect**: 
   - Click "Connect your application"
   - Copia el connection string: `mongodb+srv://usuario:password@cluster.mongodb.net/MyApp`

---

## ✅ Paso 2: Configurar Variables de Entorno en Azure

1. Ve a Azure Portal → Tu App Service
2. Click en **Configuration** (menú izquierdo)
3. En **Application Settings**, añade estas variables:

| Nombre | Valor | Ejemplo |
|--------|-------|---------|
| `MONGO_URI` | Tu connection string de Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/MyApp` |
| `JWT_SECRET` | Clave secreta (genera una segura) | `mi-super-clave-secreta-2026` |
| `NODE_ENV` | `production` | `production` |
| `PORT` | `8080` o vacío (Azure lo asigna) | `8080` |

4. Click **Save**
5. Reinicia la app

---

## ✅ Paso 3: Deployment desde GitHub (Recomendado)

### Opción A: Desde Azure Portal

1. En tu App Service → **Deployment Center**
2. Selecciona **GitHub**
3. Autoriza Azure a acceder a tu GitHub
4. Selecciona:
   - Organization: `kyru002`
   - Repository: `Proyecto-Francisco-Aleix`
   - Branch: `main`
5. Click **Save**

Azure automáticamente:
- ✅ Clonará tu repo
- ✅ Ejecutará `npm install` (gracias al `postinstall` en package.json)
- ✅ Iniciará con `npm start` (que ejecuta `backend/server.js`)
- ✅ Usará las variables de entorno configuradas

### Opción B: Git Push Manual

```bash
# 1. Añadir remote de Azure
git remote add azure https://<deployment-user>@<app-name>.scm.azurewebsites.net/<app-name>.git

# 2. Push a Azure
git push azure main
```

---

## ✅ Paso 4: Verificar Deployment

1. **Ver logs en tiempo real:**
   - Azure Portal → Tu App Service → **Log stream**
   - Deberías ver: `✅ MongoDB conectado correctamente`

2. **Probar la API:**
   - Abre: `https://<tu-app>.azurewebsites.net/`
   - Deberías ver: `{ "status": "OK", "database": "Conectado ✅" }`

3. **Probar endpoint de login:**
   ```bash
   curl -X POST https://<tu-app>.azurewebsites.net/api/trabajadores/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"admin123"}'
   ```

---

## 🔧 Paso 5: Configurar CORS para Tu Frontend

Tu backend necesita permitir requests desde tu dominio de frontend.

**Edita [backend/server.js](../backend/server.js#L23-L29):**

```javascript
const corsOptions = {
  origin: [
    "https://supportdesk-b7836.web.app",  // Firebase (si usas)
    "https://<tu-dominio-frontend>.com",   // ⬅️ AÑADE TU DOMINIO AQUÍ
    "http://localhost:5173"                // Para desarrollo
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};
```

Después haz commit y push a GitHub (Azure actualizará automáticamente).

---

## 🚀 Paso 6: Deploy del Frontend

El frontend es una app Vue estática. Opciones:

### Opción A: Vercel (Recomendado - Gratis)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desde frontend/
cd frontend
vercel login
vercel --prod

# Configurar variables de entorno en Vercel dashboard:
# VITE_API_URL = https://<tu-app>.azurewebsites.net/api
# VITE_SOCKET_URL = https://<tu-app>.azurewebsites.net
```

### Opción B: Azure Static Web Apps

1. Crea un **Static Web App** en Azure
2. Conecta con GitHub
3. Configura:
   - App location: `/frontend`
   - Output location: `dist`
   - Build command: `npm run build`

### Opción C: Netlify

```bash
npm install -g netlify-cli

cd frontend
npm run build
netlify deploy --prod --dir=dist

# Configura variables de entorno en Netlify dashboard
```

---

## 🐛 Troubleshooting

### Problema 1: "Application Error"

**Causa:** Azure no puede ejecutar tu app.

**Solución:**
1. Ve a **Log Stream** y revisa errores
2. Verifica que `MONGO_URI` está configurado
3. Asegúrate que MongoDB Atlas permite conexiones desde Azure (IP: `0.0.0.0/0`)

### Problema 2: "Cannot connect to database"

**Causa:** MongoDB Atlas rechaza la conexión.

**Solución:**
1. MongoDB Atlas → **Network Access**: Añade `0.0.0.0/0` (todas las IPs)
2. Verifica usuario y contraseña en `MONGO_URI`
3. El formato correcto es: `mongodb+srv://username:password@cluster.mongodb.net/MyApp`

### Problema 3: CORS errors en frontend

**Causa:** Backend no permite requests desde tu dominio de frontend.

**Solución:**
1. Actualiza `corsOptions.origin` en `backend/server.js`
2. Añade el dominio de tu frontend
3. Haz commit y push

### Problema 4: "Service Unavailable"

**Causa:** La app tarda en iniciar o falló.

**Solución:**
1. Aumenta el timeout: Configuration → General Settings → **Web Sockets** = ON
2. Configuration → General Settings → **Always On** = ON (para evitar cold starts)
3. Reinicia la app

### Problema 5: WebSocket no funciona (videollamadas)

**Solución:**
1. Configuration → General Settings → **Web Sockets** = **ON** ⬅️ IMPORTANTE
2. Asegúrate que frontend usa `wss://` (no `ws://`) en producción

---

## 📊 Verificación Final

✅ **Backend funcionando:**
- `https://<tu-app>.azurewebsites.net/` → Muestra status OK

✅ **MongoDB conectado:**
- Log stream muestra: `✅ MongoDB conectado correctamente`

✅ **API responde:**
- Login endpoint funciona
- Puedes crear/obtener tickets

✅ **Frontend conecta:**
- Puedes hacer login
- Puedes ver tickets
- No hay errores CORS

---

## 🔐 Seguridad en Producción

**Antes de usar en producción:**

1. **Cambiar JWT_SECRET:**
   ```bash
   # Generar clave segura
   openssl rand -base64 32
   ```

2. **Restringir CORS:**
   - No usar `origin: "*"`
   - Solo dominios específicos

3. **Configurar HTTPS:**
   - Azure usa HTTPS por defecto ✅

4. **Proteger MongoDB:**
   - No usar `0.0.0.0/0` en Network Access
   - Usar IPs específicas de Azure

5. **Environment Variables:**
   - Nunca hacer commit de `.env`
   - Todo en Azure Configuration

---

## 📞 Comandos Útiles

```bash
# Ver logs en tiempo real
az webapp log tail --name <app-name> --resource-group <resource-group>

# Reiniciar app
az webapp restart --name <app-name> --resource-group <resource-group>

# Ver configuración
az webapp config appsettings list --name <app-name> --resource-group <resource-group>

# Establecer variable de entorno
az webapp config appsettings set --name <app-name> --resource-group <resource-group> \
  --settings MONGO_URI="mongodb+srv://..."
```

---

## 📖 Recursos Adicionales

- [Documentación Azure App Service](https://docs.microsoft.com/azure/app-service/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Troubleshooting Node.js en Azure](https://docs.microsoft.com/azure/app-service/configure-language-nodejs)

---

## ✨ Resumen de Archivos Creados para Azure

| Archivo | Propósito |
|---------|-----------|
| [web.config](../web.config) | Configuración IIS para ejecutar Node.js |
| [.deployment](../.deployment) | Le dice a Azure dónde está el entry point |
| [package.json](../package.json) | Scripts de inicio (`npm start`) |
| [azure-deploy.sh](../azure-deploy.sh) | Script opcional de deployment |

---

**¡Listo!** Tu aplicación debería estar funcionando en Azure. Si tienes problemas, revisa **Log Stream** primero.

**Última actualización:** Febrero 2026
