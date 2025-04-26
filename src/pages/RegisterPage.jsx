import React from "react";
import { Link } from "react-router-dom";
import SignUp from "../components/SignUp";

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <SignUp />
        <p className="text-center mt-4 text-gray-600">
          Вже зареєстровані?
          <Link to="/login" className="text-blue-500 hover:underline">
            Ввійти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
