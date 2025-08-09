import mongoose from "mongoose";

const connection = async () => {
  if (!process.env.DB_URL) {
    console.error("DB_URL not passed to DB connection.");
    return;
  }

  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

export default connection;


