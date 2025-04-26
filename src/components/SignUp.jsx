import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Form from "./Form";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [role, setRole] = useState("user");

  const handleRegister = async (email, password) => {
    const auth = getAuth();
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        id: user.uid,
        role: role,
      });
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        throw new Error("User data not found in database");
      }
      const userData = userDoc.data();
      dispatch(
        setUser({
          email: user.email,
          id: user.uid,
          token: user.accessToken,
          role: userData.role,
        })
      );
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          id: user.uid,
          token: user.accessToken,
          role: userData.role,
        })
      );

      navigate("/");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
    }
  };

  return (
    <div>
      <Form title="Зарегистрироваться" handleClick={handleRegister} />
      <div style={{ marginTop: "10px" }}>
        <label>
          Роль:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="user">Пользователь</option>
            <option value="admin">Администратор</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default SignIn;
