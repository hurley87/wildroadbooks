import Link from "next/link";

export default function FAQ() {
  return (
    <main>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-serif tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Everything you need to know about publishing with Wild Road Books.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-3xl space-y-12">
            {/* How is Wild Road different */}
            <section>
              <h2 className="text-2xl font-serif tracking-tight mb-4">
                How is Wild Road Books different from traditional publishers?
              </h2>
              <div className="space-y-4 text-base leading-7 text-muted-foreground">
                <p>
                  Unlike traditional publishers, Wild Road Books operates on a partnership model. We don't charge authors to publish, and we only make money when you do—through shared royalties. This means:
                </p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>No author fees or upfront costs</li>
                  <li>Higher royalty rates than traditional publishers (typically 10-15%)</li>
                  <li>Faster time-to-market with streamlined processes</li>
                  <li>Authors retain creative control over their work</li>
                  <li>Global distribution through Kindle Direct Publishing</li>
                </ul>
                <p>
                  We see publishing as a collaboration built on fairness and trust, not a transaction.
                </p>
              </div>
            </section>

            {/* What are the costs */}
            <section className="rounded-2xl border bg-muted/30 p-8">
              <h2 className="text-2xl font-serif tracking-tight mb-4">
                What are the costs to authors?
              </h2>
              <div className="space-y-4 text-base leading-7 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Wild Road Books never charges authors to publish.</strong> However, authors work with third-party professionals (editors, typesetters, cover designers) whose fees are typically covered by research funding:
                </p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li><strong>Editing:</strong> $1,500 - $2,500 (paid directly to editor)</li>
                  <li><strong>Typesetting:</strong> Optional if you do it yourself, or variable if using a typesetter</li>
                  <li><strong>Cover Design:</strong> $350 - $1,200 (paid directly to designer)</li>
                </ul>
                <p>
                  These are expenses that most academics can charge to their research accounts. Wild Road covers ISBNs, copyright page setup, Library and Archives Canada submissions, and other direct publishing expenses.
                </p>
              </div>
            </section>

            {/* How long does it take */}
            <section>
              <h2 className="text-2xl font-serif tracking-tight mb-4">
                How long does the publishing process take?
              </h2>
              <div className="space-y-4 text-base leading-7 text-muted-foreground">
                <p>
                  Our process is faster than traditional publishing because we have fewer manuscripts in the pipeline. Here's a typical timeline:
                </p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li><strong>Submission Review:</strong> Within one week of submission</li>
                  <li><strong>Editing:</strong> Varies based on manuscript length and complexity</li>
                  <li><strong>Typesetting:</strong> Authors control this timeline when using Overleaf</li>
                  <li><strong>Final Review:</strong> Our in-house editors provide feedback</li>
                  <li><strong>Publication:</strong> Once files are ready, KDP publication is immediate</li>
                </ul>
                <p>
                  The exact timeline depends on your manuscript's readiness and how quickly you can work with editors and typesetters. We're committed to moving efficiently while maintaining quality.
                </p>
              </div>
            </section>

            {/* What genres */}
            <section className="rounded-2xl border bg-muted/30 p-8">
              <h2 className="text-2xl font-serif tracking-tight mb-4">
                What genres or topics do you publish?
              </h2>
              <div className="space-y-4 text-base leading-7 text-muted-foreground">
                <p>
                  Wild Road Books publishes serious scholarship across all academic disciplines. We're particularly interested in works that combine intellectual depth with clarity and accessibility.
                </p>
                <p>
                  We also have specialized imprints:
                </p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li><strong>Aegis Line:</strong> Security and Defence scholarship—rigorous analysis, strategic thinking, and policy scholarship on contemporary security challenges</li>
                  <li><strong>Maiden Lane Press:</strong> Creative and cross-genre work—fiction, poetry, essays, memoirs, and cultural criticism</li>
                </ul>
                <p>
                  If you're unsure whether your work fits, please submit a proposal and we'll let you know.
                </p>
              </div>
            </section>

            {/* Royalty rates */}
            <section>
              <h2 className="text-2xl font-serif tracking-tight mb-4">
                What are your royalty rates?
              </h2>
              <div className="space-y-4 text-base leading-7 text-muted-foreground">
                <p>
                  Wild Road operates on a transparent, shared royalty model:
                </p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>Wild Road covers direct expenses (approximately $500)</li>
                  <li>Once expenses are covered, royalties are split 50/50 between author and Wild Road</li>
                  <li>You receive semi-annual royalty payments with detailed statements</li>
                  <li>You set the book's price, giving you control over your revenue</li>
                </ul>
                <p>
                  Kindle Direct Publishing offers generous royalty rates (up to 60% for ebooks, 40% for print), which means even with the 50/50 split, authors typically earn more than they would with traditional publishers.
                </p>
                <p>
                  For more details, see our <Link href="/editorial-process" className="text-primary hover:text-primary/80 underline underline-offset-4">Editorial and Production Process</Link> page.
                </p>
              </div>
            </section>

            {/* Literary agents */}
            <section className="rounded-2xl border bg-muted/30 p-8">
              <h2 className="text-2xl font-serif tracking-tight mb-4">
                Do you accept submissions from literary agents?
              </h2>
              <div className="space-y-4 text-base leading-7 text-muted-foreground">
                <p>
                  No, we do not accept submissions from literary agents. We believe authors are in the best position to tell us about their book directly.
                </p>
                <p>
                  Our submission process is simple and author-friendly. Just send us an email with your proposal—no agent required.
                </p>
              </div>
            </section>

            {/* Marketing */}
            <section>
              <h2 className="text-2xl font-serif tracking-tight mb-4">
                How do you handle marketing and promotion?
              </h2>
              <div className="space-y-4 text-base leading-7 text-muted-foreground">
                <p>
                  We work collaboratively with authors on promotion. While Wild Road handles certain aspects of publication, marketing is a shared effort:
                </p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>We provide suggestions and strategies that have worked for us</li>
                  <li>Authors are encouraged to leverage their academic networks</li>
                  <li>We help with metadata optimization for better discoverability</li>
                  <li>We can assist with review requests and media outreach</li>
                </ul>
                <p>
                  The global reach of Amazon/KDP means your book is immediately available to millions of potential readers, but active promotion helps ensure it finds its audience.
                </p>
              </div>
            </section>

            {/* First-time authors */}
            <section className="rounded-2xl border bg-muted/30 p-8">
              <h2 className="text-2xl font-serif tracking-tight mb-4">
                Do you work with first-time authors?
              </h2>
              <div className="space-y-4 text-base leading-7 text-muted-foreground">
                <p>
                  Absolutely! We're particularly interested in working with authors who are publishing for the first time. Our Chief Acquisition Editor, Bill Hurley, specifically looks forward to helping first-time authors navigate the publishing process.
                </p>
                <p>
                  We provide guidance throughout the entire process—from editing and typesetting to publication and promotion. You're not alone in this journey.
                </p>
              </div>
            </section>

            {/* Quality standards */}
            <section>
              <h2 className="text-2xl font-serif tracking-tight mb-4">
                What are your quality standards?
              </h2>
              <div className="space-y-4 text-base leading-7 text-muted-foreground">
                <p>
                  We have a firm commitment to quality. Our pledge is simple: <strong className="text-foreground">all of our books will look and read like books, or we will not publish them.</strong>
                </p>
                <p>
                  This means:
                </p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>Professional editing by experienced academic editors</li>
                  <li>High-quality typesetting using Overleaf (LaTeX) templates</li>
                  <li>Professional cover design</li>
                  <li>Thorough review by our in-house editors</li>
                  <li>Meeting all standards for academic publication</li>
                </ul>
                <p>
                  We work with you to produce the best possible book we can. Quality is non-negotiable.
                </p>
              </div>
            </section>

            {/* Still have questions */}
            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
              <h2 className="text-2xl font-serif tracking-tight mb-4">
                Still have questions?
              </h2>
              <p className="text-base leading-7 text-muted-foreground mb-4">
                We're here to help. Feel free to reach out with any questions about publishing with Wild Road Books.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
                >
                  Contact Us →
                </Link>
                <Link
                  href="/submissions"
                  className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
                >
                  Submit Your Manuscript →
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

