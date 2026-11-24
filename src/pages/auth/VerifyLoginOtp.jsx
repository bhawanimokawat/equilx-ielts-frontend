import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import AuthNavbar from "../../components/common/AuthNavbar";
import OtpInput from "../../components/common/OtpIntput";
import { useAuth } from "../../context/useAuth";
import { getHomePath } from "../../utils/getHomePath";

// Errors that retyping cannot fix: the user must log in again.
const RESTART_CODES = [
  "INVALID_TWO_FACTOR_CHALLENGE",
  "TWO_FACTOR_EXPIRED",
  "TWO_FACTOR_MAX_ATTEMPTS",
];

const emptyOtp = () => Array(6).fill("");

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function VerifyLoginOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyLoginOtp } = useAuth();

  // Sent by the Login page. They are lost on page refresh (this is expected).
  const challengeId = location.state?.challengeId || "";
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(emptyOtp);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    location.state?.expiresIn ?? 300
  );

  // Without a challenge there is nothing to verify: go back to login.
  useEffect(() => {
    if (!challengeId) navigate("/login", { replace: true });
  }, [challengeId, navigate]);

  // Countdown of the code lifetime (the backend gives 5 minutes).
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const expired = secondsLeft <= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || expired) return;

    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    const result = await verifyLoginOtp(challengeId, code);
    setLoading(false);

    if (!result.success) {
      toast.error(result.error);

      if (RESTART_CODES.includes(result.code)) {
        navigate("/login", { replace: true });
      } else {
        setOtp(emptyOtp());
      }
      return;
    }

    navigate(getHomePath(result.user), { replace: true });
  };

  if (!challengeId) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--page-bg)] text-[var(--text-primary)] transition-colors duration-300">
      <AuthNavbar variant="verify" />

      <main className="flex-grow max-w-7xl w-full mx-auto flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="w-full max-w-lg bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl shadow-xl p-6 sm:p-9">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <ShieldCheck size={30} />
            </div>

            <h1 className="text-2xl font-bold">Verify it&apos;s you</h1>

            <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
              For your security, we sent a 6-digit code to your email
              {email ? ":" : "."}
            </p>

            {email && (
              <strong className="block text-rose-500 mt-2 break-all">{email}</strong>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              disabled={loading || expired}
              autoFocus
            />

            <p
              className={`text-xs text-center ${
                expired ? "text-red-500" : "text-[var(--text-muted)]"
              }`}
            >
              {expired
                ? "This code has expired. Please log in again."
                : `The code expires in ${formatTime(secondsLeft)}`}
            </p>

            <button
              type="submit"
              disabled={loading || expired}
              className="w-full py-3.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-lg shadow-rose-500/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? "Verifying..." : "Verify and continue"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login", { replace: true })}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[var(--border-color)] hover:border-rose-500 hover:text-rose-500 transition-all duration-300 font-semibold text-sm"
            >
              <ArrowLeft size={16} />
              Back to login
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}