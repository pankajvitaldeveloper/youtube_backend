import Video from "../models/Video.js";
// create video
export const createVideo = async (req, res) => {
  const { title, thumbnailUrl, description, videoUrl, channelId } = req.body;

  try {
    // insert in to Db
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


