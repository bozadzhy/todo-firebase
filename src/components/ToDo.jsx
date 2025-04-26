import React, { useState, useEffect } from "react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/use-auth";

const ToDo = () => {
  const [text, setText] = useState(""); 
  const [tasks, setTasks] = useState([]); 
  const [isEditing, setIsEditing] = useState(false); 
  const [editIndex, setEditIndex] = useState(null); 
  const [editText, setEditText] = useState(""); 
  const { id } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userDocRef = doc(db, "users", id);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setTasks(userDoc.data().tasks || []);
        } else {
          console.log("Документ користувача не знайдено");
        }
      } catch (error) {
        console.error("Помилка при завантаженні задач:", error);
      }
    };

    if (id) {
      fetchTasks();
    }
  }, [id]);

  const addTask = async (e) => {
    e.preventDefault();
    if (text.trim() === "") return;

    const newTasks = [...tasks, text];
    try {
      await updateDoc(doc(db, "users", id), {
        tasks: newTasks,
      });
      setText("");
      setTasks(newTasks);
    } catch (error) {
      console.error("Помилка при додаванні задачі:", error);
      alert("Не вдалося додати задачу");
    }
  };

  const deleteTask = async (taskToDelete) => {
    const newTasks = tasks.filter((task) => task !== taskToDelete);
    try {
      await updateDoc(doc(db, "users", id), {
        tasks: newTasks,
      });
      setTasks(newTasks); 
    } catch (error) {
      console.error("Помилка при видаленні задачі:", error);
      alert("Не вдалося видалити задачу");
    }
  };

  const editTask = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setEditText(tasks[index]);
  };

  const saveTask = async () => {
    const updatedTasks = tasks.map((task, index) =>
      index === editIndex ? editText : task
    );
    try {
      await updateDoc(doc(db, "users", id), {
        tasks: updatedTasks,
      });
      setTasks(updatedTasks); 
      setIsEditing(false); 
      setEditIndex(null); 
      setEditText(""); 
    } catch (error) {
      console.error("Помилка при збереженні задачі:", error);
      alert("Не вдалося зберегти задачу");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Список справ</h1>

      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          type="text"
          placeholder="Введіть нову задачу"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white border px-4 py-2 font-medium hover:bg-green-700 transition-colors"
        >
          Додати
        </button>
      </form>

      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
          >
            {isEditing && editIndex === index ? (
              <div className="flex gap-2">
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                />
                <button
                  onClick={saveTask}
                  className="bg-green-600 text-white border px-4 py-2 font-medium hover:bg-green-700"
                >
                  Зберегти
                </button>
              </div>
            ) : (
              <>
                <span className="text-gray-800">{task}</span>
                <button
                  onClick={() => editTask(index)}
                  className="text-green-600 hover:text-green-800 transition-colors"
                >
                  Редагувати
                </button>
              </>
            )}
            <button
              onClick={() => deleteTask(task)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              Видалити
            </button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <p className="text-center text-gray-500 mt-4">Список справ порожній</p>
      )}
    </div>
  );
};

export default ToDo;
