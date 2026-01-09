import React, { useState } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import UserListItem from "../UserAvatar/UserListItem";
import { useNavigate } from "react-router-dom";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      alert("Please enter something in search");
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
        `http://localhost:5001/api/auth?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("Failed to Load the Search Results");
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:5001/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setDrawerOpen(false); // close drawer
    } catch (error) {
      alert("Error fetching the chat");
      setLoadingChat(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center bg-white w-full px-5 py-2 border-b-4 border-gray-100">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded transition"
        >
          <i className="fas fa-search"></i>
          <span className="hidden md:inline font-medium">Search User</span>
        </button>

        <h1 className="text-2xl font-bold font-sans text-gray-800">Chat App</h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded"
            >
              <img
                src={user.pic}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              <span className="text-sm font-medium">{user.name}</span>
              <i
                className={`fas fa-chevron-down text-xs transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              ></i>
            </button>

            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setProfileOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-20 py-1">
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          ></div>
          <div className="relative bg-white w-[300px] h-full shadow-xl flex flex-col p-4 z-50 animate-slide-in-left">
            <div className="border-b pb-2 mb-2 font-bold text-lg">
              Search Users
            </div>
            <div className="flex gap-2 mb-4">
              <input
                placeholder="Search by name or email"
                className="border p-2 rounded w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="bg-gray-200 p-2 rounded hover:bg-gray-300"
              >
                Go
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div>Loading...</div>
              ) : (
                searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && (
                <div className="mt-2 text-center text-blue-500">
                  Loading Chat...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideDrawer;
