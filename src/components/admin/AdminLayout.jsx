import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  UploadCloud,
  PlusCircle,
  LayoutDashboard,
  Home,
  Sun,
  Moon,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/useAuth.js";

export function AdminLayout({ children }) {
  const { user, role, logout } = useAuth();
  const location = useLocation();

  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("equilx-theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("equilx-theme", dark ? "dark" : "light");
      if (dark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // Ignore
    }
  }, [dark]);

  const navLinks = [
    {
      to: "/admin/tests",
      label: "Test Catalog",
      icon: FileText,
      active: location.pathname === "/admin/tests" || location.pathname === "/admin",
    },
    {
      to: "/admin/import",
      label: "Bulk Import Center",
      icon: UploadCloud,
      badge: "CSV / JSON",
      active: location.pathname === "/admin/import",
    },
    {
      to: "/admin/tests/new",
      label: "Create Test",
      icon: PlusCircle,
      active: location.pathname === "/admin/tests/new",
    },
  ];

  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex min-h-screen bg-[#F8F9FA] text-[#2B3467] dark:bg-[#17151b] dark:text-[#fff8fa]">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-[#3a2930] dark:bg-[#211b22] lg:flex">
          {/* Brand header */}
          <div className="flex h-[76px] items-center gap-3 border-b border-slate-200 px-6 dark:border-[#3a2930]">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="brand-mark !h-9 !w-9 !rounded-xl !text-lg">e</span>
              <span className="leading-tight">
                <span className="block text-base font-bold tracking-tight">
                  Equilx <span className="text-[#EB455F]">IELTS</span>
                </span>
                <span className="block text-[9px] font-bold tracking-widest text-slate-400">
                  ADMIN CMS
                </span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5 px-4 py-6">
            <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Content Management
            </div>

            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                    item.active
                      ? "bg-[#EB455F] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#33252c]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        item.active
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 text-slate-600 dark:bg-[#402a32] dark:text-[#ffb5c3]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-6 px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Quick Portals
            </div>

            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#33252c]"
            >
              <LayoutDashboard size={17} />
              <span>Student Workspace</span>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#33252c]"
            >
              <Home size={17} />
              <span>Landing Page</span>
            </Link>
          </nav>

          {/* User profile / Role Switcher in Sidebar */}
          <div className="border-t border-slate-200 p-4 dark:border-[#3a2930]">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-[#49313a] dark:bg-[#1c171d]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold truncate">{user?.fullName}</span>
                <span className="rounded-full bg-[#EB455F]/10 px-2 py-0.5 text-[10px] font-bold text-[#EB455F]">
                  {role}
                </span>
              </div>
              <div className="mt-2 text-[10px] text-slate-500 truncate">{user?.email}</div>

              <button type="button" onClick={logout} className="mt-3 inline-flex items-center gap-2 border-t border-slate-200 pt-3 text-[11px] font-semibold text-slate-600 hover:text-[#EB455F] dark:border-[#3a2930] dark:text-slate-300">
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col lg:pl-64">
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md dark:border-[#3a2930] dark:bg-[#17151b]/95">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-500">Admin Control</span>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="text-sm font-bold capitalize">
                {location.pathname.replace("/admin/", "").replace("/", " ") || "Dashboard"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={() => setDark((v) => !v)}
                className="theme-toggle"
                aria-label="Toggle Theme"
              >
                {dark ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              <Link
                to="/admin/import"
                className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold transition hover:border-[#EB455F] sm:inline-flex dark:border-[#49313a]"
              >
                <UploadCloud size={15} className="text-[#EB455F]" />
                <span>Bulk Import</span>
              </Link>

              <Link
                to="/admin/tests/new"
                className="inline-flex items-center gap-2 rounded-xl bg-[#EB455F] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#cf334d]"
              >
                <PlusCircle size={15} />
                <span>New Test</span>
              </Link>
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
