export default function Submissions() {
  return (
    <main>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-serif tracking-tight sm:text-4xl">
              Submissions
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our submission requirements are lean and simple. We require an email 
              sent to <a href="mailto:admin@wildroadbooks.com" className="text-primary hover:text-primary/80">admin@wildroadbooks.com</a> that includes a brief proposal.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-3xl">
            <div className="rounded-2xl border bg-muted/30 p-8">
              <h3 className="text-xl font-medium">Submission Requirements</h3>
              <div className="mt-6 space-y-6">
                <p className="text-base leading-7 text-foreground">
                  Please send an email to <a href="mailto:admin@wildroadbooks.com" className="text-primary hover:text-primary/80">admin@wildroadbooks.com</a> with the subject line "Submission" that includes:
                </p>
                <ul className="space-y-4 text-base text-muted-foreground">
                  <li className="flex gap-x-3">
                    <span className="text-primary font-medium">1.</span>
                    <span><strong>Title:</strong> The proposed title of your book</span>
                  </li>
                  <li className="flex gap-x-3">
                    <span className="text-primary font-medium">2.</span>
                    <span><strong>Description:</strong> A 1-3 page description of the book's contents and the contribution the book makes</span>
                  </li>
                  <li className="flex gap-x-3">
                    <span className="text-primary font-medium">3.</span>
                    <span><strong>Timeline:</strong> Your estimate of how long the book will take to write</span>
                  </li>
                  <li className="flex gap-x-3">
                    <span className="text-primary font-medium">4.</span>
                    <span><strong>Audience:</strong> Your estimate of who is likely to buy the book</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 space-y-6">
              <div>
                <h3 className="text-xl font-medium">What Happens Next</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Based on your proposal, we may ask you to meet with us via Zoom to answer any 
                  questions you may have and for us to get a better idea about your book. We will 
                  give you our decision within a week of your initial submission or the Zoom meeting.
                </p>
              </div>

              <div className="rounded-2xl border border-dashed p-6">
                <p className="text-sm font-medium text-muted-foreground">
                  Note: Please, no literary agents. We believe authors are in the best position to tell us what their book is about.
                </p>
              </div>
            </div>

            <div className="mt-12 rounded-2xl border p-8 bg-muted/30">
              <h3 className="text-xl font-medium">Learn More</h3>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                For detailed information about our editorial and production process, please visit our{" "}
                <a href="/editorial-process" className="text-primary hover:text-primary/80">
                  Editorial and Production Process
                </a>{" "}
                page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 