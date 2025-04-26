import React, { useState } from "react";

const Form = ({ title, handleClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center">{title}</h2>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
      />
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={() => handleClick(email, password)}
        className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition-colors"
      >
        {title}
      </button>
    </div>
  );
};

export default Form;
