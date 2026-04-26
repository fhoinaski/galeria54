"use client";

interface AvailabilityToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export function AvailabilityToggle({ checked, onChange, disabled, label }: AvailabilityToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-olive-500/50 disabled:opacity-50 disabled:cursor-not-allowed
          ${checked ? "bg-olive-700" : "bg-gray-200"}
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200
            absolute top-0.5 left-0.5
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
      {label && (
        <span className="text-sm text-gray-700">{label}</span>
      )}
    </label>
  );
}
