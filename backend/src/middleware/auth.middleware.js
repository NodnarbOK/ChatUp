import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        // Check if user has token
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({message: "Unauthorized Access - No Token Provided"});
        }
        // Check if token matches secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
           return res.status(401).json({message: "Unauthorized Access - Invalid Token"}); 
        }
        // Get user data except for password to add to the request
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
           return res.status(404).json({message: "User Not Found"}); 
        } 
        
        req.user = user;
        // Moves on to the next function with the user in the request
        next()

    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}