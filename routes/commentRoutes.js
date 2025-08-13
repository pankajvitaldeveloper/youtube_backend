import express from "express";
import {auth} from "../middlewars/authMiddleware.js";
import {
  addComment,
  getCommentsWithReplies,
  updateComment,
  deleteComment
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/comments", auth, addComment); // add comment or reply
router.get("/comments/:videoId", getCommentsWithReplies); // get comments + replies
router.put("/comments/:id", auth, updateComment);
router.delete("/comments/:id", auth, deleteComment);

export default router;
