import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { removeUser } from "../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import Header from "../components/Header";
import ToDo from "../components/ToDo";

const HomePage = () => {
  const [loading, isLoading] = useState(true);

  const dispatch = useDispatch();
  const { isAuth, email, role, name } = useAuth();
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
    <>
      <Header
        isAuth={isAuth}
        email={email}
        role={role}
        handleLogout={handleLogout}
        userName={name}
      />
      <main>
        <ToDo />
      </main>
    </>
  );
};

export default HomePage;
