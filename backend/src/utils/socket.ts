import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { Message } from "../models/Message";
import { Chat } from "../models/Chat";
import { User } from "../models/User";

// Store online users in a Map where the key is the user ID and the value is the socket ID
export const onlineUsers: Map<string, string> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {
  const allowedOrigins = [
    "http://localhost:5173", // Vite Web App
    "http://localhost:8081", // Expo Mobile App
    process.env.FRONTEND_URL, // Production Frontend URL
  ].filter(Boolean) as string[];

  const io = new SocketServer(httpServer, { cors: { origin: allowedOrigins } });

  // Verify token and authenticate user
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY as string,
      });

      const clerkId = session.sub;

      const user = await User.findOne({ clerkId });
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.data.userId = user._id.toString();
      next();
    } catch (error: any) {
      next(new Error(error));
    }
  });

  // When new client connects, add them to the online users map and emit the updated list of online users
  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("user-online", { userId });
    socket.join(`user:${userId}`);

    socket.on("join-chat", (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });
    socket.on("leave-chat", (chatId: string) => {
      socket.leave(`chat:${chatId}`);
    });

    socket.on(
      "send-message",
      async (data: { chatId: string; text: string }) => {
        try {
          const { chatId, text } = data;

          const chat = await Chat.findOne({
            _id: chatId,
            participants: userId,
          });

          if (!chat) {
            socket.emit("socket-error", { message: "Chat not found" });
            return;
          }

          const message = await Message.create({
            chat: chatId,
            sender: userId,
            text,
          });

          chat.lastMessage = message._id;
          chat.lastMessageAt = new Date();
          await chat.save();

          await message.populate("sender", "name avatar");

          io.to(`chat:${chatId}`).emit("new-message", message);

          for (const participantId of chat.participants) {
            io.to(`user:${participantId}`).emit("new-message", message);
          }
        } catch (error) {
          socket.emit("socket-error", { message: "Failed to send message" });
        }
      },
    );

    socket.on("typing", async (data) => {});

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      socket.broadcast.emit("user-offline", { userId });
    });
  });

  return io;
};
