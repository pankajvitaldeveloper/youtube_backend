import express from "express";
const router = express.Router();
import { auth } from "../middlewars/authMiddleware.js";
import { createVideo, deleteVideoById, getVideoAll, getVideoById, updateVideoById, searchVideos, videoByCategory, incrementViews, toggleLike, toggleDislike } from "../controllers/videoController.js";

router.post('/video',auth, createVideo);
router.get('/video-all', getVideoAll);
router.get('/video/:id', getVideoById)
router.put('/video/:id', auth, updateVideoById)
router.delete('/video/:id', auth, deleteVideoById)
router.get('/videos/search/:query', auth, searchVideos);
router.get("/videos/category/:category", auth, videoByCategory);

// views - likes - dislike api below
router.put("/videos/:id/views", auth, incrementViews);
router.put("/videos/:id/like", auth, toggleLike);
router.put("/videos/:id/dislike", auth, toggleDislike);



export default router;