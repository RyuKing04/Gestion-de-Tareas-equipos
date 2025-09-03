import express from 'express';
import { register, login, getUsers } from '../controllers/authController.js';
import { get } from 'mongoose';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users',getUsers)
export default router;
// This code defines the authentication routes for user registration and login.