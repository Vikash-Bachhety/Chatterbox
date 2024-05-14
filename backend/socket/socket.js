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
  // Fetch previous messages from the database
  try {
    const previousMessages = await Message.find({ /* Add your query to filter messages */ }).populate('sender');
    socket.emit('previous messages', previousMessages);
  } catch (error) {
    console.error('Error retrieving previous messages:', error);
  }

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

  // Event listener for when a user disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

export { app, server, io };
