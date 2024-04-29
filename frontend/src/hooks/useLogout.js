import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    try {
      localStorage.removeItem("token");
      navigate("/Login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return logout;
};

export default useLogout;
