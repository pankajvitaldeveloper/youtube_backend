import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
export const createChannel = async (req,res) => {
    try{
        const {name, description} = req.body;
        const ownerId = req.user.userId;
        const existing = await Channel.findOne({owner: ownerId});
        if(existing){
            return res.status(400).json({message:"User already has a channel"})
        }
        const newChannel = await Channel.create({
            name, description, owner: ownerId
        })
        res.status(200).json({message:"Created Channel Successfully",newChannel})

    }
    catch(err){
        res.status(500).json({message:"Server Error in Channel", error:err.message})
    }
}


export const getChannelAll = async(req,res) => {
    try{
        const channel = await Channel.find();
        res.status(200).json({message:"Fetch Data Successfully", channel})
    }
    catch(err){
        res.status(500).json({message:"Server Error Get Channel All Failed"})
    }
}

// export const getChannelInfo = async(req, res) => {
//     try{
//         const channel = await Channel.findById(req.params.id)
//         .populate("owner","username email")
//         .populate("subscribers","username")
//         if(!channel){
//             res.status(400).json({message:"Channel Not Found"})
//         }
//         res.status(200).json({message:"Fetch data successfully", channel})
//     }
//     catch(err){
//         res.status(500).json({message:"Server Error GetchannelInfo"})
//     }
// }

export const getChannelInfo = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username email")
      .populate("subscribers", "username");

    if (!channel) {
      return res.status(404).json({ message: "Channel Not Found" });
    }

    // also fetch videos by channel
    const videos = await Video.find({ channelId: channel._id }).select("title thumbnailUrl createdAt");

    res.status(200).json({
      message: "Fetch data successfully",
      channel: {
        ...channel.toObject(),
        videos, // attach videos here
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error GetChannelInfo", error: err.message });
  }
};


// Toggle subscription
export const toggleSubscription = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware
    const channelId = req.params.id;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const isSubscribed = channel.subscribers.includes(userId);

    if (isSubscribed) {
      // Unsubscribe
      channel.subscribers = channel.subscribers.filter(
        (sub) => sub.toString() !== userId
      );
      await channel.save();
      return res.status(200).json({
        message: "Unsubscribed successfully",
        subscribersCount: channel.subscribers.length
      });
    } else {
      // Subscribe
      channel.subscribers.push(userId);
      await channel.save();
      return res.status(200).json({
        message: "Subscribed successfully",
        subscribersCount: channel.subscribers.length
      });
    }
  } catch (err) {
    console.error("Error toggling subscription:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// update the channel
export const updateChannel = async (req, res) => {
  try {
    const { name, description, bannerImage, profileImage } = req.body;
    const channelId = req.params.id;
    const userId = req.user.userId; 

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Check if logged-in user is the owner
    if (channel.owner.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this channel" });
    }

    // Update fields only if provided
    if (name) channel.name = name;
    if (description) channel.description = description;
    if (bannerImage) channel.bannerImage = bannerImage;
    if (profileImage) channel.profileImage = profileImage;

    await channel.save();

    res.status(200).json({ message: "Channel updated successfully", channel });
  } catch (err) {
    res.status(500).json({ message: "Error updating channel", error: err.message });
  }
};



// Delete the channel from db
export const deleteChannel = async (req, res) => {
  try {
    const channelId = req.params.id;
    const userId = req.user.userId;

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Only owner can delete
    if (channel.owner.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this channel" });
    }

    // Delete the channel
    await Channel.findByIdAndDelete(channelId);
    // Delete all videos linked to this channel
    await Video.deleteMany({ channelId });

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting channel", error: err.message });
  }
};
