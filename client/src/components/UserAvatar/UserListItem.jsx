import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="cursor-pointer bg-gray-100 hover:bg-blue-300 hover:text-white w-full flex items-center gap-3 px-3 py-2 mb-2 rounded-lg transition"
    >
      <img
        className="w-8 h-8 rounded-full object-cover"
        src={user.pic}
        alt={user.name}
      />
      <div>
        <p className="font-semibold text-sm">{user.name}</p>
        <p className="text-xs">
          <b>Email: </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
