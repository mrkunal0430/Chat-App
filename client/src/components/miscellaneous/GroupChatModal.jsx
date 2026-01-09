import React, { useState } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import UserListItem from "../UserAvatar/UserListItem";

const GroupChatModal = ({ children, setFetchAgain }) => {
  const [isOpen, setIsOpen] = useState(false); // Using simple state instead of modal library if possible, or using dialog
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth?search=${query}`,
        config
      );
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      alert("Failed to Load the Search Results");
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      alert("Please fill all the feilds");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      setIsOpen(false);
      setFetchAgain((prev) => !prev);
      alert("New Group Chat Created!");
    } catch (error) {
      alert("Failed to Create the Chat!");
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  if (!isOpen) return <span onClick={() => setIsOpen(true)}>{children}</span>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Group Chat</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-black"
          >
            X
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <input
            className="p-2 border rounded"
            placeholder="Chat Name"
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <input
            className="p-2 border rounded"
            placeholder="Add Users eg: John, Jane"
            onChange={(e) => handleSearch(e.target.value)}
          />

          <div className="flex flex-wrap gap-1">
            {selectedUsers.map((u) => (
              <span
                key={u._id}
                className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
              >
                {u.name}
                <button
                  onClick={() => handleDelete(u)}
                  className="hover:text-red-200"
                >
                  x
                </button>
              </span>
            ))}
          </div>

          <div className="max-h-[200px] overflow-y-auto">
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white p-2 rounded mt-2 hover:bg-blue-700"
          >
            Create Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatModal;
