import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: String,
    thumbnailUrl: String,
    description: String,
    videoUrl: String,
    // ✅ Proper reference to Channel
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel"},
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    category: { type: String, default: "Uncategorized" },
    uploadDate: { type: Date, default: Date.now }
});

export default mongoose.model("Video", videoSchema);
