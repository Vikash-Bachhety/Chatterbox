import axios from "axios";
import { useState } from "react";

const useFetchConversation = () => {
  const [conversation, setConversation] = useState([]);

  const fetchConversation = async (selectedUserId) => {
    try {
      // Get the token from wherever you store it (e.g., localStorage)
      const token = localStorage.getItem("token");

      // Set up the headers with the token
      const headers = {
        Authorization: `${token}`,
      };

      const response = await axios.get(
        `chatterbox-production.up.railway.app/api/message/${selectedUserId}` || 
        `http://localhost:3000/api/message/${selectedUserId}`,
        { headers }
      );

      if (response && response.data) {
        setConversation(response.data);
      } else {
        // If no messages are present, set conversation state to an empty array
        setConversation("");
      }
    } catch (error) {
      console.log("Error fetching conversation:", error.message);
    }
  };

  return { fetchConversation, setConversation, conversation };
};

export default useFetchConversation;
