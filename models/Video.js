import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  channelId: { type: String, required: true },
  uploader: { type: String, required: true }, // userId of uploader
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now },
  comments: [
    {
      commentId: String,
      userId: String,
      text: String,
      timestamp: Date
    }
  ]
});

export default mongoose.model('Video', videoSchema);
