import { Navigation } from "@/components/navigation";

export default function About() {
  return (
    <main>
      <Navigation />
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              About Wild Road Books
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We specialize in working with authors whose ideas swim against
              conventional currents, academics who wish to publish their research
              without going through the agony of the usual academic press
              submission process, and other authors who have just plain
              interesting ideas.
            </p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              We like to work with authors who wish to appeal to intelligent,
              highbrow readers who put high value on intellectual engagement.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-2">
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold tracking-tight">Our Team</h3>
              <div className="mt-8 space-y-8">
                <div>
                  <h4 className="text-xl font-semibold">David Hurley</h4>
                  <p className="mt-2 text-muted-foreground">Publisher</p>
                  <p className="mt-4 text-muted-foreground">
                    David is an entrepreneur who loves to read. He has always been
                    interested in operating a press that offers authors an
                    editorial experience that enables them to refine and publish
                    their ideas.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">Bill Hurley</h4>
                  <p className="mt-2 text-muted-foreground">
                    Chief Acquisition Editor
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    Bill has been a Professor of Operations Research and Analytics
                    at the Royal Military College of Canada for 35 years. This
                    position at Wild Road Books is a new challenge for him and he
                    is quite looking forward to working with authors, especially
                    those wishing to publish for the first time.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold tracking-tight">Our Mission</h3>
              <p className="mt-8 text-lg leading-8 text-muted-foreground">
                At Wild Road Books, we believe in the power of unconventional
                thinking and the importance of making complex ideas accessible to
                thoughtful readers. Our mission is to provide a platform for
                authors who challenge the status quo and offer fresh perspectives
                on important topics.
              </p>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                We are committed to:
              </p>
              <ul className="mt-4 space-y-4 text-muted-foreground">
                <li className="flex gap-x-3">
                  <span className="text-primary">•</span>
                  <span>
                    Supporting authors who challenge conventional wisdom
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-primary">•</span>
                  <span>
                    Providing a streamlined publishing process for academic
                    research
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-primary">•</span>
                  <span>
                    Fostering intellectual engagement through quality
                    publications
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 