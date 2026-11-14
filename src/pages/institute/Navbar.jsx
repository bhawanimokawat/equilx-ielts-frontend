
import React, { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Moon,
  Sun,
  UserRound,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof document === "undefined") return false;

    return (
      document.documentElement.classList.contains("dark") ||
      document.documentElement.dataset.theme === "dark"
    );
  });

  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // Apply theme globally
  const toggleTheme = () => {
    const nextTheme = !darkMode;

    setDarkMode(nextTheme);

    document.documentElement.classList.toggle("dark", nextTheme);
    document.documentElement.setAttribute(
      "data-theme",
      nextTheme ? "dark" : "light"
    );
  };

  return (
    <header className="sticky top-0 z-40 flex h-[74px] w-full items-center justify-between border-b border-slate-100 bg-white px-6 transition-colors duration-300 dark:border-[#3B3441] dark:bg-[#211E27] md:px-8">

      {/* Logo */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="flex shrink-0 items-center gap-3 text-left"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF2454] text-2xl font-bold text-white shadow-sm">
          e
        </div>

        <div className="leading-tight">
          <h2 className="text-lg font-extrabold tracking-tight text-[#10265F] dark:text-white">
            Equilx <span className="text-[#FF2454]">IELTS</span>
          </h2>

          <p className="mt-1 text-[9px] font-bold tracking-[2px] text-[#506995] dark:text-[#B0A5BD]">
            PREPARE WITH PURPOSE
          </p>
        </div>
      </button>

      {/* Search Bar */}
      <div className="mx-5 hidden max-w-[440px] flex-1 md:block">
        <div className="flex h-10 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 transition focus-within:border-pink-300 focus-within:bg-white dark:border-[#3B3441] dark:bg-[#19171E] dark:focus-within:border-[#FF2454] dark:focus-within:bg-[#19171E]">
          <Search
            size={18}
            className="shrink-0 text-slate-400 dark:text-[#91899B]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students, assignments, tests..."
            aria-label="Search students, assignments and tests"
            className="w-full bg-transparent text-sm text-[#10265F] outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-[#91899B]"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="shrink-0 text-xs text-slate-400 hover:text-rose-500 dark:text-[#91899B]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="ml-auto flex shrink-0 items-center gap-3 md:gap-5">

        {/* Theme Toggle */}
        <button
          type="button"
          aria-label="Toggle theme"
          aria-pressed={darkMode}
          onClick={toggleTheme}
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-[#10265F] transition hover:bg-slate-50 dark:border-[#3B3441] dark:text-[#F5F0FA] dark:hover:bg-[#302A36] sm:flex"
        >
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => navigate("/institute/notifications")}
          className="relative flex h-10 w-10 items-center justify-center border-l border-slate-100 text-[#10265F] transition hover:text-[#FF2454] dark:border-[#3B3441] dark:text-white dark:hover:text-[#FF2454]"
        >
          <Bell size={21} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-white bg-[#FF2454] dark:border-[#211E27]" />
        </button>

        {/* Institute Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfile((prev) => !prev)}
            aria-expanded={showProfile}
            aria-label="Open institute profile menu"
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50 dark:hover:bg-[#302A36]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-lg font-semibold text-white">
              A
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold text-[#10265F] dark:text-white">
                Arya College
              </p>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-[#B0A5BD]">
                Institute Admin
              </p>
            </div>

            <ChevronDown
              size={17}
              className={`text-[#10265F] transition-transform dark:text-white ${
                showProfile ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 top-full z-50 mt-3 w-52 rounded-xl border border-slate-100 bg-white p-2 shadow-xl dark:border-[#3B3441] dark:bg-[#211E27]">

              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);
                  navigate("/institute/settings");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-rose-50 hover:text-[#FF2454] dark:text-[#E8E1ED] dark:hover:bg-[#302A36]"
              >
                <UserRound size={17} />
                Institute Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);
                  navigate("/institute/settings");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-rose-50 hover:text-[#FF2454] dark:text-[#E8E1ED] dark:hover:bg-[#302A36]"
              >
                <Settings size={17} />
                Settings
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-[#3B3441]" />

              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);
                  navigate("/login");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-rose-600 transition hover:bg-rose-50 dark:hover:bg-[#302A36]"
              >
                <LogOut size={17} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
