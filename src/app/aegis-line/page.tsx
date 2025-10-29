import Image from "next/image";

export default function AegisLine() {
  return (
    <main>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src="/madusa.png"
                  alt="Aegis Line logo"
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-3xl font-serif tracking-tight sm:text-4xl">
                  The Aegis Line Catalogue
                </h2>
                <p className="mt-2 text-sm text-muted-foreground italic">
                  Aegis Line
                </p>
              </div>
            </div>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Aegis Line is Wild Road Books' imprint dedicated to Security and Defence. 
              Named after the shield of protection in Greek mythology, Aegis Line publishes 
              rigorous analysis, strategic thinking, and policy scholarship on contemporary 
              security challenges—from cybersecurity and intelligence to military strategy 
              and international relations.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="rounded-2xl border-2 border-dashed bg-muted/30 p-16 text-center">
              <p className="text-lg text-muted-foreground">
                Coming soon. Check back for our catalogue of Security and Defence scholarship— 
                works that bring analytical rigor and strategic insight to pressing questions 
                of national and international security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

