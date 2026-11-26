
const steps = [
  {
    number: "01",
    title: "Share what you can offer",
    description:
      "Describe your resources, skills, and availability in your own words.",
  },
  {
    number: "02",
    title: "AI organizes your offer",
    description:
      "Firebase AI Logic helps structure your message into a clear offer.",
  },
  {
    number: "03",
    title: "A coordinator reviews it",
    description:
      "You confirm the details. A human coordinator reviews the offer.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080F1D] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="/" className="text-xl font-bold tracking-tight">
          Relief<span className="text-blue-400">Relay</span>
        </a>
        <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300">
          NAMMA IDEA
        </span>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            Community-powered coordination
          </p>

          <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Help starts with
            <span className="text-blue-400"> what you can give.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
            Have a vehicle, food, water, supplies, or a useful skill?
            Share your offer. ReliefRelay helps organize it so human
            coordinators can review and coordinate support.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#how-it-works"
              className="rounded-xl bg-blue-500 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-400"
            >
              See how it works
            </a>
            <a
              href="#about"
              className="rounded-xl border border-white/15 px-6 py-3.5 font-semibold text-slate-200 transition hover:bg-white/5"
            >
              About ReliefRelay
            </a>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            AI-assisted organization. Human-reviewed coordination.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-3xl bg-blue-500/10 blur-3xl" />
          <div className="relative rounded-3xl border border-white/10 bg-[#111D31] p-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200">
                Example volunteer offer
              </span>
              <span className="rounded-full bg-blue-400/10 px-3 py-1 text-xs text-blue-300">
                AI organized
              </span>
            </div>

            <div className="mt-7 rounded-2xl bg-[#0B1424] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Original message
              </p>
              <p className="mt-3 leading-7 text-slate-200">
                I have a pickup truck. I can deliver drinking water
                this afternoon, but I cannot drive at night.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-slate-500">OFFER TYPE</p>
                <p className="mt-1 font-medium">Transport</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">AVAILABILITY</p>
                <p className="mt-1 font-medium">This afternoon</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">LIMITATION</p>
                <p className="mt-1 font-medium">Cannot drive at night</p>
              </div>
            </div>

            <div className="mt-7 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
              <p className="text-sm font-semibold text-amber-300">
                Human review required
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                A coordinator must verify the details before acting on
                this offer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-t border-white/10 bg-[#0B1424] px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Simple process
          </p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            From an offer to organized support.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-white/10 bg-[#111D31] p-7"
              >
                <p className="text-sm font-bold text-blue-400">
                  {step.number}
                </p>
                <h3 className="mt-5 text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-400">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="px-6 py-16 text-center">
        <h2 className="text-2xl font-bold">Technology supports people.</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
          ReliefRelay uses hybrid AI to help structure volunteer offers.
          It does not approve volunteers, verify resources, or dispatch
          assistance automatically. People remain responsible for review.
        </p>
      </section>

      <footer className="border-t border-white/10 px-6 py-7 text-center text-sm text-slate-500">
        ReliefRelay — Namma Idea
      </footer>
    </main>
  );
}
