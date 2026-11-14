
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function AuthNavbar({ variant = "login" }) {
  const actions = {
    login: {
      text: "New to Equilx?",
      linkText: "Create account",
      to: "/register",
      button: true,
    },
    register: {
      text: "Already have an account?",
      linkText: "Log in",
      to: "/login",
      button: false,
    },
    forgot: {
      text: "Remember your password?",
      linkText: "Log in",
      to: "/login",
      button: false,
    },
    reset: {
      text: "Back to Login",
      linkText: "",
      to: "/login",
      button: false,
    },
    verify: {
      text: "Back to Register",
      linkText: "",
      to: "/register",
      button: false,
    },
  };

  const action = actions[variant] || actions.login;

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-[42px] h-[42px] shrink-0 rounded-xl bg-rose-500 text-white flex items-center justify-center text-xl font-extrabold shadow-lg shadow-rose-500/30 transition-all duration-200 group-hover:scale-105">
            e
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl leading-tight font-extrabold tracking-tight text-slate-900 dark:text-white">
              Equilx{" "}
              <span className="text-rose-500">IELTS</span>
            </h1>

            <p className="text-[8px] tracking-[2px] text-slate-400 dark:text-slate-400 uppercase mt-0.5">
              Prepare with purpose
            </p>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">

          {/* Global Theme Toggle */}
          <ThemeToggle />

          {action.linkText ? (
            <div className="flex items-center gap-2.5 sm:gap-4">

              <span className="hidden sm:block text-xs sm:text-sm text-slate-500 dark:text-slate-300">
                {action.text}
              </span>

              <Link
                to={action.to}
                className={
                  action.button
                    ? "px-4 py-2.5 rounded-lg bg-rose-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/20 hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    : "px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-md transition-all duration-200"
                }
              >
                {action.linkText}
              </Link>

            </div>
          ) : (
            <Link
              to={action.to}
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-300 hover:text-rose-500 transition-colors duration-200"
            >
              <ArrowLeft size={16} />
              {action.text}
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}
