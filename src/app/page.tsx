import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, PenTool, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navigation />
      
      {/* Hero section */}
      <section className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="/submissions" className="inline-flex space-x-6">
                <span className="rounded-full bg-primary/5 px-3 py-1 text-sm font-medium leading-6 text-primary ring-1 ring-inset ring-primary/10">
                  Now accepting submissions
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-muted-foreground">
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-serif tracking-tight sm:text-6xl">
              Books that swim against conventional currents
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We publish works that challenge the status quo,
              offering authors an editorial experience that enables them to refine
              and publish their ideas.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Browse Our Books
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="relative aspect-[2/3] w-[37rem] rounded-none bg-gradient-to-br from-primary/5 to-transparent p-8 shadow-2xl ring-1 ring-primary/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="h-32 w-32 text-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
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
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
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
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
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
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* Placeholder for featured books */}
          <article className="flex flex-col items-start">
            <div className="relative w-full">
              <div className="aspect-[2/3] w-full rounded-none bg-gradient-to-br from-primary/5 to-transparent p-8 shadow-2xl ring-1 ring-primary/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="h-32 w-32 text-primary/20" />
                </div>
              </div>
            </div>
            <div className="max-w-xl">
              <div className="mt-6 flex items-center gap-x-4 text-xs">
                <time dateTime="2024" className="text-muted-foreground">
                  Coming Soon
                </time>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-serif leading-6">
                  <span className="absolute inset-0" />
                  The Art of Unconventional Thinking
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  A groundbreaking exploration of how to break free from conventional
                  thought patterns and embrace innovative ideas.
                </p>
              </div>
            </div>
          </article>
          {/* Add more featured books here */}
        </div>
      </section>
    </main>
  );
}
