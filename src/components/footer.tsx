import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background/95">
      <div className="container mx-auto flex flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Link href="/" className="block text-lg font-serif tracking-tight">
            Wild Road Books
          </Link>
          <p className="text-sm text-muted-foreground">
            Publishing books that swim against conventional currents.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/submissions" className="hover:text-foreground">Submissions</Link>
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
          <Link href="/catching-unicorns" className="text-foreground font-medium">Catching Unicorns</Link>
        </nav>
      </div>
    </footer>
  );
}


