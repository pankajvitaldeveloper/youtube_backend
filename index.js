import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import connection from "./config/db.js";

const app = express();
const port = process.env.PORT || 5000;

connection(); 

app.get("/", (req, res) => {
  res.send("API is working");
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
