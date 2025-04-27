import React from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const TaskForm = ({ toDo, setToDoList, taskTexts, setTaskTexts }) => {
  const addTaskToToDo = async () => {
    try {
      const toDoDocRef = doc(db, "toDoList", toDo.id);
      const toDoDoc = await getDoc(toDoDocRef);

      if (!toDoDoc.exists()) {
        throw new Error("Список задач не знайдено");
      }

      const updatedTasks = [...toDoDoc.data().tasks, taskTexts];
      await updateDoc(toDoDocRef, { tasks: updatedTasks });

      setToDoList((prev) =>
        prev.map((item) =>
          item.id === toDo.id ? { ...item, tasks: updatedTasks } : item
        )
      );
      setTaskTexts({ name: "", description: "" });
    } catch (error) {
      console.error("Помилка при додаванні задачі до списку:", error);
      alert("Не вдалося додати задачу до списку");
    }
  };

  return (
    <div className="flex items-center flex-col mt-4 gap-2">
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Назва задачі"
        value={taskTexts.name}
        onChange={(e) =>
          setTaskTexts({ ...taskTexts, name: e.target.value })
        }
      />
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Опис задачі"
        value={taskTexts.description}
        onChange={(e) =>
          setTaskTexts({ ...taskTexts, description: e.target.value })
        }
      />
      <button
        onClick={() => {
          if (taskTexts.name?.trim()) {
            addTaskToToDo();
          }
        }}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
      >
        + Додати завдання
      </button>
    </div>
  );
};

export default TaskForm;