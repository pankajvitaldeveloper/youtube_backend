import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req,res) => {
    const {username, email, password} = req.body;

    
    try{
        // Find email
        const user = await User.findOne({email})
        if(user){
           return res.status(400).json({
                message: "User already exists"
            })
        }
        // Password convert
        const hashPassword = await bcrypt.hash(password, 10)

        // Save data in db
        const data = await User.create({
            username,
            email,
            password: hashPassword
        });

         res.status(200).json({message: "User Register Successful", data})
    }
    catch(err){
        console.error("Register error", err)
        res.status(500).json({ message: "Server error" });

    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check all fields
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Success
        res.status(200).json({
            message: "Login Successful",
            user,
            token
        });

    } catch (err) {
        console.error("Login error", err);
        res.status(500).json({ message: "Server error" });
    }
};


export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("username profileImage email");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};