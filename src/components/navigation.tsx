"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Books", href: "/books" },
  { name: "Submissions", href: "/submissions" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between sm:h-20">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg font-serif tracking-tight sm:text-xl">
              Wild Road Books
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center space-x-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:max-w-sm">
              <div className="mt-6 flex flex-col space-y-2">
                {navigation.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "rounded-md px-2 py-2 text-base font-medium tracking-wide transition-colors hover:text-primary",
                        pathname === item.href
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
} 