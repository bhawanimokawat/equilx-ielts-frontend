
import React, { useState } from "react";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  BarChart3,
  BookOpen,
  FileText,
  Users,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthNavbar from "../../components/common/AuthNavbar";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // Connect your existing login API here.
      console.log("Login submitted:", formData);

    } catch (err) {
      setError(err.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300">

      {/* Common Authentication Navbar */}
      <AuthNavbar variant="login" />

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Section */}
          <section className="space-y-8">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold tracking-wider">
              <Sparkles size={15} />
              WELCOME BACK
            </div>

            <div className="space-y-5">

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                Your IELTS journey
                <span className="text-rose-500">
                  {" "}continues here.
                </span>
              </h2>

              <p className="text-slate-500 text-base sm:text-lg leading-8 max-w-lg">
                Log in to access personalized practice, mock tests,
                performance tracking and AI-powered feedback.
              </p>

            </div>

            {/* Features */}
            <div className="space-y-6 pt-2">

              <Feature
                icon={BarChart3}
                title="Track your progress"
                description="Monitor your performance across all IELTS skills."
                color="rose"
              />

              <Feature
                icon={BookOpen}
                title="Practice and mock tests"
                description="Prepare with structured IELTS practice sessions."
                color="purple"
              />

              <Feature
                icon={FileText}
                title="AI-powered feedback"
                description="Get insights to improve your writing and speaking."
                color="emerald"
              />

              <Feature
                icon={Users}
                title="Learn with confidence"
                description="Access your learning resources anytime, anywhere."
                color="sky"
              />

            </div>

            {/* Security Information */}
            <div className="flex items-center gap-3 pt-3">

              <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={21} />
              </div>

              <p className="text-sm text-slate-500">
                Secure login. Your learning journey stays protected.
              </p>

            </div>

          </section>

          {/* Login Form Card */}
          <section className="w-full max-w-lg mx-auto">

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 p-7 sm:p-10">

              {/* Card Header */}
              <div className="mb-8">

                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-6">
                  <LockKeyhole size={27} />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Welcome back!
                </h2>

                <p className="text-sm text-slate-500 mt-2 leading-6">
                  Enter your credentials to access your account.
                </p>

              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>

                  <label
                    htmlFor="login-email"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Email address
                  </label>

                  <div className="relative">

                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="login-email"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-50"
                    />

                  </div>
                </div>

                {/* Password */}
                <div>

                  <div className="flex justify-between items-center mb-2">

                    <label
                      htmlFor="login-password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-rose-500 hover:text-rose-700 hover:underline transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <div className="relative">

                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full h-14 pl-12 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-50"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>

                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div
                    role="alert"
                    className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm"
                  >
                    {error}
                  </div>
                )}

                {/* Remember Me */}
                <div className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                  />

                  <label
                    htmlFor="remember"
                    className="text-sm text-slate-500 cursor-pointer"
                  >
                    Remember me
                  </label>

                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-rose-500 hover:bg-rose-600 active:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  {loading ? "Signing in..." : "Log in to your account"}

                  {!loading && <ArrowRight size={18} />}
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-3">

                  <div className="flex-grow border-t border-slate-100" />

                  <span className="px-4 text-xs text-slate-400">
                    OR CONTINUE WITH
                  </span>

                  <div className="flex-grow border-t border-slate-100" />

                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => alert("Google login is not connected yet.")}
                    className="h-12 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-rose-300 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:text-rose-600 transition-all duration-200"
                  >
                    <GoogleIcon />
                    Google
                  </button>

                  <button
                    type="button"
                    onClick={() => alert("Microsoft login is not connected yet.")}
                    className="h-12 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-rose-300 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:text-rose-600 transition-all duration-200"
                  >
                    <MicrosoftIcon />
                    Microsoft
                  </button>

                </div>

                {/* Register Link */}
                <div className="text-center pt-4">

                  <p className="text-sm text-slate-500">
                    Don't have an account?{" "}

                    <Link
                      to="/register"
                      className="text-rose-500 font-bold hover:text-rose-700 hover:underline transition-colors duration-200"
                    >
                      Sign up
                    </Link>
                  </p>

                </div>

              </form>

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

/* Reusable Feature Component */
function Feature({ icon: Icon, title, description, color }) {
  const colors = {
    rose: "bg-rose-50 text-rose-500",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
    sky: "bg-sky-50 text-sky-600",
  };

  return (
    <div className="flex items-center gap-4">

      <div
        className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${colors[color]}`}
      >
        <Icon size={22} />
      </div>

      <div>
        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {description}
        </p>
      </div>

    </div>
  );
}

/* Google Icon */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-5 h-5">
      <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4.1 6v5h6.6c3.9-3.6 6.1-8.9 6.1-14.7Z" />
      <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2C9.2 39.6 16 44 24 44Z" />
      <path fill="#FBBC05" d="M12.6 27.8a12 12 0 0 1 0-7.6V15H5.8a20 20 0 0 0 0 18Z" />
      <path fill="#EA4335" d="M24 11.8c3 0 5.7 1 7.8 3.1l5.9-5.9C34.1 5.7 29.5 4 24 4 16 4 9.2 8.4 5.8 15l6.8 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z" />
    </svg>
  );
}

/* Microsoft Icon */
function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#F35325" d="M1 1h10v10H1z" />
      <path fill="#81BC06" d="M13 1h10v10H13z" />
      <path fill="#05A6F0" d="M1 13h10v10H1z" />
      <path fill="#FFBA08" d="M13 13h10v10H13z" />
    </svg>
  );
}
