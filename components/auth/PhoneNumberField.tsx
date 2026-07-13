"use client";

interface PhoneNumberFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

/** Georgia-focused app — fixed +995 prefix instead of a full country picker. */
const COUNTRY_PREFIX = "+995";

export function PhoneNumberField({
  value,
  onChange,
  error,
  disabled,
  autoFocus,
}: PhoneNumberFieldProps) {
  return (
    <div className="w-full">
      <label
        htmlFor="phone"
        className="mb-1.5 block text-sm font-medium text-text-secondary"
      >
        ტელეფონის ნომერი
      </label>
      <div
        className={`flex items-center rounded-md border bg-surface-2 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 ${
          error ? "border-error" : "border-border"
        }`}
      >
        <span className="select-none border-r border-border px-3 py-2.5 text-sm text-text-secondary">
          {COUNTRY_PREFIX}
        </span>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoFocus={autoFocus}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          placeholder="555123456"
          autoComplete="tel-national"
          className="w-full min-w-0 bg-transparent px-3 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted"
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  );
}

export { COUNTRY_PREFIX };
