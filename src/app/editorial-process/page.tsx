export default function EditorialProcess() {
  return (
    <main>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-serif tracking-tight sm:text-4xl">
              Editorial and Production Process
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              All of our books are printed and distributed by Kindle Direct Publishing (KDP), 
              ensuring immediate and global reach for your book.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-3xl space-y-12">
            {/* Production Requirements */}
            <section>
              <h2 className="text-2xl font-serif tracking-tight">Production Requirements</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Submission to KDP requires two PDF files:
              </p>
              <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
                <li className="flex gap-x-3">
                  <span className="text-primary font-medium">•</span>
                  <span>A file with the book's contents including frontmatter, the body, notes, a bibliography, and an index</span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-primary font-medium">•</span>
                  <span>The book's cover</span>
                </li>
              </ul>
            </section>

            {/* Editing Process */}
            <section className="rounded-2xl border bg-muted/30 p-8">
              <h2 className="text-2xl font-serif tracking-tight">Editing</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                We believe all scholars need an editor. Once we agree to work with you, we will 
                assign you a third-party experienced academic editor who will work with you and 
                provide you a structural edit as well as a line edit when your manuscript is complete.
              </p>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                The fee for this advice, payable directly to the editor, is $1,500 to $2,500 
                depending on the work required. This is an expense that most academics can charge 
                to their research accounts.
              </p>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                When you submit your penultimate manuscript to Wild Road, our internal editors will 
                give the book a thorough once-over. We will provide you feedback and, based on this 
                feedback, you will prepare the final manuscript.
              </p>
            </section>

            {/* Typesetting */}
            <section>
              <h2 className="text-2xl font-serif tracking-tight">Typesetting</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                We believe you should typeset your book. All academics use word processing software 
                so it's not much of a step to learn typesetting software. We use Overleaf (LaTeX) 
                and have constructed specialized templates in a number of styles. Overleaf allows you 
                to look immediately at what a change to a typeset document looks like.
              </p>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                With this approach, there is no need for an author to submit to a publisher changes 
                you want to the typeset manuscript—you will make those changes yourself. Effectively, 
                you are in control of what your book will look like. If you would prefer to work with 
                a third-party typesetter, we can arrange that too. What you have to pay this typesetter 
                will depend on the work required, but again, this is an expense that is normally covered 
                by your research funding.
              </p>
            </section>

            {/* Cover Design */}
            <section>
              <h2 className="text-2xl font-serif tracking-tight">Cover Design</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                For cover design, you can either do this yourself or work with a cover designer. We 
                highly recommend you work with a designer. We can recommend one or you can arrange 
                your own. The fee a designer charges varies from as low as $350 to as high as $1,200 
                for reputable creative designer. This fee should also be covered by your research funding.
              </p>
            </section>

            {/* What Wild Road Covers */}
            <section className="rounded-2xl border bg-muted/30 p-8">
              <h2 className="text-2xl font-serif tracking-tight">What Wild Road Takes Care Of</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                We will take care of all other aspects of publication including:
              </p>
              <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
                <li className="flex gap-x-3">
                  <span className="text-primary font-medium">•</span>
                  <span>The purchase of ISBN numbers</span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-primary font-medium">•</span>
                  <span>Copyright page information including the CIP block</span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-primary font-medium">•</span>
                  <span>Sending 2 copies of the book to Library and Archives Canada</span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-primary font-medium">•</span>
                  <span>Sending you 3 complimentary copies of your published book</span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-primary font-medium">•</span>
                  <span>Ordering for you as many copies as you would like at KDP print cost</span>
                </li>
              </ul>
            </section>

            {/* Promotion and Sales */}
            <section>
              <h2 className="text-2xl font-serif tracking-tight">Promotion and Sales</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                As for promotion, sale, and review of the book, we will suggest ways you can do 
                this which have worked for us.
              </p>
            </section>

            {/* Royalty Model */}
            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
              <h2 className="text-2xl font-serif tracking-tight">Wild Road's Royalty Model</h2>
              <p className="mt-4 text-base leading-7 text-foreground">
                Wild Road only makes money when you do. Wild Road does not charge you for any of 
                our direct expenses. However, we will take 50% of your royalties, once we have covered 
                our direct expenses (approximately $500) with your initial royalty payments. We will 
                provide you with a semi-annual royalty payment and a statement showing the number of 
                copies of the book sold over the period as well as the total royalty revenues received.
              </p>
            </section>

            {/* Why Choose Wild Road */}
            <section className="rounded-2xl border p-8">
              <h2 className="text-2xl font-serif tracking-tight">So Why Should You Choose Wild Road?</h2>
              <ul className="mt-4 space-y-4 text-base leading-7 text-muted-foreground">
                <li className="flex gap-x-3">
                  <span className="text-primary font-medium">•</span>
                  <span>We are a young academic publisher but we have a firm commitment to develop a strong reputation for quality</span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-primary font-medium">•</span>
                  <span>All of our books will look like books or we will not publish them</span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-primary font-medium">•</span>
                  <span>We and our third-party editors will work with you to produce the best possible book we can</span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-primary font-medium">•</span>
                  <span>Your out-of-pocket costs are zero assuming that the third-party costs described above (editorial help, typesetting help, and cover design) are covered by your research funding</span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-primary font-medium">•</span>
                  <span>Kindle Direct Publishing offers generous royalty payments and if your book is a home-run you will make more with Wild Road than you would with other academic publishers</span>
                </li>
                <li className="flex gap-x-3">
                  <span className="text-primary font-medium">•</span>
                  <span>Finally, and most importantly, you will have an important line item on your CV's publication list</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

