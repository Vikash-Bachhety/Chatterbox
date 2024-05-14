import express from "express";
import connection from "./db/createDatabase.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";
import {app, server, io} from "./socket/socket.js"

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(cors({ 
  origin: "*",
  credentials: true 
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

server.listen(PORT, () => {
  connection();
  console.log(`Server connected at port ${PORT}`);
});
