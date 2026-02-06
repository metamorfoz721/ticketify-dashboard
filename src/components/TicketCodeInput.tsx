import React, { useState } from "react";

type Props = {
  onSubmit: (code: string) => void;
  loading?: boolean;
};

export const TicketCodeInput: React.FC<Props> = ({ onSubmit, loading }) => {
  const [code, setCode] = useState("");
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleKeypadPress = (key: string) => {
    if (loading) return;

    if (key === "back") {
      setCode(prev => prev.slice(0, -1));
    } else if (key === "enter") {
      if (code.length === 8) {
        onSubmit(code);
      }
    } else if (code.length < 8) {
      const nextCode = code + key;
      setCode(nextCode);
    }
  };

  const digits = [
    code.slice(0, 2),
    code.slice(2, 4),
    code.slice(4, 6),
    code.slice(6, 8),
  ];

  const KeyButton = ({ value, label, className = "" }: { value: string, label: React.ReactNode, className?: string }) => (
    <button
      type="button"
      onClick={() => handleKeypadPress(value)}
      onPointerDown={() => setPressedKey(value)}
      onPointerUp={() => setPressedKey(null)}
      onPointerLeave={() => setPressedKey(null)}
      onPointerCancel={() => setPressedKey(null)}
      disabled={loading}
      className={`aspect-square flex flex-col items-center justify-center rounded-[18px] text-lg font-black transition-all duration-100 hover:scale-[1.02] active:scale-[0.90] ${pressedKey === value ? "scale-[0.92] brightness-110" : ""} ${className || "bg-secondary-container text-on-secondary-container hover:brightness-105 active:brightness-75"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[320px] mx-auto animate-slide-up">
      {/* Display Boxes */}
      <div className="flex gap-2.5 justify-center w-full">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex-1 h-14 max-w-[64px] flex flex-col items-center justify-center text-xl font-mono font-black italic rounded-[16px] transition-colors duration-300 ${digits[i].length > 0 ? "bg-primary-container text-on-primary-container" : "bg-surface-container-highest text-on-surface-variant"
              }`}
          >
            <div className="flex gap-0.5 tracking-tighter">
              <span className={!digits[i][0] ? "opacity-10" : "scale-110"}>{digits[i][0] || "•"}</span>
              <span className={!digits[i][1] ? "opacity-10" : "scale-110"}>{digits[i][1] || "•"}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[9px] text-outline/40 text-center font-black uppercase tracking-[0.2em]">
        8 Haneli Bilet Kodunu Giriniz
      </p>

      {/* Numeric Keypad */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <KeyButton key={num} value={num.toString()} label={num} />
        ))}
        <KeyButton
          value="back"
          label={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2zM18 9l-6 6m0-6l6 6" />
            </svg>
          }
          className="bg-error-container text-on-error-container hover:brightness-105 active:brightness-75"
        />
        <KeyButton value="0" label="0" />
        <KeyButton
          value="enter"
          label={
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-4 h-4">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[7px] font-black uppercase tracking-widest">Kontrol</span>
            </>
          }
          className={`${code.length === 8 ? "bg-primary text-on-primary scale-105 hover:brightness-105 active:brightness-75 active:scale-[0.95]" : "bg-surface-container-highest text-on-surface-variant/50 hover:brightness-105 active:brightness-90"}`}
        />
      </div>

      <button
        onClick={() => setCode("")}
        className="text-[9px] text-error/60 font-black uppercase tracking-[0.3em] hover:text-error transition-all"
      >
        TÜMÜNÜ SİL
      </button>
    </div>
  );
};
