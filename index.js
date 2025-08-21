import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";
import connection from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import videoRoutes from "./routes/videoRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import channelRoutes from "./routes/channelRoutes.js"


const app = express();
const port = process.env.PORT || 5000;

connection(); 

app.use(express.json());
app.use(cors())


app.get("/", (req, res) => {
  res.send("API is working");
});

// authRouter
app.use('/auth', authRoutes)

//videoRouter
app.use('/api', videoRoutes)

//commentRouter
app.use('/api', commentRoutes)

//channelRouter
app.use('/api',channelRoutes)


app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
