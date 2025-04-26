import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { removeUser } from "../store/slices/userSlice";
import { useDispatch } from "react-redux";

const HomePage = () => {
  const dispatch = useDispatch();
  const { isAuth, email } = useAuth();

  if (isAuth)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Добро пожаловать, {email}!</h1>
        <button
          onClick={() => dispatch(removeUser())}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Выйти
        </button>
      </div>
    );

  return <Navigate to="/login" replace />;
};

export default HomePage;
