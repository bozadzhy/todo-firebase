import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { removeUser } from "../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";

const HomePage = () => {
  const [loading, isLoading] = useState(true);

  const dispatch = useDispatch();
  const { isAuth, email, role } = useAuth();
  const handleLogout = () => {
    dispatch(removeUser());
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        dispatch(setUser(parsedData));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
    isLoading(false);
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <header className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        Добро пожаловать,{role} {email}! 
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition"
      >
        Выйти
      </button>
    </header>
  );
};

export default HomePage;
