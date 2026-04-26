"use client";

import { useState, useEffect } from "react";
import { centsToInput, inputToCents } from "@/lib/currency";

interface PriceInputProps {
  /** Value in centavos */
  value: number;
  onChange: (cents: number) => void;
  disabled?: boolean;
  error?: string;
}

export function PriceInput({ value, onChange, disabled, error }: PriceInputProps) {
  const [display, setDisplay] = useState(centsToInput(value));

  // Sync display when external value changes
  useEffect(() => {
    setDisplay(centsToInput(value));
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDisplay(e.target.value);
  }

  function handleBlur() {
    const cents = inputToCents(display);
    onChange(cents);
    setDisplay(centsToInput(cents));
  }

  return (
    <div>
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-sm pointer-events-none">
          R$
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={display}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border bg-white transition-colors
            focus:outline-none focus:ring-2 focus:ring-olive-500/30 focus:border-olive-500
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${error ? "border-red-400" : "border-gray-200"}
          `}
          placeholder="0,00"
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
