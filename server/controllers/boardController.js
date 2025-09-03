import Board from "../models/Board.js";

export const createBoard = async (req, res) => {
  try {
    const { nombre, descripcion, prioridad, fecha_limite, miembros } = req.body;
    
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ message: "El nombre del tablero es requerido" });
    }

    // Crear array de miembros: incluir al creador + los miembros seleccionados
    const miembrosIds = Array.isArray(miembros) ? miembros : [];
    if (!miembrosIds.includes(req.user._id.toString())) {
      miembrosIds.push(req.user._id);
    }

    const board = new Board({
      nombre: nombre.trim(),
      descripcion: descripcion || '',
      prioridad: prioridad || 'media',
      fecha_limite: fecha_limite || null,
      creador: req.user._id,
      miembros: miembrosIds, // Usar los IDs de miembros proporcionados
      estado: 'nuevo'
    });
    
    await board.save();
    
    // Hacer populate de creador Y miembros
    await board.populate('creador', 'nombre email');
    await board.populate('miembros', 'nombre email');
    
    res.status(201).json(board);
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ miembros: req.user._id })
      .populate('creador', 'nombre email')
      .populate('miembros', 'nombre email') // Asegurar populate de miembros
      .sort({ estado: 1, prioridad: -1, fecha_creacion: -1 });
    
    res.json(boards);
  } catch (err) {
    console.error("Error getting boards:", err);
    res.status(500).json({ error: "Error al obtener tableros" });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    
    const board = await Board.findById(id);
    
    if (!board) {
      return res.status(404).json({ message: "Tablero no encontrado" });
    }
    
    if (board.creador.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No tienes permiso para eliminar este tablero" });
    }
    
    await Board.findByIdAndDelete(id);
    res.json({ message: "Tablero eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ message: "Error al eliminar el tablero" });
  }
};

// NUEVO: Actualizar estado del tablero
export const updateBoardStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['nuevo', 'pendiente', 'completado'].includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const board = await Board.findByIdAndUpdate(
      id,
      { 
        estado,
        fecha_actualizacion: new Date(),
        ultimo_seguimiento: new Date()
      },
      { new: true, runValidators: true }
    ).populate('creador', 'nombre email');

    if (!board) {
      return res.status(404).json({ message: "Tablero no encontrado" });
    }

    res.json(board);
  } catch (error) {
    console.error("Error updating board status:", error);
    res.status(500).json({ message: "Error al actualizar el estado" });
  }
};

// NUEVO: Actualizar cualquier campo del tablero
export const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const board = await Board.findByIdAndUpdate(
      id,
      { 
        ...updates,
        fecha_actualizacion: new Date()
      },
      { new: true, runValidators: true }
    ).populate('creador', 'nombre email');

    if (!board) {
      return res.status(404).json({ message: "Tablero no encontrado" });
    }

    res.json(board);
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ message: "Error al actualizar el tablero" });
  }
  
};
// Función para verificar recordatorios (ejecutar periódicamente)
export const checkReminders = async () => {
  try {
    const unaSemanaAtras = new Date();
    unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);
    
    const ticketsParaRecordar = await Board.find({
      estado: { $in: ['nuevo', 'pendiente'] },
      ultimo_seguimiento: { $lte: unaSemanaAtras }
    }).populate('creador', 'email nombre');
    
    // Aquí podrías enviar emails o notificaciones
    console.log(`Tickets que necesitan seguimiento: ${ticketsParaRecordar.length}`);
    
    // Actualizar fecha de último seguimiento
    for (const ticket of ticketsParaRecordar) {
      ticket.ultimo_seguimiento = new Date();
      await ticket.save();
    }
    
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};