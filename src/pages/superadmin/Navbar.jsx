
import { useState } from "react";

import {
  Search,
  Bell,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
  ShieldCheck,
  X,
  CheckCheck,
  Moon,
  Sun,
} from "lucide-react";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof document === "undefined") return false;

    return (
      document.documentElement.classList.contains("dark") ||
      document.documentElement.dataset.theme === "dark"
    );
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New institute registered",
      message: "A new institute account requires review.",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Payment received",
      message: "A subscription payment has been recorded.",
      time: "18 min ago",
      unread: true,
    },
    {
      id: 3,
      title: "AI usage report ready",
      message: "The latest usage summary is available.",
      time: "1 hour ago",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((item) => item.unread).length;

  // Toggle Dark / Light Theme
  const toggleTheme = () => {
    const nextTheme = !darkMode;

    setDarkMode(nextTheme);

    document.documentElement.classList.toggle("dark", nextTheme);
    document.documentElement.setAttribute(
      "data-theme",
      nextTheme ? "dark" : "light"
    );
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const query = search.trim();
    if (!query) return;

    // Demo search: wire this to your app's search/API when available.
    window.dispatchEvent(
      new CustomEvent("superadmin-search", {
        detail: { query },
      })
    );
  };

  const markAllRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, unread: false }))
    );
  };

  return (
    <header className="sticky top-0 z-40 flex h-[72px] w-full items-center justify-between gap-4 border-b border-[#E9EEFA] bg-white px-4 transition-colors duration-300 dark:border-[#3B3441] dark:bg-[#211E27] sm:px-6 lg:px-8">

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-[440px]"
      >
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7183A7] dark:text-[#91899B]"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search users, institutes, content, etc..."
          aria-label="Search platform"
          className="h-10 w-full rounded-xl border border-[#E7ECF8] bg-[#FBFCFF] pl-10 pr-10 text-sm text-[#10265F] outline-none transition placeholder:text-[#8A9ABB] focus:border-[#B9C8F5] focus:bg-white focus:ring-2 focus:ring-blue-50 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:placeholder:text-[#91899B] dark:focus:border-[#6579B8] dark:focus:bg-[#19171E] dark:focus:ring-[#303B58]"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-[#91899B] dark:hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Right actions */}
      <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5">

        {/* Dark / Light Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          aria-pressed={darkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[#506995] transition hover:bg-[#F5F7FF] hover:text-[#10265F] dark:text-[#B0A5BD] dark:hover:bg-[#302A36] dark:hover:text-white"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications((previous) => !previous);
              setShowProfile(false);
            }}
            aria-label="Notifications"
            aria-expanded={showNotifications}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#506995] transition hover:bg-[#F5F7FF] hover:text-[#10265F] dark:text-[#B0A5BD] dark:hover:bg-[#302A36] dark:hover:text-white"
          >
            <Bell size={21} />

            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-[#FF2454] px-1 text-[9px] font-bold text-white dark:border-[#211E27]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-[min(350px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl dark:border-[#3B3441] dark:bg-[#211E27]">

              <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-[#3B3441]">
                <div>
                  <h3 className="text-sm font-bold text-[#10265F] dark:text-white">
                    Notifications
                  </h3>

                  <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
                    {unreadCount} unread notifications
                  </p>
                </div>

                <button
                  type="button"
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs font-semibold text-[#FF2454] hover:text-rose-700"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              </div>

              <div className="max-h-[330px] overflow-y-auto">
                {notifications.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setNotifications((previous) =>
                        previous.map((notification) =>
                          notification.id === item.id
                            ? { ...notification, unread: false }
                            : notification
                        )
                      )
                    }
                    className={`flex w-full gap-3 border-b border-slate-50 p-4 text-left transition dark:border-[#3B3441] dark:hover:bg-[#302A36] ${
                      item.unread
                        ? "bg-blue-50/40 dark:bg-[#283044]"
                        : "bg-white dark:bg-[#211E27]"
                    }`}
                  >
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300">
                      <ShieldCheck size={18} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#10265F] dark:text-white">
                          {item.title}
                        </span>

                        {item.unread && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF2454]" />
                        )}
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-[#B0A5BD]">
                        {item.message}
                      </span>

                      <span className="mt-1.5 block text-[10px] text-slate-400 dark:text-[#91899B]">
                        {item.time}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="w-full p-3 text-xs font-semibold text-[#10265F] hover:bg-slate-50 dark:text-white dark:hover:bg-[#302A36]"
              >
                Close notifications
              </button>
            </div>
          )}
        </div>

        <div className="hidden h-8 w-px bg-slate-100 dark:bg-[#3B3441] sm:block" />

        {/* Admin profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfile((previous) => !previous);
              setShowNotifications(false);
            }}
            aria-expanded={showProfile}
            className="flex items-center gap-2.5 rounded-xl p-1.5 text-left transition hover:bg-[#F8FAFF] dark:hover:bg-[#302A36] sm:gap-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-base font-bold text-white shadow-sm">
              A
            </span>

            <span className="hidden min-w-0 sm:block">
              <span className="block text-sm font-bold text-[#10265F] dark:text-white">
                Super Admin
              </span>

              <span className="mt-0.5 block text-[11px] text-[#7183A7] dark:text-[#B0A5BD]">
                admin@equilx.com
              </span>
            </span>

            <ChevronDown
              size={16}
              className={`hidden text-[#506995] transition dark:text-[#B0A5BD] sm:block ${
                showProfile ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl dark:border-[#3B3441] dark:bg-[#211E27]">

              <div className="border-b border-slate-100 px-3 py-3 dark:border-[#3B3441]">
                <p className="text-sm font-bold text-[#10265F] dark:text-white">
                  Super Admin
                </p>

                <p className="mt-1 break-all text-xs text-slate-400 dark:text-[#91899B]">
                  admin@equilx.com
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);
                  window.location.href = "/superadmin/settings";
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#10265F] dark:text-[#B0A5BD] dark:hover:bg-[#302A36] dark:hover:text-white"
              >
                <UserRound size={17} />
                My Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);
                  window.location.href = "/superadmin/settings";
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#10265F] dark:text-[#B0A5BD] dark:hover:bg-[#302A36] dark:hover:text-white"
              >
                <Settings size={17} />
                Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);
                  window.location.href = "/login";
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-[#302A36]"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
