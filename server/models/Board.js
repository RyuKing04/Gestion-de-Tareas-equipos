import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    default: ''
  },
  estado: {
    type: String,
    enum: ['nuevo', 'pendiente', 'completado'],
    default: 'nuevo'
  },
  prioridad: {
    type: String,
    enum: ['baja', 'media', 'alta'],
    default: 'media'
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  miembros: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  fecha_limite: {
    type: Date,
    default: null
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  fecha_actualizacion: {
    type: Date,
    default: Date.now
  },
  ultimo_seguimiento: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Middleware para actualizar fecha_actualizacion
boardSchema.pre('save', function(next) {
  this.fecha_actualizacion = new Date();
  next();
});

export default mongoose.model('Board', boardSchema);