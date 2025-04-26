import React, { useState } from "react";
import Form from "./Form";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogin = async (email, password) => {
    const auth = getAuth();
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
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
      console.error("Login error:", error);
      setError(error.message);
    }
  };

  return (
    <>
      <Form title="Войти" handleClick={handleLogin} />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default Login;
