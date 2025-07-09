// # 🧩 TaskBoard - Gestor de Tareas estilo Trello
// Aplicación web fullstack inspirada en Trello. Permite a los usuarios registrarse, iniciar sesión, crear tableros y gestionar tareas en equipo.

// ## 🚀 Tecnologías utilizadas
// Frontend: Vue 3 + Vite + TypeScript
// Backend: Node.js + Express + MongoDB Atlas
// Autenticación: JWT + bcryptjs

// ## 📁 Estructura del Proyecto
// project-root/
// ├── client/         → Vue + Vite (Frontend)
// ├── server/         → Node + Express (Backend)
// │   ├── controllers/
// │   ├── models/
// │   ├── routes/
// │   ├── middleware/
// │   ├── utils/
// │   ├── .env            ← ❌ no se sube a GitHub
// │   ├── app.js
// │   └── server.js
// ├── README.md
// └── .gitignore

// ## ⚙️ Instalación y ejecución local
// 1. Clonar el repositorio y entrar a la carpeta
// 2. Instalar dependencias en /server y /client
// 3. Crear archivo .env en /server con las siguientes claves:
//    - PORT=5000
//    - MONGO_URI=...
//    - JWT_SECRET=...
// 4. Ejecutar backend con: npx nodemon server.js
// 5. Ejecutar frontend con: npm run dev

// ## 🔐 Endpoints
// POST /api/register  → registro de usuario
// POST /api/login     → login de usuario

// ## 📌 Roadmap de desarrollo
// - [x] Backend funcional con autenticación JWT
// - [ ] CRUD de tableros
// - [ ] CRUD de tareas
// - [ ] Sistema de arrastrar y soltar tareas
// - [ ] Compartir tableros entre usuarios
// - [ ] Despliegue: Backend (Render) | Frontend (Vercel)

// ✅ Paso 1: Inicializar backend con Node.js + Express
// ✅ Paso 2: Conectar con MongoDB Atlas usando Mongoose
// ✅ Paso 3: Crear modelo de Usuario, autenticación con JWT (registro/login)
// ✅ Paso 4: Crear modelos de Tablero y Tarea con sus rutas protegidas
// ✅ Paso 5: Crear el frontend en Vue con autenticación y CRUD de tareas/tableros
// ✅ Paso 6: Integrar frontend y backend (axios)
// ✅ Paso 7: Desplegar backend en Render y frontend en Vercel
