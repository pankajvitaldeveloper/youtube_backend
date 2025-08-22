import { getMe, login, register } from "../controllers/authController.js";
import express from "express";
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get("/me", getMe);


export default router

