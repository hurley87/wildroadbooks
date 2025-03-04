import { Navigation } from "@/components/navigation";

export default function About() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <div className="mx-auto max-w-7xl px-6 py-32 lg:px-8">
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center mb-24">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-8">
            About Wild Road Books
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            We specialize in working with authors whose ideas swim against
            conventional currents, academics who wish to publish their research
            without going through the agony of the usual academic press
            submission process, and other authors who have just plain
            interesting ideas.
          </p>
        </div>

        {/* Team Section */}
        <div className="mx-auto max-w-xl">
          <div className="space-y-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Team</h2>
            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">David Hurley</h3>
                <p className="text-muted-foreground">Publisher</p>
                <p className="text-muted-foreground leading-relaxed">
                  David is an entrepreneur who loves to read. He has always been
                  interested in operating a press that offers authors an
                  editorial experience that enables them to refine and publish
                  their ideas.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Bill Hurley</h3>
                <p className="text-muted-foreground">Chief Acquisition Editor</p>
                <p className="text-muted-foreground leading-relaxed">
                  Bill has been a Professor of Operations Research and Analytics
                  at the Royal Military College of Canada for 35 years. This
                  position at Wild Road Books is a new challenge for him and he
                  is quite looking forward to working with authors, especially
                  those wishing to publish for the first time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 