# 🧩 TaskBoard - Gestor de Tareas estilo Trello

Aplicación web fullstack inspirada en Trello. Permite a los usuarios registrarse, iniciar sesión, crear tableros y gestionar tareas en equipo.

---

## 🚀 Tecnologías utilizadas

### 🖥️ Frontend (client/)
- Vue 3
- Vite
- TypeScript
- Axios

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
├── client/         → Vue + Vite (Frontend)
├── server/         → Node + Express (Backend)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── .env            ← ❌ no se sube a GitHub
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

## 📌 Roadmap

- [x] Backend con autenticación JWT
- [ ] CRUD de tableros
- [ ] CRUD de tareas
- [ ] Drag & drop de tareas
- [ ] Compartir tableros
- [ ] Filtros y búsqueda
- [ ] Despliegue en Render (backend) y Vercel (frontend)

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
