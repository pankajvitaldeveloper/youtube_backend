import express from "express";
const router = express.Router();
import { auth } from "../middlewars/authMiddleware.js";
import { createVideo } from "../controllers/videoController.js";

router.post('/video',auth, createVideo);


export default router;