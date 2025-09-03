import dotenv from 'dotenv';
dotenv.config(); // Esto tiene que ir al principio

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';  
import boardRoutes from './routes/boardRoutes.js'
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Rutas de autenticación
app.use('/api', authRoutes);
app.use('/api/boards', boardRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
  })
  .catch((err) => {
    console.error('❌ Error de conexión a MongoDB:', err.message);
  });


app.get('/', (req, res) => {
  res.send('Servidor API funcionando correctamente ✅');
});

export default app;
