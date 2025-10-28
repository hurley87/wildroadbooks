import Image from "next/image";

export default function About() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        {/* Hero Section */}
        <div className="mx-auto mb-16 max-w-3xl">
          <h1 className="mb-6 text-4xl font-serif tracking-tight sm:text-5xl">
            About Wild Road Books
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Wild Road Books is an independent academic press dedicated to publishing serious 
            ideas in accessible form. We combine the standards of traditional scholarship with 
            the independence and openness of modern publishing tools.
          </p>
        </div>

        {/* Our Commitment Section */}
        <div className="mx-auto mb-16 max-w-3xl">
          <h2 className="mb-4 text-2xl font-serif tracking-tight">Our Commitment</h2>
          <ul className="space-y-3 text-base leading-7 text-muted-foreground">
            <li className="flex gap-x-3">
              <span className="text-primary font-medium">•</span>
              <span><strong>No author fees.</strong> Ever.</span>
            </li>
            <li className="flex gap-x-3">
              <span className="text-primary font-medium">•</span>
              <span><strong>Transparent, shared royalties.</strong></span>
            </li>
            <li className="flex gap-x-3">
              <span className="text-primary font-medium">•</span>
              <span><strong>Global print and digital distribution</strong> via KDP.</span>
            </li>
            <li className="flex gap-x-3">
              <span className="text-primary font-medium">•</span>
              <span><strong>Professional production</strong> using Overleaf templates.</span>
            </li>
          </ul>
          <p className="mt-6 text-base leading-7 text-foreground">
            We see publishing as a collaboration built on fairness and trust. Our authors 
            retain creative control and share directly in their book's success.
          </p>
        </div>

        {/* Maiden Lane Press Section */}
        <div className="mx-auto mb-16 max-w-3xl">
          <div className="flex items-center gap-6 mb-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src="/madusa.png"
                alt="Maiden Lane Press logo"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-serif tracking-tight">Maiden Lane Press</h2>
          </div>
          <p className="text-base leading-7 text-muted-foreground">
            Maiden Lane Press, our literary imprint, extends this model to creative and 
            cross-genre writing—from fiction and poetry to cultural essays and hybrid works. 
            Together, Wild Road Books and Maiden Lane Press publish writing that thinks deeply, 
            reads clearly, and travels widely.
          </p>
        </div>

        {/* Team Section */}
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-serif tracking-tight">Our Team</h2>
          <div className="space-y-12">
            <div className="rounded-2xl border bg-muted/30 p-8">
              <h3 className="text-xl font-medium">David Hurley</h3>
              <p className="mt-2 text-muted-foreground font-medium">Publisher</p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                David is an entrepreneur who loves to read. He has always been interested in 
                operating a press that offers authors an editorial experience that enables 
                them to refine and publish their ideas.
              </p>
            </div>
            <div className="rounded-2xl border bg-muted/30 p-8">
              <h3 className="text-xl font-medium">Bill Hurley</h3>
              <p className="mt-2 text-muted-foreground font-medium">Chief Acquisition Editor</p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Bill has been a Professor of Operations Research and Analytics at the Royal 
                Military College of Canada for 35 years. This position at Wild Road Books is a 
                new challenge for him and he is quite looking forward to working with authors, 
                especially those wishing to publish for the first time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 