import React, { useState, FC } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import UserManagement from "./UserManagement";
import { ToDo, Task } from "./TaskForm";
import {User} from "../store/slices/userSlice";



interface ToDoItemProps {
  toDo: ToDo;
  setToDoList: React.Dispatch<React.SetStateAction<ToDo[]>>;
  allUsers: User[];
  role: string;
}

const ToDoItem: FC<ToDoItemProps> = ({ toDo, setToDoList, allUsers, role }) => {
  const [isEditTextToDo, setIsEditTextToDo] = useState(false);
  const [editName, setEditName] = useState("");
  const [taskTexts, setTaskTexts] = useState({ name: "", description: "" });
  const [selectedUser, setSelectedUser] = useState("");
  const [editingTask, setEditingTask] = useState<number | null>(null);

  const handleDeleteToDo = async () => {
    try {
      await deleteDoc(doc(db, "toDoList", toDo.id));
      setToDoList((prev) => prev.filter((item) => item.id !== toDo.id));
    } catch (error) {
      console.error("Помилка при видаленні списку задач:", error);
    }
  };

  const handleSaveToDoText = async () => {
    if (!editName.trim()) {
      alert("Назва списку не може бути пустою");
      return;
    }

    try {
      const toDoDocRef = doc(db, "toDoList", toDo.id);
      await updateDoc(toDoDocRef, { name: editName });

      setToDoList((prev) =>
        prev.map((item) =>
          item.id === toDo.id ? { ...item, name: editName } : item
        )
      );
      setIsEditTextToDo(false);
    } catch (error) {
      console.error("Помилка при редагуванні назви списку:", error);
    }
  };

  const handleEditClick = () => {
    setEditName(toDo.name);
    setIsEditTextToDo(true);
  };

  return (
    <div className="bg-gray-200 rounded-lg border p-8 pt-12 mb-4 relative">
      {role === "admin" && (
        <>
          <button
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full text-white bg-red-600 hover:bg-red-700 hover:scale-110 transition"
            onClick={handleDeleteToDo}
            title="Видалити список"
          >
            ×
          </button>
          <button
            className="absolute top-2 right-12 w-8 h-8 flex items-center justify-center rounded-full text-white bg-blue-600 hover:bg-blue-700 hover:scale-110 transition"
            onClick={handleEditClick}
            title="Редагувати назву списку"
          >
            ✎
          </button>
        </>
      )}

      {isEditTextToDo ? (
        <div className="flex items-center justify-center gap-2 mb-4">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Редагувати назву списку задач"
          />
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full text-white bg-green-600 hover:bg-green-700 hover:scale-110 transition"
            onClick={handleSaveToDoText}
            title="Зберегти"
          >
            ✓
          </button>
        </div>
      ) : (
        <h2 className="text-lg font-semibold text-blue-800 mb-3 uppercase">
          {toDo.name}:
        </h2>
      )}

      <TaskList
        toDo={toDo}
        setToDoList={setToDoList}
        role={role}
        setTaskTexts={setTaskTexts}
        setEditingTask={setEditingTask}
        editingTask={editingTask}
      />

      {role === "admin" && (
        <>
          <TaskForm
            toDo={toDo}
            setToDoList={setToDoList}
            taskTexts={taskTexts}
            setTaskTexts={setTaskTexts}
          />
          <UserManagement
            toDo={toDo}
            setToDoList={setToDoList}
            allUsers={allUsers}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </>
      )}
    </div>
  );
};

export default ToDoItem;
