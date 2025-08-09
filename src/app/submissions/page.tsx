export default function Submissions() {
  return (
    <main>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-serif tracking-tight sm:text-4xl">
              Submit Your Work
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We welcome submissions from authors who challenge conventional
              thinking and offer fresh perspectives on important topics. Whether
              you're an academic looking to publish your research or an author with
              unique ideas, we want to hear from you.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              <div className="flex flex-col">
                <dt className="text-base font-medium leading-7">
                  What We Publish
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    We publish a wide range of non-fiction works, including:
                  </p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex gap-x-3">
                      <span className="text-primary">•</span>
                      <span>Academic research and studies</span>
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-primary">•</span>
                      <span>Philosophical and theoretical works</span>
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-primary">•</span>
                      <span>Social and cultural commentary</span>
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-primary">•</span>
                      <span>Scientific and technical works</span>
                    </li>
                  </ul>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-base font-medium leading-7">
                  Submission Process
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Our submission process is straightforward and author-friendly:
                  </p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex gap-x-3">
                      <span className="text-primary">•</span>
                      <span>Submit your manuscript or proposal</span>
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-primary">•</span>
                      <span>Initial review within 2-3 weeks</span>
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-primary">•</span>
                      <span>Detailed feedback and guidance</span>
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-primary">•</span>
                      <span>Collaborative editing process</span>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="rounded-2xl border p-8">
              <h3 className="text-xl font-medium">Ready to Submit?</h3>
              <p className="mt-4 text-muted-foreground">
                Please send your manuscript or proposal to{" "}
                <a
                  href="mailto:submissions@wildroadbooks.com"
                  className="text-primary hover:text-primary/80"
                >
                  submissions@wildroadbooks.com
                </a>
              </p>
              <p className="mt-4 text-muted-foreground">
                Include a brief cover letter introducing yourself and your work, as
                well as a short synopsis of your manuscript.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 