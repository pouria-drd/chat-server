import User from "@/models/user.model";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        const user = new User({
            username,
            email,
            password,
            firstName,
            lastName,
        });

        await user.save();

        const token = user.generateAuthToken();

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
                token,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = user.generateAuthToken();

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
                token,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};
