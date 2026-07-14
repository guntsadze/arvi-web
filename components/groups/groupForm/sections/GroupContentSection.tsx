export const GroupContentSection = ({ register }: any) => (
  <div className="space-y-8">
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-widest text-text-secondary mb-2">
        Node Description
      </label>
      <textarea
        {...register("description")}
        placeholder="Briefly describe the purpose of this node..."
        className="w-full bg-surface-1 border border-border p-4 text-text-secondary font-mono text-xs h-32 focus:outline-none focus:border-accent/50 transition-colors resize-none"
      />
    </div>

    <div>
      <label className="block font-mono text-[10px] uppercase tracking-widest text-text-secondary mb-2">
        Operational Rules
      </label>
      <textarea
        {...register("rules")}
        placeholder="1. No spamming... 2. Be respectful..."
        className="w-full bg-surface-1 border border-border p-4 text-text-secondary font-mono text-xs h-32 focus:outline-none focus:border-accent/50 transition-colors resize-none"
      />
    </div>
  </div>
);
