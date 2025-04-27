import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/use-auth";
import ToDoForm from "./ToDoForm";
import ToDoList from "./ToDoList";

const ToDo = () => {
  const { role } = useAuth();
  const [toDoList, setToDoList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchToDos = async () => {
      try {
        const toDoCollectionRef = collection(db, "toDoList");
        const toDoSnapshot = await getDocs(toDoCollectionRef);

        const toDos = toDoSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setToDoList(toDos);
      } catch (error) {
        console.error("Помилка при завантаженні списків задач:", error);
      }
    };

    fetchToDos();
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const usersCollectionRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollectionRef);

        const users = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllUsers(users);
      } catch (error) {
        console.error("Помилка при завантаженні користувачів:", error);
      }
    };

    fetchAllUsers();
  }, []);

  return (
    <div className="flex items-center flex-col mt-6">
      {role === "admin" && <ToDoForm setToDoList={setToDoList} />}
      <ToDoList
        toDoList={toDoList}
        setToDoList={setToDoList}
        allUsers={allUsers}
        role={role}
      />
    </div>
  );
};

export default ToDo;
