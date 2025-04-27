import React, { useState, FC } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import Form from "./Form";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";

const SignUp: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [role, setRole] = useState("user");

  const handleRegister = async (email: string, password: string, name: string) => {
    const auth = getAuth();
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData = {
        email: user.email,
        id: user.uid,
        role: role,
        name: name,
      } ;

      await setDoc(doc(db, "users", user.uid), userData);
      dispatch(
        setUser({
          ...userData,
          token: user.refreshToken,
          isAuth: true,
        })
      );
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          id: user.uid,
          token: user.refreshToken,
          role: role,
          name: name,
        })
      );
      navigate("/");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white">
      <Form
        title="Реєстрація"
        handleClick={handleRegister}
        // showNameField={true}
      />

      <div className="flex items-center justify-center">
        <label className="block text-sm font-medium text-gray-700">
          Роль:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </label>  
      </div>
    </div>
  );
};

export default SignUp;
