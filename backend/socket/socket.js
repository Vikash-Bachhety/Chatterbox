import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', async (socket) => {
  // Event listener for when a user sends a message
  socket.on('chat message', async (data) => {
    try {
      // Store the message in the database
      const newMessage = await Message.create({
        sender: socket.id,
        reciever: data.recipientId,
        message: data.message,
      });

      // Find or create conversation
      let conversation = await Conversation.findOne({
        participants: { $all: [socket.id, data.recipientId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [socket.id, data.recipientId],
          messages: [newMessage._id],
        });
      } else {
        conversation.messages.push(newMessage._id);
        await conversation.save();
      }

      // Broadcast the message to all connected clients
      io.emit('chat message', newMessage);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  // Event listener for when a user requests previous messages
  socket.on('get previous messages', async ({ userId, partnerId }) => {
    try {
      // Find conversation where both userId and partnerId are participants
      const conversation = await Conversation.findOne({
        participants: { $all: [userId, partnerId] },
      }).populate("messages");

      if (conversation) {
        // If conversation is found, send back the messages
        const messages = conversation.messages;
        socket.emit('previous messages', messages);
      } else {
        // If conversation is not found, send appropriate message
        socket.emit('previous messages', []);
      }
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error in receive message controller:", error);
      // You can emit an error event to the client if needed
      socket.emit('error', 'Failed to fetch previous messages');
    }
  });

  // Event listener for when a user disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

export { app, server, io };
