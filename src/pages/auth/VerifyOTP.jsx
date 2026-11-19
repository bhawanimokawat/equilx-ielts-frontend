
import React, { useState, useRef, useEffect } from "react";
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthNavbar from "../../components/common/AuthNavbar";
import authService from "../../services/authService1";

export default function EmailVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const digit = value.slice(-1);
    const updatedOtp = [...otp];

    updatedOtp[index] = digit;

    setOtp(updatedOtp);
    setError("");
    setMessage("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) return;

    const updatedOtp = Array.from({ length: 6 }, (_, index) =>
      pastedValue[index] || ""
    );

    setOtp(updatedOtp);
    setError("");
    setMessage("");

    inputRefs.current[Math.min(pastedValue.length, 5)]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Verify Email API
  const handleVerify = async (e) => {
    e.preventDefault();

    const verificationCode = otp.join("");

    if (!email) {
      setError("Email address not found. Please register again.");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await authService.verifyEmail(
        email,
        verificationCode
      );

      if (response.success) {
        setMessage("Email verified successfully!");

        setTimeout(() => {
          navigate("/login", {
            state: {
              message: "Email verified successfully. Please login.",
            },
          });
        }, 1000);
      } else {
        setError(response.message || "Email verification failed.");
      }
    } catch (err) {
      setError(err.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP API
  const handleResend = async () => {
    if (timeLeft > 0 || resendLoading) return;

    if (!email) {
      setError("Email address not found. Please register again.");
      return;
    }

    setResendLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await authService.resendOtp(email);

      if (response.success) {
        setOtp(["", "", "", "", "", ""]);
        setTimeLeft(45);
        setMessage("A new verification code has been sent to your email.");
        inputRefs.current[0]?.focus();
      } else {
        setError(response.message || "Unable to resend verification code.");
      }
    } catch (err) {
      setError(err.message || "Unable to resend verification code.");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--page-bg)] text-[var(--text-primary)] transition-colors duration-300">
      <AuthNavbar variant="verify" />

      <main className="flex-grow max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center px-5 sm:px-8 lg:px-12 py-10 lg:py-14">

        {/* Left Section */}
        <section className="lg:col-span-6 space-y-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            VERIFY YOUR EMAIL
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            One more step to{" "}
            <span className="text-rose-500">get started.</span>
          </h1>

          <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-lg leading-relaxed">
            Enter the 6-digit code sent to your email address to verify your account.
          </p>

          <div className="space-y-6 pt-3">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Mail size={22} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">
                  Secure verification
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  We use a 6-digit code to keep your account safe.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">
                  Quick and easy
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Verification takes less than a minute.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">
                  Start your IELTS journey
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Access mock tests, practice and study materials.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Verification Card */}
        <section className="lg:col-span-6 w-full max-w-lg mx-auto">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl shadow-xl p-6 sm:p-9 lg:p-10">

            <div className="text-center mb-9">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Mail size={30} />
              </div>

              <h2 className="text-2xl font-bold">
                Verify your email
              </h2>

              <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
                We have sent a 6-digit verification code to:
              </p>

              <strong className="block text-rose-500 mt-2 break-all">
                {email || "Email address unavailable"}
              </strong>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleChange(e.target.value, index)
                    }
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    aria-label={`OTP digit ${index + 1}`}
                    className="w-11 h-13 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition"
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">
                  {error}
                </p>
              )}

              {message && (
                <p className="text-sm text-emerald-500 text-center">
                  {message}
                </p>
              )}

              <p className="text-xs text-center text-[var(--text-muted)]">
                Enter the 6-digit code sent to your registered email.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-lg shadow-rose-500/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify code →"}
              </button>

              <div className="text-center">
                <p className="text-sm text-[var(--text-muted)]">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    disabled={timeLeft > 0 || resendLoading}
                    onClick={handleResend}
                    className="font-semibold text-rose-500 hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {resendLoading ? "Sending..." : "Resend code"}
                  </button>
                </p>

                {timeLeft > 0 && (
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    You can resend in {formatTime(timeLeft)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[var(--border-color)]" />
                <span className="text-xs text-[var(--text-muted)] font-semibold">
                  OR
                </span>
                <div className="flex-1 h-px bg-[var(--border-color)]" />
              </div>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-rose-500 hover:text-rose-500 transition-all duration-300 font-semibold text-sm"
              >
                <ArrowLeft size={16} />
                Back to login
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
