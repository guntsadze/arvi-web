interface RestoreAccountModalProps {
  restoreError?: string;
  isRestoring: boolean;
  onClose: () => void;
  onRestore: () => void;
}

export const RestoreAccountModal = ({
  restoreError,
  isRestoring,
  onClose,
  onRestore,
}: RestoreAccountModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div className="relative w-full max-w-sm mx-4 bg-[#1a1918] border-2 border-stone-800 p-8 shadow-[8px_8px_0_0_rgba(0,0,0,0.5)]">
      <div className="absolute top-0 left-0 w-2 h-2 bg-amber-500" />
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-amber-500" />

      <p className="text-[10px] font-mono text-amber-500 tracking-[0.3em] uppercase mb-2">
        ACCOUNT_DELETED
      </p>
      <h2 className="text-lg font-mono font-bold text-stone-100 uppercase tracking-widest mb-3">
        ანგარიში წაშლილია
      </h2>
      <p className="text-xs font-mono text-stone-400 mb-4 leading-relaxed">
        ეს ანგარიში წაშლილია. გსურთ აღდგენა და გაგრძელება?
      </p>

      {restoreError && (
        <div className="mb-6 px-3 py-2 border border-red-800 bg-red-950/30">
          <p className="text-[10px] font-mono text-red-400 tracking-wider">
            ERROR: {restoreError}
          </p>
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isRestoring}
          className="flex-1 px-4 py-3 border-2 border-stone-700 text-xs font-mono font-bold uppercase tracking-widest text-stone-400 hover:border-stone-500 hover:text-stone-200 transition-all disabled:opacity-50"
        >
          გაუქმება
        </button>

        <button
          type="button"
          onClick={onRestore}
          disabled={isRestoring}
          className="flex-1 px-4 py-3 bg-amber-500 border-2 border-amber-500 text-xs font-mono font-bold uppercase tracking-widest text-black hover:bg-amber-400 transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] hover:shadow-none active:translate-y-0.5 disabled:opacity-50"
        >
          {isRestoring ? "RESTORING..." : restoreError ? "RETRY" : "აღდგენა"}
        </button>
      </div>
    </div>
  </div>
);
