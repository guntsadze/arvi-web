import { useRouter } from "next/navigation";

export function SaveRow({
  isDirty,
  isSubmitting,
  fn,
  hint,
  username,
}: {
  isDirty: boolean;
  isSubmitting: boolean;
  fn: string;
  hint?: string;
  username: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
      <span className="text-[9px] font-mono text-text-secondary">
        {hint ?? (isDirty ? "// unsaved changes" : "// no changes")}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => router.push(`/profile/${username}`)}
          className="text-[9px] uppercase tracking-wider font-mono text-text-secondary border border-border px-4 py-2 hover:text-text-primary transition-colors"
        >
          პროფილზე დაბრუნება
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="text-[9px] uppercase tracking-wider font-mono text-accent border border-accent px-5 py-2 hover:bg-primary-hover hover:text-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "saving..." : fn}
        </button>
      </div>
    </div>
  );
}
