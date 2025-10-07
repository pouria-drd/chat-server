import { Request, Response } from "express";

export const getUsersChats = async (req: Request, res: Response) => {
    const loggedInUser = req.user;
};
