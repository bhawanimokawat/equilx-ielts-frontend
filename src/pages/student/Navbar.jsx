
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import ThemeToggle from "../../components/common/ThemeToggle";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim().toLowerCase();
    if (!query) return;

    const routes = [
      { keywords: ["dashboard", "home"], path: "/student/dashboard" },
      { keywords: ["mock", "test", "exam"], path: "/student/mock-tests" },
      {
        keywords: ["resource", "book", "study material"],
        path: "/student/study-resources",
      },
      {
        keywords: ["progress", "score", "band"],
        path: "/student/progress",
      },
      {
        keywords: ["practice", "reading", "writing", "listening"],
        path: "/student/practice",
      },
      {
        keywords: ["setting", "profile", "account"],
        path: "/student/settings",
      },
      {
        keywords: ["feedback", "ai"],
        path: "/student/ai-feedback",
      },
      {
        keywords: ["speaking", "live"],
        path: "/student/live-speaking",
      },
      {
        keywords: ["chat", "message"],
        path: "/student/chat",
      },
      {
        keywords: ["plan", "subscription", "upgrade"],
        path: "/student/plan",
      },
    ];

    const match = routes.find((item) =>
      item.keywords.some((keyword) => query.includes(keyword))
    );

    navigate(match ? match.path : "/student/practice");
    setSearch("");
  };

  return (
    <header className="sticky top-0 z-30 h-[78px] shrink-0 border-b border-[#E8ECF5] dark:border-[#393440] bg-white/95 dark:bg-[#211e27]/95 backdrop-blur-xl transition-colors duration-300">

      <div className="flex h-full min-w-0 items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:gap-5 lg:px-7">

        {/* MOBILE MENU */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E8ECF5] dark:border-[#3b3441] text-[#10265F] dark:text-[#f8f7fa] transition hover:bg-[#F5F7FF] dark:hover:bg-[#302b37] lg:hidden"
        >
          <Menu size={21} />
        </button>

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="relative hidden min-w-0 max-w-[600px] flex-1 md:block"
        >
          <Search
            size={21}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#71809D] dark:text-[#aaa5b4]"
          />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for tests, practice questions, study materials..."
            aria-label="Search student resources"
            className="h-[44px] w-full rounded-[15px] border border-transparent bg-[#F2F5FD] dark:bg-[#19171e] pl-12 pr-11 text-[14px] text-[#10265F] dark:text-white outline-none transition placeholder:text-[#71809D] dark:placeholder:text-[#77717f] focus:border-[#C8D5F5] dark:focus:border-[#ff456c] focus:bg-white dark:focus:bg-[#25212c]"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#71809D] dark:text-[#aaa5b4] hover:text-[#FF2454]"
            >
              <X size={17} />
            </button>
          )}
        </form>

        {/* RIGHT ACTIONS */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">

          {/* THEME TOGGLE */}
          <ThemeToggle />

          {/* NOTIFICATIONS */}
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={showNotifications}
              onClick={() => {
                setShowNotifications((value) => !value);
                setShowProfile(false);
              }}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#E8ECF5] dark:border-[#3b3441] text-[#10265F] dark:text-[#f8f7fa] transition hover:bg-[#F5F7FF] dark:hover:bg-[#302b37]"
            >
              <Bell size={21} />
              <span className="absolute right-[7px] top-[6px] h-[9px] w-[9px] rounded-full bg-[#FF2454] ring-2 ring-white dark:ring-[#211e27]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-[54px] z-50 w-[min(320px,calc(100vw-24px))] rounded-2xl border border-[#E8ECF5] dark:border-[#3b3441] bg-white dark:bg-[#211e27] p-4 shadow-xl">

                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#10265F] dark:text-white">
                    Notifications
                  </h3>

                  <button
                    type="button"
                    aria-label="Close notifications"
                    onClick={() => setShowNotifications(false)}
                    className="rounded-md p-1 text-[#71809D] dark:text-[#aaa5b4] hover:bg-[#F5F7FF] dark:hover:bg-[#302b37]"
                  >
                    <X size={17} />
                  </button>
                </div>

                <div className="mt-4 flex gap-3 rounded-xl bg-[#FFF2F5] dark:bg-[#38202b] p-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white dark:bg-[#211e27] text-[#FF2454]">
                    <Bell size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#10265F] dark:text-white">
                      Keep practising!
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#71809D] dark:text-[#aaa5b4]">
                      Continue your IELTS preparation today.
                    </p>
                  </div>

                </div>

                <p className="mt-3 text-center text-[11px] text-[#9AA8C2] dark:text-[#77717f]">
                  Sample notification
                </p>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative">

            <button
              type="button"
              aria-label="Open profile menu"
              aria-expanded={showProfile}
              onClick={() => {
                setShowProfile((value) => !value);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-[#F5F7FF] dark:hover:bg-[#302b37] sm:gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E8ECF5] dark:border-[#3b3441] bg-[#F2F5FD] dark:bg-[#302b37] text-[#10265F] dark:text-white">
                <UserRound size={23} />
              </div>

              <div className="hidden sm:block">
                <p className="whitespace-nowrap text-[13px] font-bold text-[#10265F] dark:text-white">
                  Dinesh Prajapat
                </p>

                <p className="mt-1 whitespace-nowrap text-[11px] text-[#506995] dark:text-[#aaa5b4]">
                  Individual Student
                </p>
              </div>

              <ChevronDown
                size={17}
                className={`hidden shrink-0 text-[#10265F] dark:text-white transition sm:block ${
                  showProfile ? "rotate-180" : ""
                }`}
              />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-[54px] z-50 w-[210px] rounded-2xl border border-[#E8ECF5] dark:border-[#3b3441] bg-white dark:bg-[#211e27] p-2 shadow-xl">

                <div className="border-b border-[#EDF0F7] dark:border-[#3b3441] px-3 py-3">
                  <p className="text-sm font-bold text-[#10265F] dark:text-white">
                    Dinesh Prajapat
                  </p>

                  <p className="mt-1 text-xs text-[#71809D] dark:text-[#aaa5b4]">
                    Individual Student
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfile(false);
                    navigate("/student/settings");
                  }}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#506995] dark:text-[#c4bfcc] hover:bg-[#F5F7FF] dark:hover:bg-[#302b37]"
                >
                  <UserRound size={17} />
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfile(false);
                    navigate("/student/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#506995] dark:text-[#c4bfcc] hover:bg-[#F5F7FF] dark:hover:bg-[#302b37]"
                >
                  <Settings size={17} />
                  Settings
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfile(false);
                    navigate("/login");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#FF2454] hover:bg-rose-50 dark:hover:bg-[#38202b]"
                >
                  <LogOut size={17} />
                  Log out
                </button>

              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
