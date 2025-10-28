import Image from "next/image";
import Link from "next/link";

export default function Books() {
  return (
    <main>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-serif tracking-tight sm:text-4xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
              The Wild Road Catalogue
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our list features original and engaging scholarship from all disciplines. 
              We publish books that combine intellectual depth with clarity and style—works 
              written to be read and cited.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl grid grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {/* Book tombstone entry */}
            <article className="group flex flex-col">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-primary/10 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Image
                  src="/catching-unicorns.png"
                  alt="Catching Unicorns cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-x-4 text-sm text-muted-foreground">
                  <time dateTime="2025-10">October 2025</time>
                </div>
                <h3 className="mt-4 text-xl font-serif leading-7 group-hover:text-primary transition-colors duration-300">
                  <Link 
                    href="/catching-unicorns" 
                    className="hover:text-primary transition-colors"
                  >
                    Catching Unicorns: The Exographic Revolution and the Rise of Techno-Literate Culture
                  </Link>
                </h3>
                <p className="mt-2 text-sm font-medium text-foreground">
                  Bill Hurley & David Hurley
                </p>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  The book first explains how writing enables us to discover ideas that would 
                  otherwise be impossible. It then explores how these ideas have given rise to 
                  the massively-urban techno-literate cultures we inhabit today.
                </p>
                <div className="mt-6">
                  <a 
                    href="https://www.amazon.ca/Catching-Unicorns-Exographic-Revolution-Techno-Literate/dp/1069059315"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 font-medium inline-flex items-center transition-transform duration-300 hover:translate-x-1 group"
                  >
                    Available on Amazon.ca <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </a>
                </div>
              </div>
            </article>
          </div>
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground">
              Interested in submitting your work? Visit our{" "}
              <Link
                href="/submissions"
                className="text-primary hover:text-primary/80 font-medium transition-all duration-300 hover:underline underline-offset-4"
              >
                submissions page
              </Link>{" "}
              to learn more.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 