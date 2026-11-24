import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService1";
import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BarChart2,
  BookOpen,
  ShieldCheck,
  Smartphone,
  Check,
  X,
  Sparkles,
} from "lucide-react";

import AuthNavbar from "../../components/common/AuthNavbar";

export default function RegistrationPage() {
  const navigate = useNavigate();
const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState("individual");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  // Password requirements
  const requirements = {
    length: formData.password.length >= 8,
    letter: /[A-Za-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(formData.password),
  };

  const allRequirementsMet =
    Object.values(requirements).every(Boolean);

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const updateField = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!formData.fullName.trim()) {
    setError("Please enter your full name.");
    return;
  }

  if (!allRequirementsMet) {
    setError("Please meet all password requirements.");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  if (!formData.agree) {
    setError("Please accept Terms & Conditions.");
    return;
  }

  setLoading(true);

  try {
    const response = await authService.register({
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });

    if (response.success && response.data?.verificationRequired) {
      navigate("/verify-email", {
        state: {
          email: formData.email.trim(),
        },
      });
    } else {
      setError(response.message || "Registration failed.");
    }
  } catch (err) {
    setError(err.message || "Unable to register. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#17151b] text-slate-800 dark:text-[#f8f7fa] font-sans transition-colors duration-300">

      {/* COMMON NAVBAR */}
      <AuthNavbar variant="register" />

      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center px-5 sm:px-8 lg:px-12 py-10 lg:py-12">

        {/* LEFT SECTION */}
        <section className="lg:col-span-6 flex flex-col gap-7">

          <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-[#38202b] border border-rose-100 dark:border-[#59303e] text-rose-600 dark:text-rose-400 text-xs font-bold px-4 py-2 rounded-full w-fit">
            <Sparkles size={15} />
            JOIN EQUILX IELTS
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Create your account and{" "}
              <span className="text-rose-500">
                start learning.
              </span>
            </h1>

            <p className="text-slate-600 dark:text-[#aaa5b4] text-base sm:text-lg max-w-lg leading-relaxed mt-5">
              Get access to mock tests, practice questions, AI feedback,
              study material and more. Choose the account type that fits
              your goals.
            </p>
          </div>

          {/* FEATURES */}
          <div className="space-y-6 pt-2">

            <Feature
              icon={BarChart2}
              title="Personalised learning"
              description="Track your progress across all four skills."
              color="rose"
            />

            <Feature
              icon={BookOpen}
              title="Authentic content"
              description="Cambridge IELTS books 1 to 21."
              color="purple"
            />

            <Feature
              icon={ShieldCheck}
              title="AI and human feedback"
              description="Get detailed feedback on Writing and Speaking."
              color="emerald"
            />

            <Feature
              icon={Smartphone}
              title="Study anytime, anywhere"
              description="On web, mobile and tablet."
              color="sky"
            />

          </div>

          {/* SECURITY */}
          <div className="flex items-center gap-3 pt-2">

            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-[#18352e] text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                Your learning journey is secure
              </p>

              <p className="text-xs text-slate-500 dark:text-[#aaa5b4] mt-1">
                Learn, practice and improve with confidence.
              </p>
            </div>

          </div>

        </section>

        {/* REGISTRATION CARD */}
        <section className="lg:col-span-6 w-full">

          <div className="bg-white dark:bg-[#211e27] border border-slate-200 dark:border-[#3b3441] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/25 p-6 sm:p-8">

            {/* CARD HEADER */}
            <div className="text-center mb-7">

              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 dark:bg-[#38202b] text-rose-500 flex items-center justify-center">
                <User size={27} />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Create your account
              </h2>

              <p className="text-sm text-slate-500 dark:text-[#aaa5b4] mt-2">
                Join thousands of learners and start your IELTS journey.
              </p>

            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ACCOUNT TYPE */}
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-50 dark:bg-[#19171e] rounded-2xl border border-slate-100 dark:border-[#3b3441]">

                <button
                  type="button"
                  onClick={() => setAccountType("individual")}
                  className={`flex flex-col items-start p-3 rounded-xl border transition-all duration-200 ${
                    accountType === "individual"
                      ? "bg-white dark:bg-[#302936] border-rose-300 dark:border-rose-500 shadow-sm text-rose-600 dark:text-rose-400"
                      : "border-transparent text-slate-600 dark:text-[#aaa5b4] hover:bg-white dark:hover:bg-[#292530] hover:text-rose-500"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <User size={16} />
                    Individual Student
                  </div>

                  <span className="text-[11px] text-slate-400 dark:text-[#aaa5b4] mt-1">
                    For independent learners
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType("institute")}
                  className={`flex flex-col items-start p-3 rounded-xl border transition-all duration-200 ${
                    accountType === "institute"
                      ? "bg-white dark:bg-[#302936] border-rose-300 dark:border-rose-500 shadow-sm text-rose-600 dark:text-rose-400"
                      : "border-transparent text-slate-600 dark:text-[#aaa5b4] hover:bg-white dark:hover:bg-[#292530] hover:text-rose-500"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <User size={16} />
                    Institute Student
                  </div>

                  <span className="text-[11px] text-slate-400 dark:text-[#aaa5b4] mt-1">
                    Added by your institute
                  </span>
                </button>

              </div>

              {/* FULL NAME */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#d6d2dc] uppercase tracking-wider mb-2">
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="fullName"
                    required
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={updateField}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-[#19171e] border border-slate-200 dark:border-[#3b3441] rounded-xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#77717f] outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#211e27] focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#d6d2dc] uppercase tracking-wider mb-2">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={updateField}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-[#19171e] border border-slate-200 dark:border-[#3b3441] rounded-xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#77717f] outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#211e27] focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  />
                </div>
              </div>

              {/* PASSWORD GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* PASSWORD */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#d6d2dc] uppercase tracking-wider mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={updateField}
                      className="w-full pl-10 pr-10 py-3.5 bg-slate-50 dark:bg-[#19171e] border border-slate-200 dark:border-[#3b3441] rounded-xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#77717f] outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#211e27] focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#d6d2dc] uppercase tracking-wider mb-2">
                    Confirm password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={updateField}
                      className="w-full pl-10 pr-10 py-3.5 bg-slate-50 dark:bg-[#19171e] border border-slate-200 dark:border-[#3b3441] rounded-xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#77717f] outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#211e27] focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

              </div>

              {/* PASSWORD REQUIREMENTS */}
              <div className="rounded-xl border border-slate-200 dark:border-[#3b3441] bg-slate-50 dark:bg-[#19171e] p-4 space-y-3">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#aaa5b4]">
                  Password requirements
                </p>

                <PasswordRequirement met={requirements.length}>
                  At least 8 characters
                </PasswordRequirement>

                <PasswordRequirement met={requirements.letter && requirements.number}>
                  Include a letter and a number
                </PasswordRequirement>

                <PasswordRequirement met={requirements.special}>
                  Include a special character (e.g. ! @ # $)
                </PasswordRequirement>

              </div>

              {/* PASSWORD MATCH STATUS */}
              {formData.confirmPassword.length > 0 && (
                <p className={`text-xs font-semibold ${
                  passwordsMatch
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500"
                }`}>
                  {passwordsMatch
                    ? "✓ Passwords match"
                    : "✕ Passwords do not match"}
                </p>
              )}

              {/* ERROR */}
              {error && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-red-50 dark:bg-[#3b2028] border border-red-100 dark:border-[#69303e] text-red-600 dark:text-red-300 text-sm"
                >
                  {error}
                </div>
              )}

              {/* TERMS */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  name="agree"
                  required
                  checked={formData.agree}
                  onChange={updateField}
                  className="mt-1 h-4 w-4 accent-rose-500 rounded cursor-pointer"
                />

                <label
                  htmlFor="terms"
                  className="text-xs text-slate-500 dark:text-[#aaa5b4] leading-relaxed cursor-pointer"
                >
                  I agree to the{" "}
                  <a
                    href="#terms"
                    className="text-rose-500 font-semibold hover:text-rose-600 hover:underline"
                  >
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#privacy"
                    className="text-rose-500 font-semibold hover:text-rose-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
  type="submit"
  disabled={loading}
  className="w-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-rose-500/20 hover:shadow-rose-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
>
  {loading ? "Creating account..." : "Create account"}
  {!loading && <span>→</span>}
</button>

              {/* DIVIDER */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-[#3b3441]" />

                <span className="flex-shrink mx-4 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  OR
                </span>

                <div className="flex-grow border-t border-slate-200 dark:border-[#3b3441]" />
              </div>

              {/* SOCIAL BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() => alert("Google registration is not connected yet.")}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-[#3b3441] rounded-xl text-xs font-semibold text-slate-700 dark:text-[#e5e1eb] hover:bg-slate-50 dark:hover:bg-[#302936] hover:border-rose-400 hover:text-rose-500 transition-all duration-200"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <button
                  type="button"
                  onClick={() => alert("Microsoft registration is not connected yet.")}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-[#3b3441] rounded-xl text-xs font-semibold text-slate-700 dark:text-[#e5e1eb] hover:bg-slate-50 dark:hover:bg-[#302936] hover:border-rose-400 hover:text-rose-500 transition-all duration-200"
                >
                  <MicrosoftIcon />
                  Continue with Microsoft
                </button>

              </div>

              {/* LOGIN LINK */}
              <div className="text-center pt-2">
                <p className="text-sm text-slate-500 dark:text-[#aaa5b4]">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-rose-500 font-bold hover:text-rose-600 hover:underline transition-colors"
                  >
                    Log in
                  </Link>
                </p>
              </div>

            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            © 2026 Equilx IELTS. All rights reserved.
          </p>

        </section>

      </main>
    </div>
  );
}

/* FEATURE COMPONENT */
function Feature({ icon: Icon, title, description, color }) {
  const colors = {
    rose: "bg-rose-50 dark:bg-[#38202b] text-rose-500",
    purple: "bg-purple-50 dark:bg-[#2b2237] text-purple-600 dark:text-purple-400",
    emerald: "bg-emerald-50 dark:bg-[#18352e] text-emerald-600 dark:text-emerald-400",
    sky: "bg-sky-50 dark:bg-[#1b2d3a] text-sky-600 dark:text-sky-400",
  };

  return (
    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center shrink-0`}>
        <Icon size={22} />
      </div>

      <div>
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
          {title}
        </h3>

        <p className="text-sm text-slate-500 dark:text-[#aaa5b4] mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

/* PASSWORD REQUIREMENT COMPONENT */
function PasswordRequirement({ met, children }) {
  return (
    <div className={`flex items-center gap-3 text-sm font-medium transition-colors duration-200 ${
      met
        ? "text-emerald-600 dark:text-[#00d69a]"
        : "text-slate-400 dark:text-[#77717f]"
    }`}>
      <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center ${
        met
          ? "bg-emerald-100 dark:bg-[#c8f8e9] text-emerald-700"
          : "bg-slate-200 dark:bg-[#35303c] text-slate-500"
      }`}>
        {met ? <Check size={15} strokeWidth={3} /> : <X size={13} />}
      </span>

      {children}
    </div>
  );
}

/* GOOGLE ICON */
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

/* MICROSOFT ICON */
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
