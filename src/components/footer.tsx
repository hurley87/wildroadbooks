import Link from "next/link";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="relative border-t bg-gradient-to-t from-muted/30 to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container relative mx-auto flex flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Link href="/" className="block text-lg font-serif tracking-tight hover:text-primary transition-colors duration-300">
            Wild Road Books
          </Link>
          <p className="text-sm text-muted-foreground">
            Publishing books that swim against conventional currents.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {[
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
            { href: "/catching-unicorns", label: "Catching Unicorns" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm text-muted-foreground hover:text-primary transition-all duration-300 relative group",
                link.label === "Catching Unicorns" && "font-medium text-foreground"
              )}
            >
              {link.label}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}


