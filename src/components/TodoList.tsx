"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Plus, CheckCircle2, Circle } from "lucide-react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const loadTodos = () => {
      const savedTodos = localStorage.getItem("todos");
      if (savedTodos) {
        try {
          const parsed = JSON.parse(savedTodos);
          setTodos(parsed);
        } catch (error) {
          console.error("Failed to parse todos from localStorage", error);
        }
      }
      setIsLoaded(true);
    };

    // We delay slightly or just do it. React 19 / eslint rules prefer we do this
    // as an initialization or we can ignore the rule for this specific use case
    // since we need to load from local storage after hydration.
    loadTodos();
  }, []);

  // Save to LocalStorage whenever todos change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setInputValue("");
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Prevent hydration mismatch by not rendering until loaded
  if (!isLoaded) {
    return <div className="min-h-[400px] flex items-center justify-center">Loading...</div>;
  }

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center justify-between">
          <span>My Tasks</span>
          <span className="text-sm font-normal text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
            {completedCount}/{todos.length} Done
          </span>
        </h1>

        <form onSubmit={handleAddTodo} className="flex gap-2 mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg px-4 py-3 transition-colors flex items-center justify-center"
            aria-label="Add task"
          >
            <Plus size={24} />
          </button>
        </form>

        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 dark:text-zinc-400 flex flex-col items-center gap-3">
              <CheckCircle2 size={48} className="opacity-20" />
              <p>You&apos;re all caught up!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`group flex items-center justify-between p-4 rounded-lg border transition-all ${
                  todo.completed
                    ? "bg-zinc-50 dark:bg-zinc-800/50 border-transparent"
                    : "bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 shadow-sm"
                }`}
              >
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer overflow-hidden"
                  onClick={() => handleToggleTodo(todo.id)}
                >
                  <button
                    className={`flex-shrink-0 transition-colors ${
                      todo.completed
                        ? "text-blue-500 dark:text-blue-400"
                        : "text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400"
                    }`}
                    aria-label={todo.completed ? "Mark as uncompleted" : "Mark as completed"}
                  >
                    {todo.completed ? (
                      <CheckCircle2 size={24} className="fill-blue-100 dark:fill-blue-900/30" />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>
                  <span
                    className={`text-base truncate transition-all duration-300 ${
                      todo.completed
                        ? "text-zinc-400 dark:text-zinc-500 line-through"
                        : "text-zinc-700 dark:text-zinc-200"
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="ml-2 text-zinc-400 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-red-500 transition-all focus:outline-none p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                  aria-label="Delete task"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
