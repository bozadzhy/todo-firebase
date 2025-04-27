import React, { FC } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  isAuth: boolean;
  email: string | null; 
  role: string;
  handleLogout: () => void;
  userName: string | null;
}


const Header: FC<HeaderProps> = ({
  isAuth,
  email,
  role,
  handleLogout,
  userName,
}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className=" mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <div className="text-xl font-bold text-yellow-600">TODO</div>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuth ? (
            <>
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-yellow-600">{userName}</span>
                <span className="text-sm font-medium text-gray-600">
                  {email}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    role === "admin" ? "bg-purple-100 " : "bg-blue-100 "
                  }`}
                >
                  {role === "admin" ? "Admin" : "User"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 "
              >
                Вийти
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-green-600 hover:text-green-700 px-3 py-1 rounded-md hover:bg-green-50 "
            >
              Ввійти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
