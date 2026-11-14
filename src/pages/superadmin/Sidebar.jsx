
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  LibraryBig,
  Users,
  CreditCard,
  BrainCircuit,
  Activity,
  ScrollText,
  Settings,
  ChevronDown,
  ShieldCheck,
  Crown,
  ArrowRight,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/superadmin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Cambridge Content",
    path: "/superadmin/cambridge-content",
    icon: BookOpen,
  },
  {
    name: "Study Materials",
    path: "/superadmin/study-materials",
    icon: LibraryBig,
  },
  {
    name: "Users & Institutes",
    path: "/superadmin/users-institutes",
    icon: Users,
  },
  {
    name: "Plans & Payments",
    path: "/superadmin/plans-payments",
    icon: CreditCard,
  },
  {
    name: "AI Settings",
    path: "/superadmin/ai-settings",
    icon: BrainCircuit,
  },
  {
    name: "System Health",
    path: "/superadmin/system-health",
    icon: Activity,
  },
  {
    name: "Audit Logs",
    path: "/superadmin/audit-logs",
    icon: ScrollText,
  },
  {
    name: "Settings",
    path: "/superadmin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-[260px] flex-col border-r border-[#E9EEFA] bg-white transition-colors duration-300 dark:border-[#3B3441] dark:bg-[#211E27]">

      {/* Brand */}
      <div className="shrink-0 border-b border-slate-100 px-5 py-4 dark:border-[#3B3441]">
        <NavLink
          to="/superadmin/dashboard"
          className="group flex items-center gap-3"
        >
          {/* Equilx Logo */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF2454] to-[#F72585] text-xl font-extrabold text-white transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3 group-hover:brightness-110 group-active:scale-95">
            e
          </div>

          {/* Brand Name */}
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-[#10265F] transition-colors duration-300 group-hover:text-[#FF2454] dark:text-white dark:group-hover:text-[#FF2454]">
              Equilx <span className="text-[#FF2454]">IELTS</span>
            </h2>

            <p className="mt-0.5 text-[9px] font-bold tracking-[2px] text-[#6B7FA8] dark:text-[#B0A5BD]">
              PREPARE WITH PURPOSE
            </p>
          </div>
        </NavLink>
      </div>

      {/* Admin Profile */}
      <div className="shrink-0 px-4 pb-3 pt-5">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-xl border border-[#E9EEFA] p-3 text-left transition hover:bg-[#F8FAFF] dark:border-[#3B3441] dark:hover:bg-[#302A36]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300">
              <ShieldCheck size={21} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#10265F] dark:text-white">
                Super Admin
              </p>

              <p className="mt-1 text-[11px] text-[#7183A7] dark:text-[#B0A5BD]">
                Platform Administrator
              </p>
            </div>
          </div>

          <ChevronDown
            size={16}
            className="shrink-0 text-[#10265F] dark:text-[#B0A5BD]"
          />
        </button>
      </div>

      {/* Navigation - independently scrollable */}
      <nav className="min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto px-3 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `group relative flex min-h-[43px] w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-rose-50 to-pink-50 font-semibold text-[#FF2454] dark:from-[#3A2530] dark:to-[#302331]"
                    : "text-[#506995] hover:bg-[#F7F9FF] hover:text-[#10265F] dark:text-[#B0A5BD] dark:hover:bg-[#302A36] dark:hover:text-white"
                }`
              }
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

                  <span className="min-w-0 flex-1">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Plan Card */}
      <div className="shrink-0 border-t border-slate-100 bg-white p-4 transition-colors duration-300 dark:border-[#3B3441] dark:bg-[#211E27]">
        <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4 dark:border-[#514052] dark:from-[#352630] dark:via-[#302633] dark:to-[#29243A]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-500 dark:bg-orange-500/15 dark:text-orange-300">
              <Crown size={22} />
            </div>

            <div>
              <p className="text-sm font-bold text-[#10265F] dark:text-white">
                Platform Admin
              </p>

              <p className="mt-1 text-[11px] text-slate-500 dark:text-[#B0A5BD]">
                All systems overview
              </p>
            </div>
          </div>

          <NavLink
            to="/superadmin/plans-payments"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF2454] px-3 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-100 transition hover:bg-rose-600"
          >
            Manage Plans
            <ArrowRight size={15} />
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
