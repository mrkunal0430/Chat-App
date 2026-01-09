import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5001/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      alert("Failed to Load the chats");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser?._id ? users[1].name : users[0].name;
  };

  return (
    <div
      className={`flex-col p-3 bg-white w-full md:w-[31%] rounded-lg border border-gray-200 ${
        selectedChat ? "hidden md:flex" : "flex"
      }`}
    >
      <div className="flex justify-between items-center px-3 pb-3 font-sans">
        <h2 className="text-xl md:text-2xl font-semibold">My Chats</h2>
        <GroupChatModal setFetchAgain={fetchChats}>
          <button className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-2 rounded flex items-center gap-2 transition">
            <span>New Group +</span>
          </button>
        </GroupChatModal>
      </div>

      <div className="flex flex-col gap-2 p-3 bg-gray-50 h-full w-full rounded-lg overflow-y-hidden">
        {chats ? (
          <div className="overflow-y-scroll scrollbar-hide flex flex-col gap-2">
            {chats.map((chat) => (
              <div
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                  selectedChat === chat
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-200 text-black"
                }`}
                key={chat._id}
              >
                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </p>
                  {chat.latestMessage && (
                    <p className="text-xs opacity-70 truncate mt-1">
                      <b>{chat.latestMessage.sender.name}: </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default MyChats;
