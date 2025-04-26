import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Form from "./Form";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";

const SignIn = ({ props }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = (email, password) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        dispatch(
          setUser({ email: user.email, id: user.uid, token: user.accessToken })
        );
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return <Form title="Войти" handleClick={handleRegister} />;
};

export default SignIn;
