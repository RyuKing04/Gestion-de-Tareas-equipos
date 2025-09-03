import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Cambiado a import default

export const verifyToken = async (req, res, next) => {
  try {
    // Obtener el token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar el usuario y adjuntarlo a la request
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token inválido. Usuario no encontrado.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error en verifyToken:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado.' });
    }
    
    res.status(500).json({ message: 'Error del servidor en autenticación.' });
  }
};