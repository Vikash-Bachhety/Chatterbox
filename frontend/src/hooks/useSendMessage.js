import { useState } from "react";
import useSocket from "./useSocket";

const useSendMessage = () => {
  const [message, setMessage] = useState("");
  const socket = useSocket();

  const sendMessage = (selectedUserId) => {
    if (!message.trim() || !selectedUserId) {
      return; // Don't send empty message or if no user is selected
    }
    
    // Emit a 'chat message' event to the server with the message content
    socket.emit('chat message', {
      recipientId: selectedUserId,
      message: message,
    });

    console.log(socket.emit);

    // Clear the input after sending the message
    setMessage("");
  };

  return { message, setMessage, sendMessage };
};

export default useSendMessage;
