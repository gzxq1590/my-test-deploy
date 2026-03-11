"use client";

import React, { useState, useEffect, useRef } from "react";
import { Trash2, Plus, CheckCircle2, Circle, Edit2 } from "lucide-react";

type Category = "仕事" | "プライベート" | "その他";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: Category;
}

type FilterStatus = "all" | "active" | "completed";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [inputCategory, setInputCategory] = useState<Category>("仕事");
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editCategory, setEditCategory] = useState<Category>("その他");

  const editInputRef = useRef<HTMLInputElement>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const loadTodos = () => {
      const savedTodos = localStorage.getItem("todos");
      if (savedTodos) {
        try {
          const parsed = JSON.parse(savedTodos);
          // Handle backwards compatibility for missing category
          const normalized = parsed.map((t: Todo) => ({
            ...t,
            category: t.category || "その他"
          }));
          setTodos(normalized);
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

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      category: inputCategory,
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

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditCategory(todo.category);
  };

  const saveEdit = () => {
    if (!editText.trim() && editingId) {
      handleDeleteTodo(editingId);
      setEditingId(null);
      return;
    }

    setTodos(
      todos.map((todo) =>
        todo.id === editingId
          ? { ...todo, text: editText.trim(), category: editCategory }
          : todo
      )
    );
    setEditingId(null);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // If the new focus target is inside the same list item, don't save yet
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      saveEdit();
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  // Prevent hydration mismatch by not rendering until loaded
  if (!isLoaded) {
    return <div className="min-h-[400px] flex items-center justify-center">Loading...</div>;
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;

  const categoryColors: Record<Category, string> = {
    "仕事": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "プライベート": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    "その他": "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[80vh]">
      <div className="p-6 md:p-8 flex-shrink-0">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center justify-between">
          <span>My Tasks</span>
          <span className="text-sm font-normal text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
            {completedCount}/{todos.length} Done
          </span>
        </h1>

        <form onSubmit={handleAddTodo} className="flex flex-col gap-2 mb-6">
          <div className="flex gap-2">
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
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg px-4 py-3 transition-colors flex items-center justify-center shrink-0"
              aria-label="Add task"
            >
              <Plus size={24} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">カテゴリ:</span>
            <select
              value={inputCategory}
              onChange={(e) => setInputCategory(e.target.value as Category)}
              className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="仕事">仕事</option>
              <option value="プライベート">プライベート</option>
              <option value="その他">その他</option>
            </select>
          </div>
        </form>

        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
          {(["all", "active", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === f
                  ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {f === "all" && "すべて"}
              {f === "active" && "進行中"}
              {f === "completed" && "完了済み"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto px-6 md:px-8 pb-6 md:pb-8 flex-1 custom-scrollbar">
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 dark:text-zinc-400 flex flex-col items-center gap-3">
              <CheckCircle2 size={48} className="opacity-20" />
              <p>
                {filter === "all"
                  ? "You're all caught up!"
                  : filter === "active"
                    ? "No active tasks!"
                    : "No completed tasks yet!"}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`group flex items-center justify-between p-4 rounded-lg border transition-all ${
                  todo.completed
                    ? "bg-zinc-50 dark:bg-zinc-800/50 border-transparent"
                    : "bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 shadow-sm"
                }`}
              >
                {editingId === todo.id ? (
                  <div className="flex flex-col gap-2 w-full" onBlur={handleBlur}>
                    <div className="flex gap-2 w-full">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        className="flex-1 bg-white dark:bg-zinc-900 border border-blue-400 dark:border-blue-500 rounded px-2 py-1 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as Category)}
                        className="bg-white dark:bg-zinc-900 border border-blue-400 dark:border-blue-500 rounded px-2 py-1 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="仕事">仕事</option>
                        <option value="プライベート">プライベート</option>
                        <option value="その他">その他</option>
                      </select>
                      <span className="text-xs text-zinc-500">Press Enter to save</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className="flex items-start gap-3 flex-1 cursor-pointer overflow-hidden"
                      onClick={() => handleToggleTodo(todo.id)}
                    >
                      <button
                        className={`flex-shrink-0 mt-0.5 transition-colors ${
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
                      <div className="flex flex-col overflow-hidden">
                        <span
                          className={`text-base truncate transition-all duration-300 ${
                            todo.completed
                              ? "text-zinc-400 dark:text-zinc-500 line-through"
                              : "text-zinc-700 dark:text-zinc-200"
                          }`}
                        >
                          {todo.text}
                        </span>
                        <span className={`text-xs mt-1 px-2 py-0.5 rounded-full w-fit ${categoryColors[todo.category]}`}>
                          {todo.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(todo);
                        }}
                        className="text-zinc-400 hover:text-blue-500 transition-colors focus:outline-none p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        aria-label="Edit task"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTodo(todo.id);
                        }}
                        className="text-zinc-400 hover:text-red-500 transition-colors focus:outline-none p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label="Delete task"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.4);
        }
      `}} />
    </div>
  );
}
