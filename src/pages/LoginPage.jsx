import React from "react";
import { Link } from "react-router-dom";
import Login from "../components/LogIn";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-black mb-6">Log In</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <Login />
        <p className="text-center mt-4 text-gray-600">
          Или{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
