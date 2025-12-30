import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile image - shown only on mobile, at top */}
      <div className="relative md:hidden w-full h-80 flex-shrink-0">
        <Image
          src="/cover.png"
          alt="Wild Road Books"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Left side - Full height image (desktop) */}
      <div className="relative hidden md:block md:w-1/2 h-screen flex-shrink-0">
        <Image
          src="/cover.png"
          alt="Wild Road Books"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
      </div>

      {/* Right side - Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
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
              <span className="text-muted-foreground">Contact: </span>
              <a 
                href="mailto:admin@wildroadbooks.com"
                className="text-foreground hover:text-primary transition-colors underline underline-offset-4"
              >
                admin@wildroadbooks.com
              </a>
            </p>
            
            <p className="text-base sm:text-lg">
              <span className="text-muted-foreground">Buy our book: </span>
              <a
                href="https://www.amazon.ca/Catching-Unicorns-Exographic-Revolution-Techno-Literate/dp/1069059315"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors underline underline-offset-4"
              >
                Catching Unicorns on Amazon
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
