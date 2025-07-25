"use client";

import { Content } from "@/components/expense/context";
import { SignOutButton } from "@/components/login/signoutbutton";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-black dark:text-white">
              Prosper
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Financial tracking made simple
            </p>
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Content />
      </main>
    </div>
  );
}
