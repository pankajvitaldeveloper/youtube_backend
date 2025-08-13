import Video from "../models/Video.js";
// create video
// export const createVideo = async (req, res) => {
//   const { title, thumbnailUrl, description, videoUrl, channelId } = req.body;

//   try {
//     // insert in to Db
//     const newVideo = await Video.create({
//       title, 
//       thumbnailUrl,
//       description,
//       videoUrl,
//       channelId,
//       uploader: req.user.userId // automatically from token
//     });

//     res.status(201).json({
//       message: "New Video Uploaded Successfully",
//       video: newVideo
//     });
//   } catch (err) {
//     console.error("fetch video create error", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

export const createVideo = async (req, res) => {
  try {
    let videos = req.body;

    // If single object, make it an array
    if (!Array.isArray(videos)) {
      videos = [videos];
    }

    // Add uploader from token or fallback for testing
    videos = videos.map(v => ({
      ...v,
      uploader: req.user?.userId || "user01"
    }));

    const newVideos = await Video.insertMany(videos);
    res.status(201).json({
      message: "Videos inserted successfully",
      videos: newVideos
    });
  } catch (err) {
    console.error("Video create error", err);
    res.status(500).json({ message: "Server Error" });
  }
};





//Get all video data from db
export const getVideoAll = async (req, res) => {
    try {
        const videoAllData = await Video.find();
        res.status(200).json({
            message: "All Data Fetch Successfully",
            videoAllData
        });
    } catch (err) {
        console.error("fetch video all data error:", err);
        res.status(500).json({
            message: "Failed to fetch video data",
            error: err.message
        });
    }
};

//Get video data By Id in db
export const getVideoById = async (req, res) => {
    try{
        const videoById = await Video.findById(req.params.id);
        if(!videoById){
            return res.status(404).json({message:"Video Not Found"})
        }
        res.status(200).json({message:"fetch Data Video Successfully By Id", videoById})
    }
    catch(err){
        console.log("fetch data video by id failed")
        res.status(500).json({message:"Failed to fetch video data by Id",error:err.message})
    }
}

// Get Video update By id in db
export const updateVideoById = async (req,res) => {
    try{
        const update = await Video.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!update) return res.status(404).json({message:"Update id not found"});
        res.status(200).json({message:"Update Successfully", update})
    }
    catch(err){
        console.log("Update Failed")
        res.status(500).json({message:"Update Failed",error: err.message})
    }
}

// Delete Video By Id in Db
export const deleteVideoById = async (req,res) => {
    try{
        const videoDelete = await Video.findByIdAndDelete(req.params.id);
        if(!videoDelete) return res.status(404).json({message:"Delete id not found"})
        res.status(200).json({message:"Deleted Successfully",videoDelete})
    }
    catch(err){
        console.log("Delete Failed");
        res.status(500).json({message:"Delete Failed Error"})
    }
}


// Video Get by category wise
export const videoByCategory = async (req, res) => {
    try {
        const categoryName = req.params.category;

        // Case-insensitive exact match for category
        const videos = await Video.find({
            category: { $regex: new RegExp(`^${categoryName}$`, "i") }
        });

        if (!videos || videos.length === 0) {
            return res.status(404).json({ message: "No videos found for this category" });
        }

        res.status(200).json({
            message: `Videos in ${categoryName} category fetched successfully`,
            videos
        });

    } catch (err) {
        console.error("Category fetch error:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};




// youtube search bar all data fetch from db 
export const searchVideos = async (req, res) => {
    try {
        const query = req.params.query;

        const videos = await Video.find({
            $or: [
                { category: { $regex: query, $options: "i" } },
                { title: { $regex: query, $options: "i" } },
                { channelId: { $regex: query, $options: "i" } }
            ]
        });

        if (videos.length === 0) {
            return res.status(404).json({ message: "No videos found" });
        }

        res.status(200).json({
            message: "Search successful",
            results: videos
        });
    } catch (err) {
        console.error("Search failed", err);
        res.status(500).json({ message: "Search failed", error: err.message });
    }
};


// Increment Views
export const incrementViews = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Add unique view (one per user)
    if (!video.viewers.includes(userId)) {
      video.viewers.push(userId);
      await video.save();
    }

    res.status(200).json({
      message: "View count updated",
      views: video.viewers.length // count based on array length
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating views",
      error: err.message
    });
  }
};




// Increment Likes
// Clicking once → adds like/dislike.
// Clicking again → removes it.
// Switching between like/dislike updates counts correctly.
export const toggleLike = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.userId; // from JWT auth middleware

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const likedIndex = video.likes.indexOf(userId);
    if (likedIndex > -1) {
      // Already liked → remove like
      video.likes.splice(likedIndex, 1);
    } else {
      // Add like and remove from dislikes
      video.likes.push(userId);
      video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
    }

    await video.save();
    res.json({ message: "Like status updated", likesCount: video.likes.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Increment Dislikes
export const toggleDislike = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.userId;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const dislikedIndex = video.dislikes.indexOf(userId);
    if (dislikedIndex > -1) {
      // Already disliked → remove dislike
      video.dislikes.splice(dislikedIndex, 1);
    } else {
      // Add dislike and remove from likes
      video.dislikes.push(userId);
      video.likes = video.likes.filter(id => id.toString() !== userId);
    }

    await video.save();
    res.json({ message: "Dislike status updated", dislikesCount: video.dislikes.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};