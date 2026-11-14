
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  Users,
  BookOpen,
  ClipboardList,
  ChartNoAxesCombined,
  Target,
  BookMarked,
  CreditCard,
  Settings,
  ChevronDown,
  Landmark,
  Crown,
  ArrowRight,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/institute/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Students",
    path: "/institute/students",
    icon: UserRound,
  },
  {
    name: "Trainers",
    path: "/institute/trainers",
    icon: Users,
  },
  {
    name: "Batches",
    path: "/institute/batches",
    icon: BookOpen,
  },
  {
    name: "Assignments",
    path: "/institute/assignments",
    icon: ClipboardList,
  },
  {
    name: "Reports & Analytics",
    path: "/institute/reports",
    icon: ChartNoAxesCombined,
  },
  {
    name: "CRM",
    path: "/institute/crm",
    icon: Target,
  },
  {
    name: "Study Resources",
    path: "/institute/study-resources",
    icon: BookMarked,
  },
  {
    name: "Plan & Billing",
    path: "/institute/billing",
    icon: CreditCard,
  },
  {
    name: "Settings",
    path: "/institute/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside
      className="
        fixed inset-y-0 left-0 z-50
        flex h-screen w-[260px] shrink-0 flex-col
        border-r border-[#E9EEFA]
        bg-white text-[#10265F]
        transition-colors duration-300
        dark:border-[#3B3441]
        dark:bg-[#211E27]
        dark:text-white
      "
    >
      {/* Institute Profile */}
      <div className="shrink-0 border-b border-[#E9EEFA] px-4 py-4 dark:border-[#3B3441]">
        <button
          type="button"
          className="
            flex w-full items-center justify-between
            rounded-xl border border-[#E9EEFA]
            bg-white p-3 text-left
            transition-all duration-200
            hover:bg-slate-50
            dark:border-[#3B3441]
            dark:bg-[#19171E]
            dark:hover:bg-[#302B37]
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0 items-center
                justify-center rounded-xl
                bg-[#FFF0F4] text-[#FF2454]
                dark:bg-[#39232F]
                dark:text-[#FF6688]
              "
            >
              <Landmark size={21} strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#10265F] dark:text-white">
                Arya College
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-[#AAA0B5]">
                Institute Admin
              </p>
            </div>
          </div>

          <ChevronDown
            size={17}
            className="shrink-0 text-[#506995] dark:text-[#B0A5BD]"
          />
        </button>
      </div>

      {/* Navigation Links */}
      <nav
        className="
          min-h-0 flex-1
          space-y-1
          overflow-x-hidden overflow-y-auto
          px-3 py-3
          [scrollbar-width:thin]
          [scrollbar-color:#C9CFE0_transparent]
          dark:[scrollbar-color:#514858_transparent]
        "
      >
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/institute/dashboard"}
              className={({ isActive }) =>
                `
                  relative flex min-h-[43px]
                  items-center gap-3
                  rounded-lg px-3 py-2.5
                  text-[13px]
                  transition-all duration-200
                  ${
                    isActive
                      ? `
                        bg-gradient-to-r
                        from-rose-50 to-pink-50
                        font-semibold text-[#FF2454]
                        dark:from-[#39232F]
                        dark:to-[#30232F]
                        dark:text-[#FF6688]
                      `
                      : `
                        text-[#506995]
                        hover:bg-slate-50
                        hover:text-[#10265F]
                        dark:text-[#B0A5BD]
                        dark:hover:bg-[#302B37]
                        dark:hover:text-white
                      `
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator */}
                  {isActive && (
                    <span
                      className="
                        absolute bottom-2 left-0 top-2
                        w-1 rounded-r-full
                        bg-[#FF2454]
                      "
                    />
                  )}

                  {/* Icon */}
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.2 : 1.9}
                    className="shrink-0"
                  />

                  {/* Menu Label */}
                  <span className="min-w-0 flex-1 truncate text-[13px]">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Subscription Plan Card */}
      <div
        className="
          shrink-0 border-t border-[#E9EEFA]
          p-4 dark:border-[#3B3441]
        "
      >
        <div
          className="
            rounded-xl border border-pink-100
            bg-gradient-to-br
            from-rose-50 via-pink-50 to-purple-50
            p-3
            dark:border-[#49303D]
            dark:from-[#39232F]
            dark:via-[#30232F]
            dark:to-[#292331]
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl bg-orange-100
                text-orange-500
                dark:bg-[#49372B]
                dark:text-[#FFB66D]
              "
            >
              <Crown size={21} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold text-[#10265F] dark:text-white">
                Institute Pro Plan
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-[#AAA0B5]">
                Manage your subscription
              </p>
            </div>
          </div>

          <NavLink
            to="/institute/billing"
            className="
              mt-3 flex w-full
              items-center justify-center gap-2
              rounded-lg bg-[#FF2454]
              px-3 py-2.5
              text-[13px] font-semibold text-white
              shadow-sm shadow-rose-200
              transition-all duration-200
              hover:bg-rose-600
              hover:shadow-md
              dark:shadow-none
            "
          >
            Manage Plan
            <ArrowRight size={16} />
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
