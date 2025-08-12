import Video from "../models/Video.js";

export const createVideo = async (req, res) => {
  const { title, thumbnailUrl, description, videoUrl, channelId } = req.body;

  try {
    const newVideo = await Video.create({
      title,
      thumbnailUrl,
      description,
      videoUrl,
      channelId,
      uploader: req.user.userId // automatically from token
    });

    res.status(201).json({
      message: "New Video Uploaded Successfully",
      video: newVideo
    });
  } catch (err) {
    console.error("fetch video create error", err);
    res.status(500).json({ message: "Server Error" });
  }
};
