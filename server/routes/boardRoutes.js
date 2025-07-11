import express from "express";
import { createBoard, getBoards, deleteBoard } from "../controllers/boardController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, createBoard);
router.get("/", verifyToken, getBoards);
router.delete("/:id", verifyToken, deleteBoard);

export default router;
