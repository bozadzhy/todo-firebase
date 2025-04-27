import React, { useState } from "react";

const Form = ({ title, handleClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="max-w-md mx-auto p-6 bg-white  flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center">{title}</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-green-500"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-green-500"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-green-500"
      />
      <button
        onClick={() => handleClick(email, password, name)}
        className="bg-green-500 text-white rounded-lg p-2 hover:bg-green-600 transition-colors"
      >
        {title}
      </button>
    </div>
  );
};

export default Form;
