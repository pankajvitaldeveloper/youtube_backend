
import Comment from "../models/Comment.js";

// Add comment or reply
export const addComment = async (req, res) => {
  try {
    const { videoId, text, parentCommentId } = req.body;
    const userId = req.user.userId;

    const newComment = new Comment({
      videoId,
      userId,
      text,
      parentCommentId: parentCommentId || null
    });

    await newComment.save();

    res.status(201).json({
      message: parentCommentId ? "Reply added" : "Comment added",
      comment: newComment
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
};

// Get all comments with replies for a video
export const getCommentsWithReplies = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Fetch all comments for this video
    const allComments = await Comment.find({ videoId })
      .populate("userId", "username")
      .sort({ timestamp: -1 });

    // Separate top-level and replies
    const commentsMap = {};
    allComments.forEach(comment => {
      commentsMap[comment._id] = { ...comment.toObject(), replies: [] };
    });

    // Attach replies to their parent
    const topLevelComments = [];
    allComments.forEach(comment => {
      if (comment.parentCommentId) {
        commentsMap[comment.parentCommentId]?.replies.push(commentsMap[comment._id]);
      } else {
        topLevelComments.push(commentsMap[comment._id]);
      }
    });

    res.status(200).json({ message: "Comments with replies fetched", comments: topLevelComments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
};

// Update comment (only if user is owner)
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    const comment = await Comment.findOne({ _id: id, userId });
    if (!comment) return res.status(404).json({ message: "Comment not found or unauthorized" });

    comment.text = text;
    await comment.save();

    res.status(200).json({ message: "Comment updated", comment });
  } catch (err) {
    res.status(500).json({ message: "Error updating comment", error: err.message });
  }
};

// Delete comment and its replies
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const comment = await Comment.findOne({ _id: id, userId });
    if (!comment) return res.status(404).json({ message: "Comment not found or unauthorized" });

    // Delete this comment and all replies
    await Comment.deleteMany({
      $or: [
        { _id: id },
        { parentCommentId: id }
      ]
    });

    res.status(200).json({ message: "Comment and replies deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment", error: err.message });
  }
};
