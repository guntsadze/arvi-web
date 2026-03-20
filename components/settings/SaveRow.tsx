export function SaveRow({
  isDirty,
  isSubmitting,
  fn,
  hint,
}: {
  isDirty: boolean;
  isSubmitting: boolean;
  fn: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-900">
      <span className="text-[9px] font-mono text-stone-700">
        {hint ?? (isDirty ? "// unsaved changes" : "// no changes")}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          className="text-[9px] uppercase tracking-wider font-mono text-stone-600 border border-stone-800 px-4 py-2 hover:text-[#EBE9E1] transition-colors"
        >
          cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="text-[9px] uppercase tracking-wider font-mono text-amber-600 border border-amber-600 px-5 py-2 hover:bg-amber-600 hover:text-[#0f0d0c] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "saving..." : fn}
        </button>
      </div>
    </div>
  );
}
