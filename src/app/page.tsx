import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* The sign sits ~20-43% from the top; 50% 35% keeps it in view when the 70vh cap crops vertically */}
      <div className="relative w-full aspect-video md:aspect-auto md:h-[min(56.25vw,70vh)] flex-shrink-0">
        <Image
          src="/hero-b.jpg"
          alt="Wild Road Books storefront"
          fill
          priority
          className="object-cover object-[50%_35%]"
          sizes="100vw"
        />
      </div>

      <div className="w-full flex flex-col items-center text-center px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="max-w-lg mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight">
            Wild Road Books
          </h1>
          
          <div className="space-y-4 text-lg sm:text-xl text-muted-foreground leading-relaxed">
            <p>
              An academic press that partners with authors to publish their work. 
              We help academic authors bring their scholarship to a wider audience 
              through professional editing, typesetting, and distribution.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <p className="text-base sm:text-lg">
              <span className="text-muted-foreground">View our </span>
              <Link
                href="/books"
                className="text-foreground hover:text-primary transition-colors underline underline-offset-4"
              >
                Catalogue
              </Link>
            </p>
            <p className="text-base sm:text-lg">
              <span className="text-muted-foreground">Contact: </span>
              <span className="text-foreground">admin@wildroadbooks.com</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
