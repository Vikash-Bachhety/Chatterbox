import http from 'http';
import express from 'express';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Event listener for when a user sends a message
  socket.on('message', (message) => {
    console.log('Received message:', message);
    // Broadcast the message to all connected clients
    io.emit('message', message);
  });

  // Event listener for when a user disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

export { app, server, io };
