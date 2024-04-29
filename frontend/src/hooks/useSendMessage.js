import { useState } from "react";
import axios from "axios";

const useSendMessage = () => {
  const [message, setMessage] = useState("");

  const sendMessage = async (selectedUserId, conversation, setConversation) => {
    if (!message.trim() || !selectedUserId) {
      return; // Don't send empty message or if no user is selected
    }
    
    try {
      const response = await axios.post(
        `http://localhost:3000/api/message/sent/${selectedUserId}`,
        { message }
      );
      
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Error sending message: " + response.statusText);
      }

      // Create a new conversation array if no previous conversation exists
      const newMessage = {
        id: response.data.id, // Assuming the response contains an id
        message: response.data.message,
        createdAt: response.data.createdAt
      };
      
      const updatedConversation = conversation ? [...conversation, newMessage] : [newMessage];
      
      // Update the conversation state with the new message
      setConversation(updatedConversation);
      
      // Clear the input after sending the message
      setMessage("");
    } catch (error) {
      console.log("Error sending message:", error.message);
    }
  };

  return { message, setMessage, sendMessage };
};

export default useSendMessage;
