import React, { useState, FC } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ToDo } from "./TaskForm";

interface ToDoFormProps {
  setToDoList: React.Dispatch<React.SetStateAction<ToDo[]>>
}

const ToDoForm: FC<ToDoFormProps> = ({ setToDoList }) => {
  const [toDoName, setToDoName] = useState("");

  const addNewToDo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newDoc = await addDoc(collection(db, "toDoList"), {
        name: toDoName,
        tasks: [],
        users: [],
      });

      setToDoList((prev) => [
        ...prev,
        { id: newDoc.id, name: toDoName, tasks: [], users: [] },
      ]);
      setToDoName("");
    } catch (error) {
      console.error("Помилка при додаванні списку задач:", error);
      alert("Не вдалося додати список задач");
    }
  };

  return (
    <div className="flex items-center flex-col p-4 border rounded-lg mb-4">
      <form onSubmit={addNewToDo} className="flex gap-2">
        <input
          value={toDoName}
          onChange={(e) => setToDoName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          type="text"
          placeholder="Назва списку задач"
          required
        />
        <button
          type="submit"
          className="bg-red-600 rounded-lg text-white border px-4 py-2 font-medium hover:bg-red-700 transition-colors"
        >
          + список
        </button>
      </form>
    </div>
  );
};

export default ToDoForm;