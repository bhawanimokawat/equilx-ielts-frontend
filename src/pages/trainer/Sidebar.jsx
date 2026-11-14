
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  ChartNoAxesCombined,
  FilePenLine,
  Video,
  MessageCircle,
  UserRoundSearch,
  GraduationCap,
  X,
} from "lucide-react";

const navigation = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        path: "/trainer/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "ACADEMIC MANAGEMENT",
    items: [
      {
        label: "Students",
        path: "/trainer/students",
        icon: Users,
      },
      {
        label: "Assignments & Batches",
        path: "/trainer/assignments",
        icon: ClipboardList,
      },
      {
        label: "Student Reports",
        path: "/trainer/reports",
        icon: ChartNoAxesCombined,
      },
      {
        label: "Writing Grading",
        path: "/trainer/writing-grading",
        icon: FilePenLine,
        badge: "12",
      },
      {
        label: "Live Speaking",
        path: "/trainer/live-speaking",
        icon: Video,
      },
    ],
  },
  {
    title: "COMMUNICATION",
    items: [
      {
        label: "Messaging",
        path: "/trainer/messaging",
        icon: MessageCircle,
      },
      {
        label: "Leads & CRM",
        path: "/trainer/leads",
        icon: UserRoundSearch,
      },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const openMenu = () => setMobileOpen(true);
    const closeMenu = () => setMobileOpen(false);
    const toggleMenu = () => setMobileOpen((prev) => !prev);

    window.addEventListener("trainer:open-sidebar", openMenu);
    window.addEventListener("trainer:close-sidebar", closeMenu);
    window.addEventListener("trainer:toggle-sidebar", toggleMenu);

    return () => {
      window.removeEventListener("trainer:open-sidebar", openMenu);
      window.removeEventListener("trainer:close-sidebar", closeMenu);
      window.removeEventListener("trainer:toggle-sidebar", toggleMenu);
    };
  }, []);

  const isActive = (path) => {
    if (path === "/trainer/dashboard") {
      return (
        location.pathname === "/trainer" ||
        location.pathname === "/trainer/dashboard"
      );
    }

    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] flex-col border-r border-[#E9EEFA] bg-white text-[#10265F] transition-all duration-300 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-white ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E9EEFA] px-5 py-4 dark:border-[#3B3441]">
          <NavLink
            to="/trainer/dashboard"
            onClick={() => setMobileOpen(false)}
            className="group flex min-w-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF2454] to-[#F72585] text-white transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3 group-hover:brightness-110 group-active:scale-95">
              <GraduationCap size={23} strokeWidth={2.2} />
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-extrabold tracking-tight text-[#10265F] dark:text-white">
                equilx<span className="text-[#FF2454]">.</span>
              </h1>

              <p className="mt-1 text-[9px] font-semibold tracking-[2px] text-[#506995] dark:text-[#AAA0B5]">
                IELTS TRAINER
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-[#506995] transition hover:bg-slate-100 dark:text-[#B0A5BD] dark:hover:bg-[#302B37] lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Trainer Workspace */}
        <div className="mx-4 mt-4 shrink-0 rounded-xl border border-[#E9EEFA] bg-white p-3 transition-colors dark:border-[#3B3441] dark:bg-[#19171E]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F4] text-[#FF2454] dark:bg-[#39232F] dark:text-[#FF6688]">
              <GraduationCap size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#10265F] dark:text-white">
                Trainer Workspace
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-[#AAA0B5]">
                Manage your teaching
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="min-h-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto px-3 py-3">
          {navigation.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-3 text-[10px] font-bold tracking-[1.5px] text-[#8A9ABB] dark:text-[#91899B]">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`relative flex min-h-[43px] items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                        active
                          ? "bg-gradient-to-r from-rose-50 to-pink-50 font-semibold text-[#FF2454] dark:from-[#39232F] dark:to-[#30232F] dark:text-[#FF6688]"
                          : "text-[#506995] hover:bg-slate-50 hover:text-[#10265F] dark:text-[#B0A5BD] dark:hover:bg-[#302B37] dark:hover:text-white"
                      }`}
                    >
                      {active && (
                        <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-[#FF2454]" />
                      )}

                      <Icon
                        size={19}
                        strokeWidth={active ? 2.2 : 1.9}
                        className="shrink-0"
                      />

                      <span className="min-w-0 flex-1 text-[13px]">
                        {item.label}
                      </span>

                      {item.badge && (
                        <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-[#FF2454] dark:bg-[#49303D] dark:text-[#FF8DA7]">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Trainer Profile */}
        <div className="shrink-0 border-t border-[#E9EEFA] p-4 dark:border-[#3B3441]">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF2454] to-[#F72585] text-xs font-bold text-white">
              TR
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#10265F] dark:text-white">
                Trainer
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-[#AAA0B5]">
                Academic Team
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
