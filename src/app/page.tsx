import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl md:text-6xl">
            Todo MVP
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-zinc-500 dark:text-zinc-400">
            A simple, responsive Todo app built with Next.js App Router, Tailwind CSS, and LocalStorage.
          </p>
        </div>

        <TodoList />

        <div className="text-center text-sm text-zinc-500 dark:text-zinc-500 mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <p>Built as an MVP for quick iteration and easy copy-pasting.</p>
        </div>
      </div>
    </main>
  );
}
