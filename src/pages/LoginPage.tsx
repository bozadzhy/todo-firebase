import React, { FC} from "react";
import { Link } from "react-router-dom";
import Login from "../components/LogIn";

const LoginPage: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <Login />
        <p className="text-center mt-4 text-gray-600">
          <Link to="/register" className="text-blue-500 hover:underline">
            Реєстрація
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
