import React, { useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const TaskItem = ({
  task,
  index,
  toDo,
  setToDoList, // ⬅️ додаємо
  editingTask,
  handleToggleTask,
  handleDeleteTask,
  setTaskTexts,
  setEditingTask,
  role,
}) => {
  const [editTaskText, setEditTaskText] = useState({
    name: task.name,
    description: task.description,
  });

  const handleSaveTaskText = async () => {
    try {
      const toDoDocRef = doc(db, "toDoList", toDo.id);
      const toDoDoc = await getDoc(toDoDocRef);

      if (!toDoDoc.exists()) {
        throw new Error("Список задач не знайдено");
      }

      const tasks = toDoDoc.data().tasks || [];
      tasks[index] = {
        ...tasks[index],
        name: editTaskText.name,
        description: editTaskText.description,
      };

      await updateDoc(toDoDocRef, { tasks });

      setToDoList((prevList) =>
        prevList.map((item) =>
          item.id === toDo.id ? { ...item, tasks: tasks } : item
        )
      );

      setEditingTask({ taskIndex: null });
      setEditTaskText({ name: "", description: "" });
    } catch (error) {
      console.error("Помилка при збереженні редагування задачі:", error);
      alert("Не вдалося зберегти зміни");
    }
  };

  const handleConfirmDelete = () => {
    handleDeleteTask(index);
  };

  if (editingTask.taskIndex === index) {
    return (
      <div className="flex flex-col gap-2 border-b py-2">
        <input
          type="text"
          value={editTaskText.name}
          onChange={(e) =>
            setEditTaskText({ ...editTaskText, name: e.target.value })
          }
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Назва задачі"
        />
        <input
          type="text"
          value={editTaskText.description}
          onChange={(e) =>
            setEditTaskText({ ...editTaskText, description: e.target.value })
          }
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Опис задачі"
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full text-white bg-green-600 hover:bg-green-700 hover:scale-110 transition self-end"
          onClick={handleSaveTaskText}
          title="Зберегти"
        >
          ✓
        </button>
      </div>
    );
  }

  return (
    <div className="w-full border-b border-gray-300 flex flex-col gap-2 py-2">
      <div className="flex items-start justify-between">
        <div className="flex flex-col items-start">
          <span className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              checked={task.completed || false}
              onChange={() => handleToggleTask(index)}
            />
            {task.name}
          </span>
          <span className="text-gray-500 text-sm">{task.description}</span>
        </div>
        {role === "admin" && (
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full text-white bg-green-600 hover:bg-green-700 hover:scale-110 transition"
              onClick={() => {
                setEditingTask({ taskIndex: index });
                setEditTaskText({
                  name: task.name,
                  description: task.description,
                });
              }}
              title="Редагувати задачу"
            >
              ✎
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full text-white bg-red-600 hover:bg-red-700 hover:scale-110 transition text-lg"
              onClick={handleConfirmDelete}
              title="Видалити задачу"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
