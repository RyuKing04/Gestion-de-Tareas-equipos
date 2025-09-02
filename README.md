# 🧩 TaskBoard - Gestor de Tareas estilo Trello

Aplicación web fullstack inspirada en Trello. Permite a los usuarios registrarse, iniciar sesión, crear tableros y gestionar tareas en equipo.

---

## 🚀 Tecnologías utilizadas

### 🖥️ Frontend (client/)
- Vue 3
- Vite
- TypeScript
- Axios
- Bootstrap 5

### 🔧 Backend (server/)
- Node.js
- Express
- MongoDB Atlas + Mongoose
- JWT para autenticación
- bcryptjs para hashing de contraseñas
- dotenv para variables de entorno

---

## 📁 Estructura del Proyecto

```
project-root/
├── client/                 → Vue + Vite (Frontend)
│   ├── src/
│   │   ├── components/     ← Componentes Vue
│   │   │   ├── Login.vue           ← Formulario de autenticación
│   │   │   └── PublishingPlatformBoard.vue  ← Tablero principal estilo Kanban
│   │   ├── router/         ← Configuración de rutas
│   │   ├── services/       ← Servicios API (authService, etc.)
│   │   └── App.vue         ← Componente principal
├── server/                 → Node + Express (Backend)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── .env                ← Variables de entorno (no subir a GitHub)
│   ├── app.js
│   └── server.js
├── README.md
└── .gitignore
```

---

## ⚙️ Instalación y ejecución local

### 1. Clonar el repositorio
```bash
git clone https://github.com/RyuKing04/Gestion-de-Tareas-equipos.git
cd taskboard
```

### 2. Configurar el backend
```bash
cd server
npm install
```
Crear archivo `.env` con:
```env
PORT=5000
MONGO_URI=tu_mongo_uri
JWT_SECRET=supersecreto123
```

Iniciar servidor:
```bash
npx nodemon server.js
```

### 3. Configurar el frontend
```bash
cd ../client
npm install
npm run dev
```

---

## 🔐 Endpoints disponibles

### `POST /api/register`
Registrar nuevo usuario:
```json
{
  "nombre": "Antonio",
  "email": "antonio@example.com",
  "password": "123456"
}
```

### `POST /api/login`
Iniciar sesión:
```json
{
  "email": "antonio@example.com",
  "password": "123456"
}
```

---

## 🧱 Modelo de base de datos (MongoDB)

### Usuarios
```js
{
  _id, nombre, email, contraseña_hash, fecha_creación
}
```

### Tableros
```js
{
  _id, nombre, creador_id (ref Usuario), fecha_creación, miembros: [ref Usuario]
}
```

### Tareas
```js
{
  _id, titulo, descripcion, estado (por hacer / en progreso / hecho),
  tablero_id (ref Tablero), asignado_a (ref Usuario), fecha_creación
}
```

---

## 📌 Estado Actual del Proyecto

✅ Funcionalidades Implementadas
Sistema de autenticación completo (login/registro)

Frontend Vue 3 con TypeScript y Composition API

Diseño responsive con Bootstrap 5

Rutas protegidas con Vue Router

Interfaz de tablero Kanban (PublishingPlatformBoard)

Conexión backend-frontend con Axios

Manejo de estado con localStorage para tokens JWT

🚧 Próximas Funcionalidades
CRUD completo de tableros

CRUD de tareas con drag & drop

Sistema de asignación de tareas a usuarios

Compartir tableros con equipo

Filtros y búsqueda avanzada

Notificaciones en tiempo real

Despliegue en producción



---

## 🙋‍♂️ Autor

**Antonio Ramírez**  
GitHub: [@tonyramirezs135](https://github.com/tonyramirezs135)

---

## 🔒 Seguridad

- Contraseñas encriptadas con `bcryptjs`
- Autenticación con `JWT`
- Variables sensibles ocultas en `.env` (ver `.gitignore`)

---
