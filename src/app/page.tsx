import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PenTool, Users, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      
      {/* Hero section */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,_rgba(120,119,198,0.12)_0%,_rgba(255,255,255,0)_60%)]" />
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-8 sm:pb-24 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <h1 className="mt-10 text-4xl font-serif tracking-tight sm:text-6xl">
              Books that swim against conventional currents
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We publish works that challenge the status quo,
              offering authors an editorial experience that enables them to refine
              and publish their ideas.
            </p>
            <div className="mt-8 flex items-center gap-x-4 sm:mt-10 sm:gap-x-6">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/catching-unicorns">
                  Read Catching Unicorns
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto mt-10 flex w-full max-w-2xl sm:mt-16 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="w-full max-w-3xl flex-none sm:max-w-5xl lg:max-w-none lg:w-[37rem] lg:shrink-0">
              <div className="relative aspect-[2/3] w-full overflow-hidden shadow-2xl ring-1 ring-primary/10">
                <Image
                  src="/1740152260.jpg"
                  alt="Catching Unicorns cover"
                  fill
                  priority
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 592px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-medium leading-7 text-primary">
            Why Choose Wild Road Books
          </h2>
          <p className="mt-2 text-3xl font-serif tracking-tight sm:text-4xl">
            A publishing experience like no other
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            We believe in the power of unconventional ideas and provide authors with
            the support they need to bring their vision to life.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 sm:gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-medium leading-7">
                <PenTool className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                Expert Editorial Support
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                <p className="flex-auto">
                  Our experienced editors work closely with authors to refine their
                  manuscripts while preserving their unique voice and vision.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-medium leading-7">
                <BookOpen className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                Quality Production
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                <p className="flex-auto">
                  From cover design to typesetting, we ensure every book meets the
                  highest standards of quality and craftsmanship.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-medium leading-7">
                <Users className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                Author Community
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                <p className="flex-auto">
                  Join a community of like-minded authors who share your passion for
                  pushing boundaries and exploring new ideas.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Featured Books section */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-medium leading-7 text-primary">
            Featured Books
          </h2>
          <p className="mt-2 text-3xl font-serif tracking-tight sm:text-4xl">
            Discover our latest publications
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Explore our collection of thought-provoking books that challenge
            conventional thinking.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:mt-16 sm:gap-y-20 lg:mx-0 lg:max-w-none">
          <article className="flex flex-col items-start">
            <Link href="/catching-unicorns" className="relative w-full">
              <div className="relative aspect-[2/3] w-full shadow-2xl ring-1 ring-primary/5">
                <Image
                  src="/1740152260.jpg"
                  alt="Catching Unicorns cover"
                  fill
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="object-cover"
                />
              </div>
            </Link>
            <div className="max-w-xl">
              <div className="mt-6 flex items-center gap-x-4 text-xs">
                <time dateTime="2024" className="text-muted-foreground">
                  2024
                </time>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-serif leading-6">
                  <Link href="/catching-unicorns" className="absolute inset-0" />
                  Catching Unicorns
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  Our debut publication exploring unconventional paths to elusive outcomes.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
