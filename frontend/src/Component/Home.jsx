import React, { useState, useEffect } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import "../App.css";
import useFetchContacts from "../hooks/useFetchContacts.js";
import useSendMessage from "../hooks/useSendMessage.js";
import useFetchConversation from "../hooks/useFetchConversation";
import useScrollToBottom from "../hooks/useScrollToBottom.js";
import useSetUserIdFromToken from "../hooks/useSetUserIdFromToken.js";
import useOnlineStatus from "../hooks/useOnlineStatus.js";
import useLogout from "../hooks/useLogout.js";
import useSocket from "../hooks/useSocket.js";
import chat from "../assets/chat.png";
import hello from "../assets/hiii.png";
// import online from "../assets/online.png";
// import offline from "../assets/offline.png";
import twitty from "../assets/twitty.png";
import moment from "moment";

function Home() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  // const [conversation, setConversation] = useState([]);
  const [recipient, setRecipient] = useState({ fullname: "", profilepic: "" });
  const { message, setMessage, sendMessage } = useSendMessage();
  const { contacts, search, setSearch } = useFetchContacts();
  const { conversation, setConversation, fetchConversation } =
    useFetchConversation();
  const chatContainerRef = useScrollToBottom(conversation);
  const userId = useSetUserIdFromToken();
  const navigate = useNavigate();
  const logout = useLogout();
  const socket = useSocket(); // Initialize Socket.IO connection

  useEffect(() => {
    if (!userId) navigate("/Login");
  }, [userId]);

  const handleContactClick = (userId, fullname, profilepic) => {
    setSelectedUserId(userId);
    setRecipient({ fullname, profilepic });
    fetchConversation(userId);
    setConversation([]);
  };

  // const handleSendMessage = () => {
  //   sendMessage(selectedUserId, conversation, setConversation);
  // };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("chat message", {
        recipientId: selectedUserId,
        message: message,
      });
      setMessage(""); // Clear the message input
    }
  };

  const backClick = () => {
    setSelectedUserId("");
  };

  const handleLogout = () => {
    logout();
  };

  const status = useOnlineStatus();

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to server");
        socket.emit('get previous messages'); // Emit event to request previous messages when connected
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
      });

      socket.on("chat message", (message) => {
        console.log("Received message:", message);
        // Add the received message to the conversation state
        setConversation((prevConversation) => [...prevConversation, message]);
      });

      // Handle previous messages received from the server
      socket.on('previous messages', (messages) => {
        // Display previous messages in the chat interface
        setConversation(messages);
      });

      // Clean up function to remove event listeners when component unmounts
      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("chat message");
        socket.off("previous messages");
      };
    }
  }, [socket]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={
          window.innerWidth <= 640
            ? `flex flex-col min-w-60 w-full sm:w-1/4 bg-gray-800 text-white ${
                selectedUserId ? "hidden" : ""
              }`
            : `flex flex-col min-w-60 w-full sm:w-1/4 bg-gray-800 text-white`
        }
      >
        <header className="flex items-center justify-center bg-slate-950 p-3">
          {/* <h1 className="hidden md:block text-white font-serif font-extrabold text-xl rounded-lg px-4 py-2 text-center w-11/12">
            Welcome to Chatterbox`
          </h1> */}
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="w-11/12 py-2 px-4 rounded-lg border border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
            placeholder="search contact here "
          />
          {/* {status ? "🟢" : "🔴"}
          <img className="block md:hidden h-14 w-14" src={twitty} alt="" /> */}

          {/* <input
            type="search"
            className="bg-gray-700 text-white rounded-l-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400 flex-1"
            placeholder="Search"
            />
          <button className="bg-blue-500 text-white rounded-r-lg px-4 py-3 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400">
            <FaSearch />
          </button> */}
        </header>
        <main id="aside" className="flex-1 bg-gray-950 overflow-y-auto p-2">
          <ul className="divide-y divide-gray-800">
            {/* {console.log(userId)} */}
            {contacts
              .filter(
                (contact) => userId.userId !== contact._id
                // (console.log(contact._id))
              )

              // .filter((user) => {
              //   return search.toLowerCase() === ""
              //     ? user
              //     : user.fullName.toLowerCase().includes(search);
              // })
              .map((contact) => (
                <li
                  key={contact._id}
                  onClick={() =>
                    handleContactClick(
                      contact._id,
                      contact.fullName,
                      contact.profilePic
                    )
                  }
                  id="Sidebar"
                  className="p-4 cursor-pointer hover:bg-blue-200 hover:bg-opacity-10 hover:rounded-sm transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 justify-center">
                      <img
                        className="h-16 w-16 sm:h-10 sm:w-10 rounded-full"
                        src={contact.profilePic}
                        alt={contact.fullName}
                      />
                    </div>
                    <div className="relative ml-3 w-full">
                      <p className="text-2xl sm:text-lg font-medium tracking-wider text-gray-200">
                        {contact.fullName}
                      </p>
                      <p className="sm:hidden xl:block absolute top-0 right-1 text-sm xl:text-[16px] font-medium tracking-wider text-gray-400">
                        {moment(contact.updatedAt).format("DD-MM-YY")}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </main>
        <footer className="bg-slate-950 p-3 flex lg:justify-between justify-center">
          <img className="hidden lg:block h-10 w-10" src={twitty} alt="" />
          <TbLogout
            className="cursor-pointer h-8 w-8 mb-2 hover:scale-110"
            onClick={handleLogout}
          />
        </footer>
      </aside>
      {/* Main Content */}
      <div
        className={
          window.innerWidth <= 640
            ? `flex-1 bg-slate-950 w-full h-full bg-cover bg-center sm:flex flex-col ${
                selectedUserId ? "" : "hidden"
              }`
            : `flex-1 bg-slate-950 w-full h-full bg-cover bg-center sm:flex flex-col`
        }
      >
        {selectedUserId ? (
          <>
            <div className="p-3 h-16 bg-slate-900 flex items-center gap-4">
              <IoMdArrowRoundBack
                className="h-6 w-8 invert cursor-pointer"
                onClick={backClick}
              />
              <img
                className="h-10 w-10 rounded-full"
                src={recipient.profilepic}
                alt="profilepic"
              />
              <h1 className="text-white font-semibold text-xl">
                {recipient.fullname}
              </h1>
            </div>
            <div
              ref={chatContainerRef}
              id="main"
              className="text-white w-full h-4/5 overflow-auto my-6"
            >
              {Array.isArray(conversation) && conversation.length > 0 ? (
                <ul className="flex flex-col gap-y-10 max-auto max-h-1/2 m-5 lg:ml-20">
                  {conversation.map((chat) => (
                      <li
                      key={chat.id}>
                      {chat.message && (
                        <p 
                        className={`relative text-black text-center min-w-24 sm:max-w-48 md:max-w-md inline-block  font-medium p-2 border rounded-lg break-words w-auto ${
                          chat.reciever !== userId ? "bg-teal-100 self-start" : "bg-cyan-100 self-end"}`}>
                          {chat.message}
                          <span className="absolute text-[10px] text-gray-500 font-semibold right-0 -bottom-6">
                            {chat.createdAt &&
                              moment(chat.createdAt).format("DD-MM-YY, h:mm a")}
                          </span>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-3/4 bg-bg flex flex-col items-center mt-32">
                  <img className="h-28 w-28" src={hello} alt="" />
                  <h1 className="flex flex-wrap sm:font-extrabold text-lg lg:text-2xl text-gray-700 hover:text-gray-600 font-sans">
                    Start a Conversation with {recipient.fullname.toUpperCase()}
                  </h1>
                  <p className="text-sm md:text-xl lg:text-2xl text-gray-600 mt-4">
                    Send your first message and get the conversation going.
                  </p>
                </div>
              )}
            </div>
            <div className="bg-slate-900 p-3 flex justify-evenly items-center">
              <input
                className="w-3/4 pl-5 text-lg py-1 rounded-md focus:outline-none text-black"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={(e) => setMessage(e.target.value.trim())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message"
              />
              <BsFillSendFill
                onClick={handleSendMessage}
                className="h-10 w-10 invert border bg-yellow-600 hover:bg-yellow-500 rounded-full p-2.5 cursor-pointer"
              />
            </div>
          </>
        ) : (
          <div className="h-3/4 bg-bg flex flex-col items-center mt-56">
            <img
              className="h-28 w-28 hover:translate-x-3 hover:scale-110"
              src={chat}
              alt=""
            />
            <h1 className="font-extrabold text-2xl md:text-4xl text-gray-700 hover:text-gray-600 font-sans">
              Let's start Conversation
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mt-4">
              Select a contact to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
