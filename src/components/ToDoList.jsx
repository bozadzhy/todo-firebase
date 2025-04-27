import React from "react";
import ToDoItem from "./ToDoItem";

const ToDoList = ({ toDoList, setToDoList, allUsers, role }) => {
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