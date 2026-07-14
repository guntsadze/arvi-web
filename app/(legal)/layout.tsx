import Link from "next/link";
import Image from "next/image";

/**
 * Minimal chrome for standalone legal pages — just a header linking back
 * to / and a footer. No sidebar, no auth logic.
 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center px-4 py-5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-8 w-8 shrink-0 rotate-3 rounded-sm bg-accent transition-transform duration-300 group-hover:rotate-0">
              <Image
                src="/logo.webp"
                alt="Arvi logo"
                fill
                className="-rotate-12"
              />
            </div>
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              Arvi
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-text-muted">
          <p>© 2026 Arvi. ყველა უფლება დაცულია.</p>
        </div>
      </footer>
    </div>
  );
}
