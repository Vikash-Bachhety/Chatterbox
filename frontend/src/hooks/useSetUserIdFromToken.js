import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const useSetUserIdFromToken = () => {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userID = decodedToken.userId;
      setUserId(userID);
    }
  }, []);

  return { userId };
};

export default useSetUserIdFromToken;
