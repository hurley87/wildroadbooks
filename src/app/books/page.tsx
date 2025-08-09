export default function Books() {
  return (
    <main>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-serif tracking-tight sm:text-4xl">
              Our Books
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Discover our collection of thought-provoking books that challenge
              conventional thinking and offer fresh perspectives on important
              topics.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Placeholder for future books */}
            <div className="flex flex-col">
              <div className="relative">
                <div className="aspect-[2/3] w-full rounded-2xl bg-gray-100 object-cover" />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Coming Soon</h3>
                <p className="mt-2 text-muted-foreground">
                  Our first collection of books is in development. Stay tuned for
                  updates on our upcoming publications.
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="relative">
                <div className="aspect-[2/3] w-full rounded-2xl bg-gray-100 object-cover" />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Future Release</h3>
                <p className="mt-2 text-muted-foreground">
                  We're working with talented authors to bring you groundbreaking
                  works that challenge conventional wisdom.
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="relative">
                <div className="aspect-[2/3] w-full rounded-2xl bg-gray-100 object-cover" />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold">In Development</h3>
                <p className="mt-2 text-muted-foreground">
                  Our editorial team is carefully reviewing submissions to ensure
                  the highest quality publications.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground">
              Interested in submitting your work? Visit our{" "}
              <a
                href="/submissions"
                className="text-primary hover:text-primary/80"
              >
                submissions page
              </a>{" "}
              to learn more.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 