import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      alert("Please Fill all the Fields");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password },
        config
      );

      alert("Login Successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      window.location.href = "/chats"; // Force reload to update context or use navigate
      // navigate("/chats");
    } catch (error) {
      alert("Error Occured: " + error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        onClick={submitHandler}
        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        disabled={loading}
      >
        {loading ? "Loading..." : "Login"}
      </button>
      <button
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition text-sm"
      >
        Get Guest Credentials
      </button>
    </div>
  );
};

export default Login;
