
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
  Building2,
  X,
  Sun,
  Moon,
} from "lucide-react";

const pageTitles = {
  "/trainer": "Dashboard",
  "/trainer/dashboard": "Dashboard",
  "/trainer/students": "Student Management",
  "/trainer/assignments": "Assignments & Batches",
  "/trainer/reports": "Student Reports",
  "/trainer/student-reports": "Student Reports",
  "/trainer/writing-grading": "Writing Grading Queue",
  "/trainer/live-speaking": "Live Speaking Test",
  "/trainer/messaging": "Messaging",
  "/trainer/leads": "Leads & CRM",
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { isDark, toggleTheme } = useTheme();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const pageTitle =
    pageTitles[location.pathname] || "Trainer Portal";

  const toggleSidebar = () => {
    window.dispatchEvent(new Event("trainer:toggle-sidebar"));
  };

  const handleSearch = (event) => {
    event.preventDefault();

    if (!searchValue.trim()) return;

    navigate(
      `/trainer/students?search=${encodeURIComponent(
        searchValue.trim()
      )}`
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-[74px] w-full shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 transition-colors duration-300 dark:border-[#3b3441] dark:bg-[#211e27] sm:px-6 lg:px-8">

      {/* Left: Page Title */}
      <div className="flex min-w-0 items-center gap-3">

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle navigation"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-[#10265F] transition hover:bg-slate-50 dark:border-[#3b3441] dark:text-white dark:hover:bg-[#302b37] lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">

          <div className="hidden items-center gap-2 text-[10px] text-[#8A9ABB] dark:text-[#aaa0b5] sm:flex">
            <span>Equilx IELTS</span>
            <span>/</span>
            <span>Trainer Portal</span>
          </div>

          <h2 className="truncate text-sm font-bold text-[#10265F] dark:text-white sm:mt-1 sm:text-base">
            {pageTitle}
          </h2>

        </div>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        role="search"
        className="relative mx-3 hidden max-w-[420px] flex-1 md:block"
      >
        <Search
          size={19}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9ABB]"
        />

        <input
          type="search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search students, assignments..."
          aria-label="Search students and assignments"
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm text-[#10265F] outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:bg-white dark:border-[#3b3441] dark:bg-[#19171e] dark:text-white dark:placeholder:text-[#91899b] dark:focus:border-[#FF2454] dark:focus:bg-[#211e27]"
        />
      </form>

      {/* Right Side */}
      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">

        {/* Institute Label */}
        <div className="hidden items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 transition-colors dark:border-[#3b3441] dark:bg-[#19171e] xl:flex">

          <Building2
            size={20}
            className="text-[#506995] dark:text-[#b0a5bd]"
          />

          <div>
            <p className="text-xs font-bold text-[#10265F] dark:text-white">
              Arya College
            </p>

            <p className="mt-1 text-[10px] text-slate-500 dark:text-[#aaa0b5]">
              Institute
            </p>
          </div>

          <ChevronDown
            size={15}
            className="text-[#506995] dark:text-[#b0a5bd]"
          />

        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#506995] transition-all duration-200 hover:bg-slate-50 dark:border-[#3b3441] dark:bg-[#19171e] dark:text-[#F5C76A] dark:hover:bg-[#302b37]"
        >
          {isDark ? (
            <Sun size={19} />
          ) : (
            <Moon size={19} />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">

          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-[#506995] transition hover:bg-slate-50 dark:border-[#3b3441] dark:text-[#b0a5bd] dark:hover:bg-[#302b37]"
          >
            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#FF2454] dark:border-[#211e27]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-full z-50 mt-3 w-[280px] rounded-xl border border-slate-100 bg-white p-4 shadow-xl transition-colors dark:border-[#3b3441] dark:bg-[#211e27] sm:w-80">

              <div className="flex items-center justify-between">

                <h3 className="text-sm font-bold text-[#10265F] dark:text-white">
                  Notifications
                </h3>

                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  aria-label="Close notifications"
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:text-[#aaa0b5] dark:hover:bg-[#302b37]"
                >
                  <X size={17} />
                </button>

              </div>

              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  navigate("/trainer/writing-grading");
                }}
                className="mt-3 w-full rounded-lg bg-rose-50 p-3 text-left transition hover:bg-rose-100 dark:bg-[#39232f] dark:hover:bg-[#49303d]"
              >
                <p className="text-xs font-semibold text-[#10265F] dark:text-white">
                  Writing Grading
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-[#b0a5bd]">
                  Open the submission review queue.
                </p>
              </button>

              <p className="mt-3 text-[10px] text-slate-400 dark:text-[#91899b]">
                Demo notification
              </p>

            </div>
          )}

        </div>

        {/* Trainer Profile */}
        <div className="relative">

          <button
            type="button"
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotificationsOpen(false);
            }}
            aria-expanded={profileOpen}
            aria-label="Open trainer profile menu"
            className="flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition hover:bg-slate-50 dark:hover:bg-[#302b37] sm:gap-3 sm:px-2"
          >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#203E82] text-xs font-bold text-white">
              TR
            </div>

            <div className="hidden text-left sm:block">

              <p className="text-sm font-bold text-[#10265F] dark:text-white">
                Trainer
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-[#aaa0b5]">
                Academic Team
              </p>

            </div>

            <ChevronDown
              size={16}
              className="hidden text-[#506995] dark:text-[#b0a5bd] sm:block"
            />

          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-3 w-52 rounded-xl border border-slate-100 bg-white p-2 shadow-xl transition-colors dark:border-[#3b3441] dark:bg-[#211e27]">

              <div className="border-b border-slate-100 px-3 py-3 dark:border-[#3b3441]">

                <p className="text-sm font-bold text-[#10265F] dark:text-white">
                  Trainer
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-[#aaa0b5]">
                  Academic Team
                </p>

              </div>

              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 dark:text-[#c9c3d0] dark:hover:bg-[#302b37]"
              >
                <UserRound size={17} />
                My Profile
              </button>

              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 dark:text-[#c9c3d0] dark:hover:bg-[#302b37]"
              >
                <Settings size={17} />
                Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/login");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-rose-600 transition hover:bg-rose-50 dark:text-[#ff718f] dark:hover:bg-[#39232f]"
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
