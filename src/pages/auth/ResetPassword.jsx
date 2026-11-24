
import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ThemeToggle from "../../components/common/ThemeToggle";
import authService from "../../services/authService1";

export default function NewPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get reset token from URL
  const token = searchParams.get("token") || "";

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Password validation
  // Backend requires minimum 12 characters.
  const requirements = {
    length: formData.newPassword.length >= 8,
    letter: /[A-Za-z]/.test(formData.newPassword),
    number: /[0-9]/.test(formData.newPassword),
    special: /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(
      formData.newPassword
    ),
  };

  const allRequirementsMet = Object.values(requirements).every(Boolean);

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.newPassword === formData.confirmPassword;

  // Reset Password API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError(
        "Password reset token is missing or invalid. Please request a new reset link."
      );
      return;
    }

    if (!allRequirementsMet) {
      setError("Please meet all password requirements.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.resetPassword({
        token,
        newPassword: formData.newPassword,
      });

      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || "Unable to reset password.");
      }
    } catch (err) {
      setError(
        err.message || "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const Requirement = ({ met, children }) => (
    <div
      className={`flex items-center gap-2 text-xs font-medium ${
        met ? "text-emerald-600" : "text-slate-500"
      }`}
    >
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center ${
          met ? "bg-emerald-100" : "bg-slate-100"
        }`}
      >
        {met ? <Check size={12} /> : <X size={11} />}
      </span>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-colors duration-300">

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-rose-500 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md shadow-rose-500/20">
              e
            </div>

            <div>
              <h1 className="text-lg font-extrabold text-slate-900">
                Equilx <span className="text-rose-500">IELTS</span>
              </h1>

              <p className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase">
                Prepare with purpose
              </p>
            </div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />

            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-rose-500 transition"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>

        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-6 md:px-12 py-10 lg:py-16">

        {/* LEFT SECTION */}
        <section className="lg:col-span-6 flex flex-col space-y-8">

          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-2 rounded-full w-fit uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Account Security
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Create a strong{" "}
              <span className="text-rose-500">
                new password.
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-lg leading-relaxed mt-5">
              Secure your Equilx IELTS account with a new password.
              Choose a strong password that is easy for you to remember
              but difficult for others to guess.
            </p>
          </div>

          {/* FEATURES */}
          <div className="space-y-6 pt-2">

            <Feature
              icon={ShieldCheck}
              title="Secure & protected"
              description="Keep your personal account and learning data protected."
              color="rose"
            />

            <Feature
              icon={Lock}
              title="Strong password"
              description="Use a combination of letters, numbers and special characters."
              color="purple"
            />

            <Feature
              icon={KeyRound}
              title="Regain account access"
              description="Continue your IELTS preparation without interruption."
              color="emerald"
            />

          </div>

          {/* SECURITY NOTE */}
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl max-w-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={21} />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Your security matters
              </p>

              <p className="text-xs text-emerald-700 mt-1">
                Never share your password or reset link with anyone.
              </p>
            </div>
          </div>

        </section>

        {/* ================= PASSWORD RESET CARD ================= */}
        <section className="lg:col-span-6 w-full max-w-lg mx-auto">

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-9">

            {success ? (
              /* SUCCESS STATE */
              <div className="text-center py-8">

                <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                  <CheckCircle2 size={42} />
                </div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Password updated!
                </h2>

                <p className="text-sm text-slate-500 mt-3 leading-6">
                  Your password has been reset successfully.
                  Continue to login to access your account.
                </p>

                <Link
                  to="/login"
                  className="mt-8 w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2"
                >
                  Continue to Login
                  <ArrowLeft size={17} className="rotate-180" />
                </Link>

              </div>
            ) : (
              <>

                {/* CARD HEADER */}
                <div className="mb-8">

                  <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-5">
                    <KeyRound size={27} />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Create a new password
                  </h2>

                  <p className="text-sm text-slate-500 mt-2 leading-6">
                    Enter your new password below to securely reset
                    your account password.
                  </p>

                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* NEW PASSWORD */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      New password
                    </label>

                    <div className="relative">

                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                        <Lock size={18} />
                      </span>

                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="Enter your new password"
                        value={formData.newPassword}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            newPassword: e.target.value,
                          });
                          setError("");
                        }}
                        className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(!showNewPassword)
                        }
                        aria-label={
                          showNewPassword ? "Hide password" : "Show password"
                        }
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-rose-500"
                      >
                        {showNewPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>

                    </div>
                  </div>

                  {/* PASSWORD REQUIREMENTS */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">

                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password requirements
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                      <Requirement met={requirements.length}>
                        At least 8 characters
                      </Requirement>

                      <Requirement met={requirements.letter}>
                        At least one letter
                      </Requirement>

                      <Requirement met={requirements.number}>
                        At least one number
                      </Requirement>

                      <Requirement met={requirements.special}>
                        One special character
                      </Requirement>

                    </div>

                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Confirm new password
                    </label>

                    <div className="relative">

                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                        <Lock size={18} />
                      </span>

                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="Confirm your new password"
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          });
                          setError("");
                        }}
                        className={`w-full pl-11 pr-12 py-3.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:ring-4 ${
                          formData.confirmPassword.length > 0
                            ? passwordsMatch
                              ? "border-emerald-400 focus:ring-emerald-50"
                              : "border-red-300 focus:ring-red-50"
                            : "border-slate-200 focus:border-rose-500 focus:ring-rose-50"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-rose-500"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>

                    </div>

                    {formData.confirmPassword.length > 0 && (
                      <p
                        className={`text-xs mt-2 font-medium ${
                          passwordsMatch
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {passwordsMatch
                          ? "Passwords match"
                          : "Passwords do not match"}
                      </p>
                    )}

                  </div>

                  {/* ERROR */}
                  {error && (
                    <div
                      role="alert"
                      className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm"
                    >
                      {error}
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-rose-500/20 transition flex items-center justify-center gap-2 text-sm hover:-translate-y-0.5"
                  >
                    {loading ? "Updating password..." : "Reset password"}
                    {!loading && <Check size={18} />}
                  </button>

                  {/* BACK TO LOGIN */}
                  <div className="text-center pt-2">

                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-500 transition"
                    >
                      <ArrowLeft size={16} />
                      Back to login
                    </Link>

                  </div>

                </form>
              </>
            )}

          </div>

          {/* FOOTER NOTE */}
          <p className="text-center text-xs text-slate-400 mt-6">
            © 2026 Equilx IELTS. All rights reserved.
          </p>

        </section>

      </main>

    </div>
  );
}

/* ================= FEATURE COMPONENT ================= */

function Feature({ icon: Icon, title, description, color }) {
  const colors = {
    rose: "bg-rose-50 text-rose-500",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="flex items-start gap-4">

      <div
        className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center shrink-0 shadow-sm`}
      >
        <Icon size={22} />
      </div>

      <div>
        <h3 className="font-bold text-slate-900 text-base">
          {title}
        </h3>

        <p className="text-sm text-slate-500 mt-1 leading-6">
          {description}
        </p>
      </div>

    </div>
  );
}