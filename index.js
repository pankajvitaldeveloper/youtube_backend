import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import connection from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import videoRoutes from "./routes/videoRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"


const app = express();
const port = process.env.PORT || 5000;

connection(); 

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working");
});

// authRouter
app.use('/auth', authRoutes)

//videoRouter
app.use('/api', videoRoutes)

//commentRouter
app.use('/api', commentRoutes)

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
