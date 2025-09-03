import express from "express";
import { 
  createBoard, 
  getBoards, 
  deleteBoard, 
  updateBoardStatus,
  updateBoard 
} from "../controllers/boardController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, createBoard);
router.get("/", verifyToken, getBoards);
router.delete("/:id", verifyToken, deleteBoard);
router.patch("/:id/estado", verifyToken, updateBoardStatus); // Nueva ruta para estado
router.put("/:id", verifyToken, updateBoard); // Nueva ruta para actualizar

export default router;