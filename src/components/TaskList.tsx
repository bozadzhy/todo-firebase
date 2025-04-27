import React, { FC } from "react";
import TaskItem from "./TaskItem";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ToDo, Task } from "./TaskForm";

interface TaskListProps {
  toDo: ToDo;
  setToDoList: React.Dispatch<React.SetStateAction<ToDo[]>>;
  role: string;
  setTaskTexts: React.Dispatch<React.SetStateAction<Task>>;
  setEditingTask: React.Dispatch<React.SetStateAction<number | null>>; 
  editingTask: number | null; 
}

const TaskList: FC<TaskListProps> = ({
  toDo,
  setToDoList,
  role,
  setTaskTexts,
  setEditingTask,
  editingTask,
}) => {
  const handleToggleTask = async (taskIndex: number) => {
    try {
      const toDoDocRef = doc(db, "toDoList", toDo.id);
      const toDoDoc = await getDoc(toDoDocRef);

      if (!toDoDoc.exists()) {
        throw new Error("Список задач не знайдено");
      }

      const tasks = [...toDoDoc.data().tasks];
      const task = tasks[taskIndex];

      const updatedTask = { ...task, completed: !task.completed };
      tasks[taskIndex] = updatedTask;

      await updateDoc(toDoDocRef, { tasks });

      setToDoList((prev) =>
        prev.map((item) => (item.id === toDo.id ? { ...item, tasks } : item))
      );
    } catch (error) {
      console.error("Помилка при зміні статусу задачі:", error);
      alert("Не вдалося змінити статус задачі");
    }
  };

  const handleDeleteTask = async (taskIndex: number) => {
    try {
      const toDoDocRef = doc(db, "toDoList", toDo.id);
      const toDoDoc = await getDoc(toDoDocRef);

      if (!toDoDoc.exists()) {
        throw new Error("Список задач не знайдено");
      }

      const tasks = [...toDoDoc.data().tasks];
      tasks.splice(taskIndex, 1);

      await updateDoc(toDoDocRef, { tasks });

      setToDoList((prev) =>
        prev.map((item) => (item.id === toDo.id ? { ...item, tasks } : item))
      );
    } catch (error) {
      console.error("Помилка при видаленні задачі:", error);
      alert("Не вдалося видалити задачу");
    }
  };

  return (
    <div className="space-y-2 mb-4 p-2 w-80">
      {toDo.tasks.length > 0 ? (
        toDo.tasks.map((task, index) => (
          <TaskItem
            key={index}
            task={task}
            index={index}
            toDo={toDo}
            setToDoList={setToDoList}
            editingTask={editingTask}
            handleToggleTask={handleToggleTask}
            handleDeleteTask={handleDeleteTask}
            setTaskTexts={setTaskTexts}
            setEditingTask={setEditingTask}
            role={role}
          />
        ))
      ) : (
        <p className="text-gray-500">Поки немає завдань</p>
      )}
    </div>
  );
};

export default TaskList;
