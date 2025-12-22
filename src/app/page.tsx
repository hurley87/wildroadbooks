import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PenTool, Users, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      
      {/* Hero section */}
      <section className="relative isolate overflow-hidden border-b border-border/40 book-spine">
        {/* Paper texture background */}
        <div className="pointer-events-none absolute inset-0 -z-10 paper-texture" />
        
        {/* Elegant diagonal gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        
        {/* Decorative corner flourishes */}
        <div className="corner-flourish corner-flourish-tr hidden lg:block" />
        <div className="corner-flourish corner-flourish-bl hidden lg:block" />
        
        {/* Subtle animated background elements */}
        <div className="absolute top-20 left-1/4 h-[600px] w-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-1/4 h-[500px] w-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-12 sm:pb-24 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            {/* Typographic lockup with staggered animation */}
            <div className="mb-8 animate-fade-up stagger-1">
              <h1 className="text-5xl font-serif tracking-tight sm:text-6xl lg:text-7xl leading-[0.95] font-medium">
               Wild Road Books
              </h1>
            </div>
            
            {/* Crisp value prop */}
            <p className="text-xl sm:text-2xl font-medium text-foreground mb-8 animate-fade-up stagger-2">
              An indie academic press that partners with authors.
            </p>
            
            {/* Scannable bullets */}
            <ul className="space-y-4 mb-8 animate-fade-up stagger-3">
              <li className="flex items-start gap-3 text-lg text-muted-foreground">
                <span className="text-primary font-medium mt-1">•</span>
                <span><strong className="text-foreground">No fees</strong> — we only earn when you do</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-muted-foreground">
                <span className="text-primary font-medium mt-1">•</span>
                <span><strong className="text-foreground">Global reach</strong> via Amazon/KDP</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-muted-foreground">
                <span className="text-primary font-medium mt-1">•</span>
                <span><strong className="text-foreground">You set the price</strong>, you control revisions</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-muted-foreground">
                <span className="text-primary font-medium mt-1">•</span>
                <span><strong className="text-foreground">Professional editing</strong> + typesetting support</span>
              </li>
            </ul>
            
            {/* Proof link */}
            <p className="mb-8 text-lg text-muted-foreground animate-fade-up stagger-4">
              See what we mean → <Link href="/catching-unicorns" className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Catching Unicorns</Link>
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-x-6 animate-fade-up stagger-5">
              <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto group transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105" asChild>
                <Link href="/submissions">
                  Submit Your Manuscript
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto group transition-all duration-300" asChild>
                <Link href="/books">
                  Browse Our Books
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Book cover with enhanced presentation */}
          <div className="mx-auto mt-10 flex w-full max-w-2xl sm:mt-16 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32 animate-fade-scale stagger-3">
            <div className="w-full max-w-3xl flex-none sm:max-w-5xl lg:max-w-none lg:w-[37rem] lg:shrink-0">
              <div className="relative aspect-[2/3] w-full overflow-hidden transition-all duration-500 group gilt-edge gilt-edge-hover rounded-sm">
                {/* Inner shadow for depth */}
                <div className="absolute inset-0 z-10 rounded-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),inset_0_-2px_4px_rgba(0,0,0,0.05)]" />
                {/* Soft edge blending mask */}
                <div 
                  className="absolute inset-0 pointer-events-none z-20 rounded-sm"
                  style={{ 
                    background: `radial-gradient(ellipse 70% 80% at 50% 50%, transparent 0%, transparent 50%, hsl(var(--background) / 0.15) 70%, hsl(var(--background) / 0.4) 85%, hsl(var(--background) / 0.7) 95%, hsl(var(--background)) 100%)`,
                  }}
                />
                <Image
                  src="/cover.png"
                  alt="Catching Unicorns cover"
                  fill
                  priority
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 592px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02] rounded-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-32 relative">
        <div className="mx-auto max-w-2xl lg:text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium text-primary/80 border border-primary/20 rounded-full bg-primary/5">
            Why We're Different
          </div>
          <p className="mt-2 text-3xl font-serif tracking-tight sm:text-4xl">
            Transparent, shared royalties.
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            We see publishing as a collaboration built on fairness and trust. 
            Wild Road Books earns only when our authors do.
          </p>
          {/* Detailed explanation moved from hero */}
          <div className="mt-8 text-base leading-7 text-muted-foreground space-y-4 text-left lg:text-center">
            <p>
              Wild Road Books is an indie academic press with a different approach. We partner with our authors. We ask them to work with our third-party independent editors and typesetters (using their research funding) to produce a high-quality draft. Upon submission of the draft to Wild Road, our in-house editors and typesetters will help authors prepare the final files for submission to Kindle Direct Publishing.
            </p>
            <p>
              With KDP, our authors get the global reach of Amazon, generous royalties, and the freedom to set the book's price. Working with our typesetters, the author develops the capability to make changes immediately and continuously as the final manuscript is prepared.
            </p>
            <p>
              Our pledge to our authors is that we will work hard to make sure that your book looks and reads like a book.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 sm:gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col group relative p-6 rounded-xl hover:bg-accent/30 transition-all duration-300 gilt-edge gilt-edge-hover">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <dt className="flex items-center gap-x-3 text-base font-medium leading-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/90">
                    <PenTool className="h-6 w-6" aria-hidden="true" />
                  </div>
                  Partnership Model
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Wild Road does not charge authors to publish. We share in royalties—we only 
                    make money when you do.
                  </p>
                </dd>
              </div>
            </div>
            <div className="flex flex-col group relative p-6 rounded-xl hover:bg-accent/30 transition-all duration-300 gilt-edge gilt-edge-hover">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <dt className="flex items-center gap-x-3 text-base font-medium leading-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/90">
                    <BookOpen className="h-6 w-6" aria-hidden="true" />
                  </div>
                  Global Distribution
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    All books are printed and distributed by Kindle Direct Publishing (KDP), 
                    ensuring immediate and global reach.
                  </p>
                </dd>
              </div>
            </div>
            <div className="flex flex-col group relative p-6 rounded-xl hover:bg-accent/30 transition-all duration-300 gilt-edge gilt-edge-hover">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <dt className="flex items-center gap-x-3 text-base font-medium leading-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/90">
                    <Users className="h-6 w-6" aria-hidden="true" />
                  </div>
                  Creative Control
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Authors retain creative control and share directly in their book's success. 
                    Your vision, your work.
                  </p>
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </section>

      {/* Featured Books section */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-32 relative">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-medium leading-7 text-primary">
            Our Publications
          </h2>
          <p className="mt-2 text-3xl font-serif tracking-tight sm:text-4xl">
            Wild Road Books & Our Imprints
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Explore our catalogue featuring original and engaging scholarship from all disciplines, 
            along with specialized imprints for creative work and security studies.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:mt-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <article className="group flex flex-col items-start relative p-6 rounded-xl hover:bg-accent/30 transition-all duration-300 gilt-edge gilt-edge-hover">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="max-w-xl relative z-10">
              <div className="mt-6 flex items-center gap-x-4 text-xs">
                <time dateTime="2025-10" className="text-muted-foreground uppercase tracking-wider">
                  October 2025
                </time>
              </div>
              <div>
                <h3 className="mt-3 text-lg font-serif leading-6 group-hover:text-primary transition-colors duration-300">
                  Catching Unicorns
                </h3>
                <p className="mt-3 text-sm text-muted-foreground font-medium italic">
                  Bill Hurley & David Hurley
                </p>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  The book first explains how writing enables us to discover ideas that would 
                  otherwise be impossible. It then explores how these ideas have given rise to 
                  the massively-urban techno-literate cultures we inhabit today.
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <Link 
                    href="/catching-unicorns" 
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-transform duration-300 hover:translate-x-1 inline-block"
                  >
                    Learn more →
                  </Link>
                  <a 
                    href="https://www.amazon.ca/Catching-Unicorns-Exographic-Revolution-Techno-Literate/dp/1069059315"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-transform duration-300 hover:translate-x-1 inline-block"
                  >
                    Available on Amazon.ca →
                  </a>
                </div>
              </div>
            </div>
          </article>
          <article className="group flex flex-col items-start relative p-6 rounded-xl hover:bg-accent/30 transition-all duration-300 gilt-edge gilt-edge-hover">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="max-w-xl relative z-10">
              <div className="flex items-center gap-4 mt-2">
                <div className="relative w-12 h-12 flex-shrink-0 rounded-lg bg-primary/10 p-2 group-hover:scale-110 transition-transform duration-300 border border-primary/20 group-hover:border-accent/50">
                  <Image
                    src="/madusa.png"
                    alt="Aegis Line logo"
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary uppercase tracking-wider">Our Imprint</p>
                  <h3 className="mt-1 text-lg font-serif leading-6">
                    <Link href="/aegis-line" className="hover:text-primary transition-colors duration-300">
                      Aegis Line
                    </Link>
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Our imprint dedicated to Security and Defence—publishing rigorous analysis, 
                strategic thinking, and policy scholarship on contemporary security challenges.
              </p>
            </div>
          </article>
          <article className="group flex flex-col items-start relative p-6 rounded-xl hover:bg-accent/30 transition-all duration-300 gilt-edge gilt-edge-hover">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="max-w-xl relative z-10">
              <div className="flex items-center gap-4 mt-2">
                <div className="relative w-12 h-12 flex-shrink-0 rounded-full bg-primary/10 p-0.5 group-hover:scale-110 transition-transform duration-300 overflow-hidden border border-primary/20 group-hover:border-accent/50">
                  <Image
                    src="/MaidenLane.png"
                    alt="Maiden Lane Press colophon"
                    fill
                    sizes="48px"
                    className="object-cover rounded-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary uppercase tracking-wider">Our Imprint</p>
                  <h3 className="mt-1 text-lg font-serif leading-6">
                    <Link href="/maiden-lane" className="hover:text-primary transition-colors duration-300">
                      Maiden Lane Press
                    </Link>
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                A venue for creative and cross-genre work—from essays and memoirs to fiction, 
                poetry, and cultural criticism.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
