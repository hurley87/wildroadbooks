import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Catching Unicorns — Wild Road Books",
  description:
    "Catching Unicorns is our debut release. Explore the overview and cover art.",
};

export default function CatchingUnicornsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          <div className="mx-auto w-full max-w-md lg:mx-0">
            <div className="relative aspect-[2/3] w-full shadow-2xl ring-1 ring-primary/5">
              <Image
                src="/catching-unicorns.png"
                alt="Catching Unicorns cover art"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 480px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:pt-4">
            <p className="text-sm font-medium text-primary">Wild Road Books</p>
            <h1 className="mt-3 text-4xl font-serif tracking-tight sm:text-5xl">
              Catching Unicorns
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our debut publication. This early release is available while we
              prepare the print edition.
            </p>

            <div className="mt-10 space-y-4 text-muted-foreground">
              <p>Catching Unicorns is a concise, practical read intended to be shared freely.</p>
              <p>
                For inquiries, permissions, or press, please reach out via our
                <Link href="/contact" className="text-primary hover:text-primary/80"> contact page</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


