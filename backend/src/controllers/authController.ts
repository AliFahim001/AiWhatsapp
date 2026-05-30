import type { AuthRequest } from "../middleware/auth";
import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { getAuth, clerkClient } from "@clerk/express";

export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-clerkId -__v");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getMe controller:", error);
    res.status(500);
    next();
  }
}

export async function authCallBack(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      res.status(401).json({ message: "Clerk ID not found in request" });
      return;
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);

      user = await User.create({
        clerkId,
        name: clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
          : clerkUser.emailAddresses[0]?.emailAddress.split("@")[0],
        email: clerkUser.emailAddresses[0]?.emailAddress,
        avatar: clerkUser.imageUrl,
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
}
