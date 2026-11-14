
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  LibraryBig,
  ChartNoAxesCombined,
  Brain,
  Mic,
  MessageCircle,
  CreditCard,
  Settings,
  Crown,
  ArrowRight,
  X,
  GraduationCap,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
  { label: "Practice", path: "/student/practice", icon: BookOpen },
  { label: "Mock tests", path: "/student/mock-tests", icon: ClipboardList },
  { label: "Study resources", path: "/student/study-resources", icon: LibraryBig },
  { label: "My progress", path: "/student/progress", icon: ChartNoAxesCombined },
  { label: "AI feedback", path: "/student/ai-feedback", icon: Brain },
  { label: "Live speaking", path: "/student/live-speaking", icon: Mic },
  { label: "Chat", path: "/student/chat", icon: MessageCircle },
  { label: "My plan", path: "/student/plan", icon: CreditCard },
  { label: "Settings", path: "/student/settings", icon: Settings },
];

export default function Sidebar({
  isOpen = false,
  onClose = () => {},
}) {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `group relative flex min-h-[43px] items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-rose-50 to-pink-50 font-semibold text-[#FF2454] dark:from-[#3A2530] dark:to-[#302331]"
        : "text-[#506995] hover:bg-[#F7F9FF] hover:text-[#10265F] dark:text-[#B0A5BD] dark:hover:bg-[#302A36] dark:hover:text-white"
    }`;

  const goToDashboard = () => {
    navigate("/student/dashboard");
    onClose();
  };

  const goToPlan = () => {
    navigate("/student/plan");
    onClose();
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#10265F]/40 backdrop-blur-[2px] dark:bg-black/60 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] max-w-[85vw] flex-col overflow-hidden border-r border-[#E9EEFA] bg-white transition-[transform,background-color,border-color] duration-300 dark:border-[#3B3441] dark:bg-[#211E27] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* BRAND */}
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-[#3B3441]">

          <button
            type="button"
            onClick={goToDashboard}
            className="group flex min-w-0 items-center gap-3 text-left"
          >
            {/* Equilx Logo */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF2454] to-[#F72585] text-xl font-extrabold text-white transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3 group-hover:brightness-110 group-active:scale-95">
              e
            </div>

            {/* Brand Name */}
            <div className="min-w-0">
              <h1 className="whitespace-nowrap text-lg font-extrabold leading-tight tracking-tight text-[#10265F] transition-colors duration-300 group-hover:text-[#FF2454] dark:text-white dark:group-hover:text-[#FF2454]">
                Equilx <span className="text-[#FF2454]">IELTS</span>
              </h1>

              <p className="mt-0.5 whitespace-nowrap text-[9px] font-bold tracking-[2px] text-[#6B7FA8] dark:text-[#B0A5BD]">
                PREPARE WITH PURPOSE
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-[#506995] transition hover:bg-[#F7F9FF] dark:text-[#B0A5BD] dark:hover:bg-[#302A36] lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-3">

          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              onClick={onClose}
              className={linkClass}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-[#FF2454]" />
                  )}

                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.4 : 2}
                    className="shrink-0"
                  />

                  <span className="min-w-0 flex-1 truncate">
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}

        </nav>

        {/* FREE PLAN CARD */}
        <div className="shrink-0 border-t border-slate-100 bg-white p-4 transition-colors duration-300 dark:border-[#3B3441] dark:bg-[#211E27]">

          <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4 dark:border-[#514052] dark:from-[#352630] dark:via-[#302633] dark:to-[#29243A]">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-500 dark:bg-orange-500/15 dark:text-orange-300">
                <Crown size={22} fill="currentColor" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#10265F] dark:text-white">
                  Free Plan
                </h3>

                <p className="mt-1 text-[11px] text-slate-500 dark:text-[#B0A5BD]">
                  Your current subscription
                </p>
              </div>

            </div>

            <div className="mt-4 space-y-2.5 text-[11px] text-[#6B7FA8] dark:text-[#B0A5BD]">
              <p>2/2 mock tests used</p>
              <p>8/8 practice tests used</p>
            </div>

            <button
              type="button"
              onClick={goToPlan}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF2454] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-600 active:scale-[0.98]"
            >
              Upgrade Plan
              <ArrowRight size={15} />
            </button>

          </div>

          {/* FOOTER */}
          <div className="flex items-center gap-2 px-2 pb-1 pt-3 text-[10px] text-[#6B7FA8] dark:text-[#91899B]">
            <GraduationCap size={15} />
            <span>Equilx IELTS Student Portal</span>
          </div>

        </div>
      </aside>
    </>
  );
}
