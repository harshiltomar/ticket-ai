import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { inngest } from "../inngest/client";

export const signup = async ( req, res ) => {
    const { email, password, skills =[] } = req.body;

    try {
        const hashed = bcrypt.hash(password, 10);
        const user = User.create({ email, password: hashed, skills });

        // Fire the ingest event
        await inngest.send({
            name: "user/signup",
            data: { email },
        });

        const token = jwt.sign(
            {_id: user._id, role: user.role},
            process.env.JWT_SECRET,
        )

        res.status(201).json({ token });
        
    } catch (error) {
        res.status(500).json({ message: "Error signing up" });
    }
}

export const login = async ( req, res ) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {_id: user._id, role: user.role},
            process.env.JWT_SECRET,
        )

        res.status(201).json({ token });
        
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
}

export const logout = async ( req, res ) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if(!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({ error: "Unauthorized" });
        }); 
        
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed" });
    }
}