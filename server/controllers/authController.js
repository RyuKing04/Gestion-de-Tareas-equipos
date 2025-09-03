import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const user = await User.create({
      nombre,
      email,
      password,
    });

    res.status(201).json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    
    // Verificar usuario y contraseña (sin bcrypt por ahora)
    if (!user) {
      return res.status(401).json({ message: 'Email o contraseña inválidos' });
    }

    // Comparación simple de contraseña (para desarrollo)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Email o contraseña inválidos' });
    }

    res.json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
// controllers/userController.js
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'nombre email')
      .sort({ nombre: 1 });
    
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};