import React from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const UserManagement = ({
  toDo,
  setToDoList,
  allUsers,
  selectedUser,
  setSelectedUser,
}) => {
  const addUserToToDo = async (userEmail) => {
    try {
      const toDoDocRef = doc(db, "toDoList", toDo.id);
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
        prev.map((item) =>
          item.id === toDo.id ? { ...item, users: updatedUsers } : item
        )
      );

      setSelectedUser("");
    } catch (error) {
      console.error("Помилка при додаванні користувача до списку:", error);
      alert("Не вдалося додати користувача");
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
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
          if (selectedUser) {
            addUserToToDo(selectedUser);
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
  );
};

export default UserManagement;