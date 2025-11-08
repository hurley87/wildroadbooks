import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="relative border-t bg-gradient-to-t from-muted/30 to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container relative mx-auto flex flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex-shrink-0 rounded-full bg-accent/50 p-0.5 overflow-hidden">
              <Image
                src="/WildRoadColophon.png"
                alt="Wild Road Books colophon"
                fill
                sizes="40px"
                className="object-cover rounded-full"
              />
            </div>
            <Link href="/" className="block text-lg font-serif tracking-tight hover:text-primary transition-colors duration-300">
              Wild Road Books
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Committed to supporting thoughtful scholarship and clear, engaging writing.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {[
            { href: "/about", label: "About" },
            { href: "/faq", label: "FAQ" },
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


