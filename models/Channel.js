import mongoose from "mongoose";
const channelSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, default: ""},
    owner: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    bannerImage: {type: String, default:""},
    profileImage: {type: String, default:""},
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: {type: Date, default: Date.now}
})

export default mongoose.model("Channel", channelSchema)