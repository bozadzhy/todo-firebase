import React, { FC } from "react";
import ToDoItem from "./ToDoItem";

import { ToDo } from "./TaskForm";
import { User } from "../store/slices/userSlice";

interface ToDoListProps {
  toDoList: ToDo[];
  setToDoList: React.Dispatch<React.SetStateAction<ToDo[]>>;
  allUsers: User[];
  role: string;
}
const ToDoList: FC<ToDoListProps> = ({
  toDoList,
  setToDoList,
  allUsers,
  role,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {toDoList.map((toDo) => (
        <ToDoItem
          key={toDo.id}
          toDo={toDo}
          setToDoList={setToDoList}
          allUsers={allUsers}
          role={role}
        />
      ))}
    </div>
  );
};

export default ToDoList;
