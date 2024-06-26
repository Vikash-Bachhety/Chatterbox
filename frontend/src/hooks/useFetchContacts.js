import axios from "axios";
import { useEffect, useState } from "react";

const useFetchContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("https://chatterbox-production.up.railway.app/api/users");
        // const response = await axios.get("http://localhost:3000/api/users");
        if (!response || response.status !== 200) {
          throw new Error("Error fetching users");
        }
        setContacts(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Error fetching users:", error.message);
      }
    };
    fetchContacts();
  }, []);

  return { contacts, search, setSearch };
};

export default useFetchContacts;
