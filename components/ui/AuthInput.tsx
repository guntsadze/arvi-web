"use client";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  register: any;
  error?: string;
}

export const AuthInput = ({
  label,
  id,
  type = "text",
  register,
  error,
}: InputProps) => (
  <div className="space-y-1">
    <label htmlFor={id} className="text-sm font-medium">
      {label}
    </label>
    <input
      id={id}
      type={type}
      {...register(id)}
      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none
        ${error ? "border-red-500" : "border-gray-300"}`}
    />
    {error && <p className="text-red-600 text-sm">{error}</p>}
  </div>
);
