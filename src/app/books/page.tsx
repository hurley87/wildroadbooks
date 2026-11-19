import Image from "next/image";
import Link from "next/link";

type Book = {
  title: string;
  shortTitle: string;
  href?: string;
  author?: string;
  year: number;
  isbn?: string;
  amazonUrl: string;
  cover: { src: string; width: number; height: number };
  blurb: string[];
};

const books: Book[] = [
  {
    title: "Catching Unicorns: The Exographic Revolution and the Rise of Techno-Literate Culture",
    shortTitle: "Catching Unicorns",
    href: "/catching-unicorns",
    author: "Bill Hurley & David Hurley",
    year: 2025,
    isbn: "978-1-0690593-1-4",
    amazonUrl: "https://www.amazon.ca/dp/1069059315",
    cover: { src: "/covers/catching-unicorns.jpg", width: 600, height: 779 },
    blurb: [
      "Catching Unicorns is a field guide for how we use writing to think beyond the limits of our naked minds. From tally marks to technical diagrams, we’ve built exographic systems that don’t just record ideas—they help generate them. Writing lets us externalize thought, manipulate abstraction, and in so doing discover ideas we otherwise couldn’t.",
      "But this isn’t just a book about cognition—it’s a sweeping history of the ideas we’ve conjured through writing and how they’ve reshaped our existence. From the oral rhythms of hunter-gatherers to the algorithmic logic of urban techno-literate cultures, Catching Unicorns traces the evolution of human knowledge. The narrative reveals how symbolic systems—from ancient notations on clay tablets to modern analytics on computer screens—have transformed not only what we know, but how we live.",
      "For readers drawn to philosophy, science, cognitive science, or cultural change, this book offers a lens both rigorous and poetic. It’s a manifesto for those who believe that writing isn’t just a tool—it’s a technology of transformation.",
    ],
  },
  {
    title: "Coffee Rings and Cosmic Dust",
    shortTitle: "Coffee Rings and Cosmic Dust",
    author: "Darcy Kirkham",
    year: 2026,
    isbn: "978-1-0690593-2-1",
    amazonUrl: "https://www.amazon.ca/dp/1069059323",
    cover: { src: "/covers/coffee-rings-and-cosmic-dust.jpg", width: 600, height: 860 },
    blurb: [
      'Moving from the "Domestic Constellations" of the everyday to the "Geometry of Grief," Darcy Kirkham explores the fragility of human connection and the enduring weight of memory. Through a series of deeply interconnected movements, this collection interrogates what it means to be tethered to the world while our minds drift among the stars. Whether navigating the silence of a house, an overgrown farmyard, or the sudden, sharp joy of a moment realized, these poems are a testament to the idea that in an infinite universe, every point is the center.',
    ],
  },
  {
    title: "Bits & Pieces: Reflections of a Literary Pretension",
    shortTitle: "Bits & Pieces",
    author: "Merv Daub",
    year: 2026,
    isbn: "978-1-0690593-4-5",
    amazonUrl: "https://www.amazon.ca/dp/106905934X",
    cover: { src: "/covers/bits-and-pieces.jpg", width: 600, height: 901 },
    blurb: [
      "Bits and Pieces brings together stories, poems and essays by Canadian writer Merv Daub, including previously unpublished work. Childhood memories share the page with journeys abroad, while reflections on old friends give the collection a more intimate tone. Daub approaches his subjects with humour and a willingness to linger over what the passing years leave behind. This first Wild Road edition presents his work in a single curated volume intended for readers of contemporary Canadian literature, short fiction and poetry.",
    ],
  },
  {
    title: "Wild Road Notebook",
    shortTitle: "Wild Road Notebook",
    year: 2026,
    amazonUrl: "https://www.amazon.ca/dp/B0H4LNC5V4",
    cover: { src: "/covers/wild-road-notebook.jpg", width: 600, height: 765 },
    blurb: [
      "The Wild Road Notebook is a simple, spacious notebook for notes, sketches, and the beginnings of things. Created by Wild Road Books, this 102-page notebook includes a subject/topic contents page followed by numbered pages for writing, planning, drafting, collecting ideas, or working through early thoughts. It is designed as a clean, practical companion for writers, students, teachers, researchers, and anyone who likes to keep their ideas in one place. Use it for: daily notes and reflections; story, essay, or book ideas; research notes; meeting notes; sketches and diagrams; project planning; and lists, outlines, and first drafts",
    ],
  },
];

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
            {books.map((book) => (
              <article key={book.title} className="group flex min-w-0 flex-col">
                <div className="relative w-40 sm:w-48 overflow-hidden rounded-2xl shadow-lg ring-1 ring-primary/10 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                  <div className="absolute inset-0 z-10 bg-gradient-to-tr from-primary/5 via-transparent to-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Image
                    src={book.cover.src}
                    alt={`${book.shortTitle} cover`}
                    width={book.cover.width}
                    height={book.cover.height}
                    sizes="(min-width: 640px) 192px, 160px"
                    className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-6">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <time dateTime={String(book.year)}>{book.year}</time>
                    {book.isbn && <span>ISBN {book.isbn}</span>}
                  </div>
                  <h3 className="mt-4 text-xl font-serif leading-7 group-hover:text-primary transition-colors duration-300">
                    {book.href ? (
                      <Link
                        href={book.href}
                        className="hover:text-primary transition-colors"
                      >
                        {book.title}
                      </Link>
                    ) : (
                      book.title
                    )}
                  </h3>
                  {book.author && (
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {book.author}
                    </p>
                  )}
                  <div className="mt-4 space-y-4 text-base leading-7 text-muted-foreground">
                    {book.blurb.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="mt-6">
                    <a
                      href={book.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 font-medium inline-flex items-center transition-transform duration-300 hover:translate-x-1 group"
                    >
                      Available on Amazon.ca <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
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
