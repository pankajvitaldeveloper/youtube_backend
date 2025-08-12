import express from "express";
const router = express.Router();
import { auth } from "../middlewars/authMiddleware.js";
import { createVideo, deleteVideoById, getVideoAll, getVideoById, updateVideoById } from "../controllers/videoController.js";

router.post('/video',auth, createVideo);
router.get('/video-all', auth, getVideoAll);
router.get('/video/:id', auth, getVideoById)
router.put('/video/:id', auth, updateVideoById)
router.delete('/video/:id', auth, deleteVideoById)


export default router;