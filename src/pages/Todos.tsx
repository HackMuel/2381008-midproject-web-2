import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchData, createData, deleteData, updateData } from "../services/apiService";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId?: number;
}

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchData<{ todos: Todo[] }>("todos")
      .then((data) => setTodos(data.todos))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  const addTodo = async () => {
    if (newTodo.trim() === "") return;

    try {
      const todoFromAPI = await createData<Todo>("todos/add", {
        todo: newTodo,
        completed: false,
        userId: 1,
      });

      setTodos((prevTodos) => [todoFromAPI, ...prevTodos]);
      setNewTodo("");
    } catch (error) {
      console.error("POST request failed:", error);
    }
  };

  const updateTodo = async (id: number, todoText: string) => {
    const updatedText = prompt("Edit todo:", todoText);
    if (!updatedText || updatedText.trim() === "") return;

    try {
      const updatedTodo = await updateData<Todo>("todos", id, { todo: updatedText });

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, todo: updatedTodo.todo } : todo))
      );
    } catch (error) {
      console.error("PUT request failed:", error);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    setTodos((prevTodos) =>
      prevTodos.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
    );

    try {
      const updatedTodo = await updateData<Todo>("todos", id, { completed: !completed });

      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === id ? { ...t, completed: updatedTodo.completed } : t))
      );
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const removeTodo = async (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

    try {
      await deleteData("todos", id);
    } catch (error) {
      console.error("DELETE request failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-blue-900 p-6 pt-24">
      <motion.h2
        className="text-4xl md:text-6xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Todos
      </motion.h2>

      <div className="max-w-xl w-full bg-gray-800 p-6 rounded-lg shadow-md">
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new todo"
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
          />
          <motion.button
            onClick={addTodo}
            className="mt-2 w-full bg-blue-500 text-white py-2 rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Todo
          </motion.button>
        </motion.div>

        <div className="overflow-y-auto max-h-[60vh] w-full">
          <AnimatePresence>
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                className={`flex justify-between p-3 rounded shadow ${
                  todo.completed ? "bg-green-500 text-white" : "bg-gray-700 text-white"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <span className={todo.completed ? "line-through text-gray-300" : ""}>
                  {todo.todo}
                </span>
                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    className="text-blue-400"
                    whileHover={{ scale: 1.2 }}
                  >
                    {todo.completed ? "🔄" : "✔"}
                  </motion.button>
                  <motion.button
                    onClick={() => updateTodo(todo.id, todo.todo)}
                    className="text-yellow-400"
                    whileHover={{ scale: 1.2 }}
                  >
                    ✎
                  </motion.button>
                  <motion.button
                    onClick={() => removeTodo(todo.id)}
                    className="text-red-400"
                    whileHover={{ scale: 1.2 }}
                  >
                    ✖
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Todos;