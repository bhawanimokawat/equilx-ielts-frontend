import React, { useRef } from "react";

const OTP_LENGTH = 6;

// value: an array of 6 strings, for example ["1", "2", "", "", "", ""]
// onChange: receives the new array
export default function OtpInput({ value, onChange, disabled = false, autoFocus = false }) {
  const inputRefs = useRef([]);

  const focusInput = (index) => inputRefs.current[index]?.focus();

  const handleChange = (event, index) => {
    const raw = event.target.value;
    if (!/^\d*$/.test(raw)) return;

    const digit = raw.slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);

    if (digit && index < OTP_LENGTH - 1) focusInput(index + 1);
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !value[index] && index > 0) focusInput(index - 1);
    if (event.key === "ArrowLeft" && index > 0) focusInput(index - 1);
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) focusInput(index + 1);
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    onChange(Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] || ""));
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
          className="w-11 h-13 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition disabled:opacity-60"
        />
      ))}
    </div>
  );
}