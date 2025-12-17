"use client";

export const RuggedCheckbox = ({ label, icon: Icon, register, name }) => (
  <label className="relative flex items-center gap-4 cursor-pointer group p-4 border-2 border-stone-600 border-dashed hover:border-amber-500 hover:bg-stone-800/50 transition-all">
    <input type="checkbox" {...register(name)} className="peer sr-only" />
    <div className="w-6 h-6 border-2 border-[#EBE9E1] bg-stone-900 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-colors flex items-center justify-center">
      <div className="w-4 h-1 bg-stone-900 transform -rotate-45 hidden peer-checked:block" />
    </div>
    <span className="text-[#EBE9E1] font-mono uppercase tracking-wider text-xs flex items-center gap-2 group-hover:text-amber-400 transition-colors">
      <Icon className="w-4 h-4" />
      {label}
    </span>
  </label>
);