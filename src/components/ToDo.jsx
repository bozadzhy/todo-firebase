import React, { useState, useEffect } from "react";
import {
  updateDoc,
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const ToDo = () => {
  const [toDoName, setToDoName] = useState("");
  const [toDoList, setToDoList] = useState([]);
  const [taskTexts, setTaskTexts] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [isEditTextToDo, setIsEditTextToDo] = useState(null);
  const [editingTask, setEditingTask] = useState({
    toDoId: null,
    taskIndex: null,
  });

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

  const handleDeleteToDo = async (toDoId) => {
    try {
      await deleteDoc(doc(db, "toDoList", toDoId));
      setToDoList((prev) => prev.filter((toDo) => toDo.id !== toDoId));
    } catch (error) {
      console.error("Помилка при видаленні списку задач:", error);
      alert("Не вдалося видалити список задач");
    }
  };
  const handleEditToDoText = (toDoId) => {
    setIsEditTextToDo(toDoId);
  };

  const handleSaveToDoText = async (toDoId) => {
    try {
      const newName = toDoList.find((toDo) => toDo.id === toDoId)?.name || "";

      const toDoDocRef = doc(db, "toDoList", toDoId);
      await updateDoc(toDoDocRef, { name: newName });

      setIsEditTextToDo(null);
    } catch (error) {
      console.error("Помилка при редагуванні назви списку:", error);
      alert("Не вдалося змінити назву списку задач");
    }
  };

  const handleEditTaskText = (toDoId, taskIndex) => {
    setEditingTask({ toDoId, taskIndex });
  };

  const handleSaveTaskText = async (toDoId, taskIndex) => {
    try {
      const toDoDocRef = doc(db, "toDoList", toDoId);
      const toDoDoc = await getDoc(toDoDocRef);

      if (!toDoDoc.exists()) {
        throw new Error("Список задач не знайдено");
      }

      const tasks = toDoDoc.data().tasks;
      const updatedTask = taskTexts[toDoId];

      if (!updatedTask || !updatedTask.name.trim()) {
        alert("Назва задачі не може бути порожньою");
        return;
      }

      tasks[taskIndex] = updatedTask;

      await updateDoc(toDoDocRef, { tasks });

      setToDoList((prev) =>
        prev.map((toDo) => (toDo.id === toDoId ? { ...toDo, tasks } : toDo))
      );

      setEditingTask({ toDoId: null, taskIndex: null });
      setTaskTexts((prev) => ({
        ...prev,
        [toDoId]: { name: "", description: "" },
      }));
    } catch (error) {
      console.error("Помилка при збереженні редагування задачі:", error);
    }
  };

  const addNewToDo = async (e) => {
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

  const addUserToToDo = async (toDoId, userEmail) => {
    try {
      const toDoDocRef = doc(db, "toDoList", toDoId);
      const toDoDoc = await getDoc(toDoDocRef);

      if (!toDoDoc.exists()) {
        throw new Error("Список задач не знайдено");
      }

      const currentUsers = toDoDoc.data().users || [];

      if (currentUsers.includes(userEmail)) {
        alert("Цей користувач вже доданий до списку.");
        return;
      }

      const updatedUsers = [...currentUsers, userEmail];

      await updateDoc(toDoDocRef, { users: updatedUsers });

      setToDoList((prev) =>
        prev.map((toDo) =>
          toDo.id === toDoId ? { ...toDo, users: updatedUsers } : toDo
        )
      );

      setSelectedUsers((prev) => ({
        ...prev,
        [toDoId]: "", // очищаем селект
      }));
    } catch (error) {
      console.error("Помилка при додаванні користувача до списку:", error);
      alert("Не вдалося додати користувача");
    }
  };

  return (
    <div className="flex items-center flex-col mt-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {toDoList.map((toDo) => (
          <div
            key={toDo.id}
            className="bg-white rounded-lg shadow-md p-4 pt-12 mb-4 relative"
          >
            <button
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full text-white bg-red-600 text-lg"
              onClick={() => handleDeleteToDo(toDo.id)}
            >
              ×
            </button>
            <div>
              <button
                className="absolute top-2 right-12 w-8 h-8 flex items-center justify-center rounded-full text-white bg-blue-600 text-lg"
                onClick={() => handleEditToDoText(toDo.id)}
              >
                ✎
              </button>
              {isEditTextToDo === toDo.id ? (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <input
                    type="text"
                    value={toDo.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setToDoList((prev) =>
                        prev.map((item) =>
                          item.id === toDo.id
                            ? { ...item, name: newName }
                            : item
                        )
                      );
                    }}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="редагувати назву списку задач"
                  />
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full text-white bg-green-600 text-lg"
                    onClick={() => handleSaveToDoText(toDo.id)}
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <p className="text-lg font-semibold text-gray-800 mb-3">
                  {toDo.name}
                </p>
              )}
            </div>

            <div className="space-y-2 mb-4  p-2 w-80 ">
              {toDo.tasks.length > 0 ? (
                toDo.tasks.map((task, index) => (
                  <div className="flex flex-col gap-2 border-b py-2">
                    {editingTask.toDoId === toDo.id &&
                    editingTask.taskIndex === index ? (
                      <>
                        <input
                          type="text"
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
                          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Назва задачі"
                        />
                        <input
                          type="text"
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
                          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Опис задачі"
                        />
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-full text-white bg-green-600 text-lg self-end"
                          onClick={() => handleSaveTaskText(toDo.id, index)}
                        >
                          ✓
                        </button>
                      </>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col items-start">
                          <span className="font-semibold">{task.name}</span>
                          <span className="text-gray-500 text-sm">
                            {task.description}
                          </span>
                        </div>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-full text-white bg-green-600 text-lg"
                          onClick={() => {
                            handleEditTaskText(toDo.id, index);
                            setTaskTexts((prev) => ({
                              ...prev,
                              [toDo.id]: {
                                name: task.name,
                                description: task.description,
                              },
                            }));
                          }}
                        >
                          ✎
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Поки немає завдань</p>
              )}
            </div>

            <div className="flex items-center flex-col mt-4 gap-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Назва задачі"
                value={taskTexts[toDo.id]?.name || ""}
                onChange={(e) =>
                  setTaskTexts((prev) => ({
                    ...prev,
                    [toDo.id]: { ...prev[toDo.id], name: e.target.value },
                  }))
                }
              />

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Опис задачі"
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
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
              >
                + Додати завдання
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <select
                value={selectedUsers[toDo.id] || ""}
                onChange={(e) =>
                  setSelectedUsers((prev) => ({
                    ...prev,
                    [toDo.id]: e.target.value,
                  }))
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Вибрати співучасника</option>
                {allUsers.map((user) => (
                  <option key={user.id} value={user.email}>
                    {user.email}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  const selectedUserEmail = selectedUsers[toDo.id];
                  if (selectedUserEmail) {
                    addUserToToDo(toDo.id, selectedUserEmail);
                  } else {
                    alert("Будь ласка, виберіть користувача");
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              >
                + Додати співучасника
              </button>

              {toDo.users && toDo.users.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold">Співучасники:</p>
                  <ul className="list-disc list-inside text-gray-700">
                    {toDo.users.map((email, idx) => (
                      <li key={idx}>{email}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToDo;
