import React, { useState, useEffect } from "react";
import {
  updateDoc,
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

const ToDo = () => {
  const [toDoName, setToDoName] = useState("");
  const [toDoList, setToDoList] = useState([]);
  const [taskTexts, setTaskTexts] = useState({});

  console.log("todoList", toDoList);

  useEffect(() => {
    const fetchToDos = async () => {
      try {
        const toDoCollectionRef = collection(db, "toDoList");
        const toDoSnapshot = await getDocs(toDoCollectionRef);

        const toDos = toDoSnapshot.docs.map((doc) => ({
          id: doc.id, // сохраняем id документа
          ...doc.data(), // и все его данные
        }));
        setToDoList(toDos);
      } catch (error) {
        console.error("Помилка при завантаженні списків задач:", error);
      }
    };

    fetchToDos();
  }, []);

  const addNewToDo = async (e) => {
    e.preventDefault();
    try {
      const newDoc = await addDoc(collection(db, "toDoList"), {
        name: toDoName,
        tasks: [],
      });

      setToDoList((prev) => [
        ...prev,
        { id: newDoc.id, name: toDoName, tasks: [] },
      ]);
      setToDoName("");
    } catch (error) {
      console.error("Помилка при додаванні списку задач:", error);
      alert("Не вдалося додати список задач");
    }
  };

  const addTaskToToDo = async (toDoId, newTask) => {
    try {
      const toDoDocRef = doc(db, "toDoList", toDoId);
      const toDoDoc = await getDoc(toDoDocRef);

      if (!toDoDoc.exists()) {
        throw new Error("Список задач не знайдено");
      }

      const updatedTasks = [...toDoDoc.data().tasks, newTask];
      await updateDoc(toDoDocRef, { tasks: updatedTasks });

      setToDoList((prev) =>
        prev.map((toDo) =>
          toDo.id === toDoId ? { ...toDo, tasks: updatedTasks } : toDo
        )
      );
    } catch (error) {
      console.error("Помилка при додаванні задачі до списку:", error);
      alert("Не вдалося додати задачу до списку");
    }
  };

  return (
    <div className="flex items-center flex-col mt-6">
      <div className="flex items-center flex-col p-4 border rounded-lg  mb-4">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {toDoList.map((toDo) => (
          <div key={toDo.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
            <p className="text-lg font-semibold text-gray-800 mb-3">
              {toDo.name}
            </p>

            <div className="space-y-2 mb-4">
              {toDo.tasks.length > 0 ? (
                toDo.tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-start border-b py-2"
                  >
                    <span className="font-semibold">{task.name}</span>
                    <span className="text-gray-500 text-sm">
                      {task.description}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Поки немає завдань</p>
              )}

              <div className="flex items-center flex-col mt-4 gap-2">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Назва задачі"
                  value={taskTexts[toDo.id]?.name || ""}
                  onChange={(e) =>
                    setTaskTexts((prev) => ({
                      ...prev,
                      [toDo.id]: {
                        ...prev[toDo.id],
                        name: e.target.value,
                      },
                    }))
                  }
                />

                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Опишіть задачу"
                  value={taskTexts[toDo.id]?.description || ""}
                  onChange={(e) =>
                    setTaskTexts((prev) => ({
                      ...prev,
                      [toDo.id]: {
                        ...prev[toDo.id],
                        description: e.target.value,
                      },
                    }))
                  }
                />

                <button
                  onClick={() => {
                    const task = taskTexts[toDo.id];
                    if (task?.name?.trim()) {
                      addTaskToToDo(toDo.id, task);
                      setTaskTexts((prev) => ({
                        ...prev,
                        [toDo.id]: { name: "", description: "" },
                      }));
                    }
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded whitespace-nowrap"
                >
                  + Додати завдання
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToDo;
