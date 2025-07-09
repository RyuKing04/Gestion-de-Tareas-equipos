import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const register= async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if(existingUser) return res.status(400).json({ message: "Usuario ya existe" });

        const hasedPassword= await bcrypt.hash(password,10);
        const usuarioNuevo=  await User.create({
            nombre,
            email,
            password: hasedPassword,  
        });

        // Generar token
        const token= generateToken(usuarioNuevo._id);
        res.status(201).json({
            usuario: usuarioNuevo, token
        });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error al registrar usuario" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Verificar si el usuario existe
        const usuario = await User.findOne({ email });
        if (!usuario) return res.status(400).json({ message: "Usuario no encontrado" });
        // Verificar la contraseña
        const valido = await bcrypt.compare(password, usuario.password);
        if (!valido) return res.status(400).json({ message: "Contraseña incorrecta" });
        // Generar token
        const token= generateToken(usuario._id);
        res.status(200).json({
            usuario,token});
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }   
};
