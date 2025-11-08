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

          <div className="mx-auto mt-16 max-w-3xl flex flex-col space-y-12">
            {/* Why Submit Section */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
              <h3 className="text-2xl font-serif tracking-tight mb-4">Why Submit to Wild Road Books?</h3>
              <div className="mt-6 space-y-4">
                <div className="flex gap-x-3">
                  <span className="text-primary font-medium text-lg">•</span>
                  <div>
                    <strong className="text-foreground">No Author Fees. Ever.</strong>
                    <p className="mt-1 text-muted-foreground">We never charge authors to publish. We only make money when you do, through shared royalties.</p>
                  </div>
                </div>
                <div className="flex gap-x-3">
                  <span className="text-primary font-medium text-lg">•</span>
                  <div>
                    <strong className="text-foreground">Higher Royalties</strong>
                    <p className="mt-1 text-muted-foreground">Traditional publishers typically offer 10-15% royalties. With KDP and our transparent model, you keep a much larger share.</p>
                  </div>
                </div>
                <div className="flex gap-x-3">
                  <span className="text-primary font-medium text-lg">•</span>
                  <div>
                    <strong className="text-foreground">Faster Time-to-Market</strong>
                    <p className="mt-1 text-muted-foreground">No long waiting periods. Our streamlined process gets your book to readers faster.</p>
                  </div>
                </div>
                <div className="flex gap-x-3">
                  <span className="text-primary font-medium text-lg">•</span>
                  <div>
                    <strong className="text-foreground">Creative Control</strong>
                    <p className="mt-1 text-muted-foreground">You retain full creative control over your work. Your vision, your book.</p>
                  </div>
                </div>
                <div className="flex gap-x-3">
                  <span className="text-primary font-medium text-lg">•</span>
                  <div>
                    <strong className="text-foreground">Global Distribution</strong>
                    <p className="mt-1 text-muted-foreground">Through Kindle Direct Publishing, your book reaches readers worldwide via Amazon's extensive network.</p>
                  </div>
                </div>
                <div className="flex gap-x-3">
                  <span className="text-primary font-medium text-lg">•</span>
                  <div>
                    <strong className="text-foreground">Professional Quality</strong>
                    <p className="mt-1 text-muted-foreground">We work with experienced editors and use professional typesetting to ensure your book looks and reads like a book.</p>
                  </div>
                </div>
              </div>
            </div>

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

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium">What Happens Next</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Based on your proposal, we may ask you to meet with us via Zoom to answer any 
                  questions you may have and for us to get a better idea about your book. 
                </p>
                <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-base leading-7 text-foreground">
                    <strong>Response Time:</strong> We will give you our decision within <strong>one week</strong> of your initial submission or the Zoom meeting.
                  </p>
                </div>
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