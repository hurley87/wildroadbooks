import Image from "next/image";

export default function MaidenLane() {
  return (
    <main>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg bg-accent/30 p-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-serif tracking-tight sm:text-4xl">
                  The Maiden Lane Catalogue
                </h2>
                <p className="mt-2 text-sm text-muted-foreground italic">
                  Maiden Lane Press
                </p>
              </div>
            </div>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Maiden Lane Press is the creative imprint of Wild Road Books—home to writing that 
              crosses boundaries or reimagines them altogether.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="rounded-2xl border-2 border-dashed bg-muted/30 p-16 text-center">
              <p className="text-lg text-muted-foreground">
                Coming soon. Check back for our catalogue of creative and cross-genre work—from 
                essays and memoirs to fiction, poetry, and cultural criticism.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

