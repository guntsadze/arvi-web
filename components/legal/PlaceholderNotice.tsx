import { AlertTriangle } from "lucide-react";

/**
 * Highlighted callout shown on every (legal) page. The surrounding page
 * content is structural scaffolding only — it must not be treated as
 * binding legal text until reviewed and replaced by qualified counsel.
 */
export function PlaceholderNotice() {
  return (
    <div className="mb-10 flex gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4">
      <AlertTriangle
        size={20}
        className="mt-0.5 shrink-0 text-warning"
        aria-hidden
      />
      <p className="text-sm leading-relaxed text-text-primary">
        <span className="font-semibold">Placeholder content.</span> This page
        is structural scaffolding only and does not contain binding legal
        text. It must be reviewed and replaced by qualified legal counsel
        before this page goes live.
      </p>
    </div>
  );
}
