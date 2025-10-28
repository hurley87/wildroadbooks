import Image from "next/image";
import Link from "next/link";

export default function Books() {
  return (
    <main>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-serif tracking-tight sm:text-4xl">
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
            <article className="flex flex-col">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/catching-unicorns.png"
                  alt="Catching Unicorns cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-x-4 text-sm text-muted-foreground">
                  <time dateTime="2025-10">October 2025</time>
                </div>
                <h3 className="mt-4 text-xl font-serif leading-7">
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
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Available on Amazon.ca →
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
                className="text-primary hover:text-primary/80"
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