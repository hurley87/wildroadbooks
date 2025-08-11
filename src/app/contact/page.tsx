export default function Contact() {
  return (
    <main>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-4xl font-serif tracking-tight sm:text-5xl">
              Contact
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We keep it simple. Please email us and we’ll get back to you.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="rounded-2xl border p-8">
              <h2 className="text-xl font-medium">General Inquiries</h2>
              <p className="mt-3 text-muted-foreground">
                Questions about our publishing approach, partnerships, or press.
              </p>
              <p className="mt-5">
                <a
                  href="mailto:admin@wildroadbooks.com"
                  className="text-primary hover:text-primary/80"
                >
                  admin@wildroadbooks.com
                </a>
              </p>
            </div>

            <div className="rounded-2xl border p-8">
              <h2 className="text-xl font-medium">Manuscript Submissions</h2>
              <p className="mt-3 text-muted-foreground">
                Send your manuscript or proposal directly via email. Including a
                brief synopsis helps us review faster.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li>• Title and 1–2 paragraph summary</li>
                <li>• Table of contents (if available)</li>
                <li>• A short author bio</li>
              </ul>
              <p className="mt-5">
                <a
                  href="mailto:admin@wildroadbooks.com"
                  className="text-primary hover:text-primary/80"
                >
                  admin@wildroadbooks.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}