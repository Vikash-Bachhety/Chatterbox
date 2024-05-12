import { useEffect, useState } from "react";
import io from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io("chatterbox-production.up.railway.app" || "http://localhost:3000");

    // Save the socket instance to state
    setSocket(newSocket);

    // Clean up function to disconnect the socket when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []); // Run this effect only once on component mount

  return socket;
};

export default useSocket;
