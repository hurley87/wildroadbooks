import Image from "next/image";

export default function MaidenLane() {
  return (
    <main>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-full bg-accent/30 p-0.5 overflow-hidden">
                <Image
                  src="/MaidenLane.png"
                  alt="Maiden Lane Press colophon"
                  fill
                  sizes="80px"
                  className="object-cover rounded-full"
                />
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

