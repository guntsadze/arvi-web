export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[8px] uppercase tracking-[.14em] text-text-secondary font-mono mb-1.5">
        {label}
      </p>
      {children}
    </div>
  );
}
