import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex flex-col md:block md:h-screen md:min-h-[600px] md:overflow-hidden">
      {/* Mobile: 16:9 image on top. Desktop: full-screen background */}
      <div className="relative w-full aspect-video md:absolute md:inset-0 md:aspect-auto">
        <Image
          src="/hero-c.jpg"
          alt="Wild Road Books storefront"
          fill
          priority
          className="object-cover object-[100%_50%] portrait:object-[0%_50%]"
          sizes="100vw"
        />
        {/* Light wash over the sky, behind the text (desktop only) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#fdf8ef]/85 via-[#fdf8ef]/60 via-40% to-transparent to-60%"
        />
      </div>

      {/* Content: below the image on mobile, over the sky on desktop */}
      <div className="relative w-full md:h-full md:w-[46%] lg:w-[42%] flex flex-col justify-center px-6 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-16">
        <div className="max-w-lg mx-auto md:mx-0 space-y-6 md:text-[#2a1f17]">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight">
            Wild Road Books
          </h1>
          
          <div className="space-y-4 text-lg sm:text-xl text-muted-foreground md:text-[#35281d] leading-relaxed">
            <p>
              An academic press that partners with authors to publish their work. 
              We help academic authors bring their scholarship to a wider audience 
              through professional editing, typesetting, and distribution.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <p className="text-base sm:text-lg">
              <span className="text-muted-foreground md:text-[#35281d]">View our </span>
              <Link
                href="/books"
                className="text-foreground md:text-[#2a1f17] hover:text-primary md:hover:text-[#1f4d3f] transition-colors underline underline-offset-4"
              >
                Catalogue
              </Link>
            </p>
            <p className="text-base sm:text-lg">
              <span className="text-muted-foreground md:text-[#35281d]">Contact: </span>
              <span className="text-foreground md:text-[#2a1f17]">admin@wildroadbooks.com</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
