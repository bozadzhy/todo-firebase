import React, { useState, useEffect, FC } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/use-auth";
import ToDoForm from "./ToDoForm";
import ToDoList from "./ToDoList";
import { ToDo as ToDoType } from "./TaskForm";
import { User} from "../store/slices/userSlice";

const ToDo: FC = () => {
  const { role } = useAuth();
  
  const [toDoList, setToDoList] = useState<ToDoType[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchToDos = async () => {
      try {
        const toDoCollectionRef = collection(db, "toDoList");
        const toDoSnapshot = await getDocs(toDoCollectionRef);

        const toDos: ToDoType[] = toDoSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ToDoType[];
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

        const users: User[] = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
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
        role={role as string}
      />
    </div>
  );
};

export default ToDo;
