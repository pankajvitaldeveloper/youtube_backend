import express from "express";
import { createChannel, deleteChannel, getChannelAll, getChannelInfo, toggleSubscription, updateChannel } from "../controllers/channelController.js";
import { auth } from "../middlewars/authMiddleware.js";
const router = express.Router();

router.post('/channel',auth, createChannel)
router.get('/channel/:id',getChannelInfo)
router.get('/channel', getChannelAll)
router.put("/channel/:id/subscribe", auth, toggleSubscription);

router.put('/channel/:id', auth, updateChannel);
router.delete('/channel/:id', auth, deleteChannel);

 
export default router;