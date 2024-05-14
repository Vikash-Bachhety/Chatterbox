import http from "http";
import express from "express";
import { Server } from "socket.io";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // console.log('User connected:', socket.id);

  // Event listener for when a user sends a message
  socket.on("chat message", async (data) => {
    // console.log('Received message:', data);

    try {
      // Find or create conversation
      let conversation = await Conversation.findOne({
        participants: { $all: [socket.id, data.recipientId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [socket.id, data.recipientId],
          // messages: [newMessage._id],
        });
      }
        // Store the message in the database
        const newMessage = await Message.create({
          sender: socket.id,
          reciever: data.recipientId,
          message: data.message,
        });

        if (newMessage) {
          conversation.messages.push(newMessage._id);
          await conversation.save();
      }
      // Broadcast the message to all connected clients
      io.emit("chat message", newMessage);
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  // Event listener for when a user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { app, server, io };
