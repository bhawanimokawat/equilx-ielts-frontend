
import React, { useState } from "react";
import {
  Mail,
  ShieldCheck,
  LockKeyhole,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { Link } from "react-router-dom";
import AuthNavbar from "../../components/common/AuthNavbar";
import authService from "../../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password API Integration
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.forgotPassword(
        email.trim()
      );

      if (response.success) {
        setMessage(
          response.message ||
          "If an account exists with this email, password reset instructions will be sent."
        );
      } else {
        setError(
          response.message || "Unable to process your request."
        );
      }
    } catch (err) {
      setError(
        err.message || "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#17151b] text-slate-800 dark:text-[#f8f7fa] font-sans transition-colors duration-300">

      {/* COMMON AUTH NAVBAR */}
      <AuthNavbar variant="forgot" />

      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-[1440px] mx-auto w-full px-5 sm:px-8 lg:px-12 py-10 lg:py-14">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* LEFT CONTENT */}
          <section className="space-y-8">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 dark:bg-[#38202b] border border-rose-100 dark:border-[#59303e] text-rose-600 dark:text-rose-400 text-xs font-bold tracking-wider">
              <Sparkles size={15} />
              ACCOUNT RECOVERY
            </div>

            <div className="space-y-5">

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                Forgot your
                <span className="text-rose-500">
                  {" "}password?
                </span>
              </h1>

              <p className="text-slate-500 dark:text-[#aaa5b4] text-base sm:text-lg leading-8 max-w-lg">
                Don't worry! It happens. Enter your registered
                email address and we'll help you get back to
                your IELTS preparation journey.
              </p>

            </div>

            {/* BENEFITS */}
            <div className="space-y-6 pt-3">

              <Feature
                icon={Mail}
                title="Quick recovery"
                description="Receive password reset instructions by email."
                color="rose"
              />

              <Feature
                icon={ShieldCheck}
                title="Secure process"
                description="Your account and personal data stay protected."
                color="purple"
              />

              <Feature
                icon={LockKeyhole}
                title="Back to learning"
                description="Get back to your IELTS goals without delay."
                color="emerald"
              />

            </div>

            {/* SECURITY INFORMATION */}
            <div className="flex items-center gap-3 p-4 max-w-lg rounded-2xl bg-emerald-50 dark:bg-[#18352e] border border-emerald-100 dark:border-[#245344]">

              <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-[#21483c] text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  Your security matters
                </p>

                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                  Never share your password reset link with anyone.
                </p>
              </div>

            </div>

          </section>

          {/* RIGHT CARD */}
          <section className="w-full max-w-lg mx-auto">

            <div className="bg-white dark:bg-[#211e27] rounded-3xl border border-slate-200 dark:border-[#3b3441] shadow-xl shadow-slate-200/50 dark:shadow-black/25 p-6 sm:p-9">

              {/* CARD HEADER */}
              <div className="mb-8">

                <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-[#38202b] text-rose-500 flex items-center justify-center mb-6">
                  <Mail size={28} />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Reset your password
                </h2>

                <p className="text-slate-500 dark:text-[#aaa5b4] text-sm leading-6 mt-3">
                  Enter the email address associated with
                  your account. We'll send you instructions
                  to reset your password.
                </p>

              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* EMAIL */}
                <div>

                  <label
                    htmlFor="recovery-email"
                    className="block text-sm font-semibold text-slate-700 dark:text-[#d6d2dc] mb-2"
                  >
                    Email address
                  </label>

                  <div className="relative">

                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="recovery-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setMessage("");
                        setError("");
                      }}
                      placeholder="name@example.com"
                      className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-[#3b3441] bg-slate-50 dark:bg-[#19171e] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#77717f] text-sm outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#211e27] focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    />

                  </div>

                </div>

                {/* SUCCESS MESSAGE */}
                {message && (
                  <div
                    role="status"
                    className="flex gap-3 items-start p-4 rounded-xl bg-blue-50 dark:bg-[#202c3b] text-blue-700 dark:text-blue-300 text-sm border border-blue-100 dark:border-[#34465c]"
                  >
                    <CheckCircle2
                      size={19}
                      className="shrink-0 mt-0.5"
                    />

                    <p className="leading-6">{message}</p>
                  </div>
                )}

                {/* ERROR MESSAGE */}
                {error && (
                  <div
                    role="alert"
                    className="flex gap-3 items-start p-4 rounded-xl bg-red-50 dark:bg-[#3b2025] text-red-600 dark:text-red-300 text-sm border border-red-100 dark:border-[#59303e]"
                  >
                    <ShieldCheck
                      size={19}
                      className="shrink-0 mt-0.5"
                    />

                    <p className="leading-6">{error}</p>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-rose-500 hover:bg-rose-600 active:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  {loading
                    ? "Please wait..."
                    : "Send reset instructions"}

                  {!loading && <ArrowRight size={18} />}
                </button>

              </form>

              {/* DIVIDER */}
              <div className="relative my-7">

                <div className="border-t border-slate-100 dark:border-[#3b3441]" />

                <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-4 bg-white dark:bg-[#211e27] text-xs text-slate-400">
                  OR
                </span>

              </div>

              {/* BACK TO LOGIN */}
              <Link
                to="/login"
                className="w-full min-h-14 flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-[#3b3441] text-sm font-semibold text-slate-600 dark:text-[#d6d2dc] hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-md hover:shadow-rose-500/20 transition-all duration-200"
              >
                <ArrowLeft size={17} />
                Back to login
              </Link>

              {/* SECURITY NOTE */}
              <div className="mt-7 p-4 rounded-2xl bg-slate-50 dark:bg-[#19171e] border border-slate-100 dark:border-[#3b3441]">

                <div className="flex gap-3">

                  <ShieldCheck
                    size={19}
                    className="text-emerald-500 shrink-0"
                  />

                  <p className="text-xs leading-6 text-slate-500 dark:text-[#aaa5b4]">
                    <strong className="text-slate-700 dark:text-white">
                      Security tip:
                    </strong>{" "}
                    Never share your password or password reset
                    link with anyone.
                  </p>

                </div>

              </div>

            </div>

            <p className="text-center text-xs text-slate-400 mt-6">
              © 2026 Equilx IELTS. All rights reserved.
            </p>

          </section>

        </div>

      </main>

    </div>
  );
}

/* FEATURE COMPONENT */
function Feature({ icon: Icon, title, description, color }) {
  const colors = {
    rose: "bg-rose-50 dark:bg-[#38202b] text-rose-500 dark:text-rose-400",
    purple: "bg-purple-50 dark:bg-[#2b2237] text-purple-600 dark:text-purple-400",
    emerald: "bg-emerald-50 dark:bg-[#18352e] text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className="flex gap-4 items-center">

      <div className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center shrink-0`}>
        <Icon size={23} />
      </div>

      <div>
        <h3 className="font-bold text-slate-900 dark:text-white">
          {title}
        </h3>

        <p className="text-sm text-slate-500 dark:text-[#aaa5b4] mt-1">
          {description}
        </p>
      </div>

    </div>
  );
}
