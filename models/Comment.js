import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // null = top-level
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Comment", commentSchema);
