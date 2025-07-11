import { Board } from "../models/Board";

export const createBoard=async (req, res)=>{
    try{
        const {nombre}= req.body;
        const board= new Board({
            nombre,
            creador: req.user.id,
            miembros: [req.user.id]
        });
        await board.save();
        res.status(201).json(board);
    } catch (error) {
        console.error("Error creating board:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getBoards= async(req,res)=>{

    try{
        const boards= await Board.find({miembres: req.userId});
        res.json(boards);
    }catch(err){
        res.status(500).json({error:"Error al obtener tableros"});
    }
};


