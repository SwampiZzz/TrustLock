const features = [
  {
    title: 'Secure Smart Contracts',
    description:
      'Funds are locked in immutable CashScript contracts until the agreed conditions are met.',
  },
  {
    title: 'Buyer Protection',
    description:
      'Buyers can safely recover funds when sellers agree or when an arbiter resolves disputes.',
  },
  {
    title: 'Seller Assurance',
    description:
      'Sellers receive payment immediately after successful completion or through arbiter approval.',
  },
  {
    title: 'Decentralized Escrow',
    description:
      'TrustLock removes the need for centralized intermediaries by leveraging Bitcoin Cash.',
  },
];

const steps = [
  { title: 'Create Escrow', icon: '✦' },
  { title: 'Deposit BCH', icon: '◉' },
  { title: 'Complete Transaction', icon: '✓' },
  { title: 'Release or Refund', icon: '↺' },
];

const stats = [
  { label: 'Active Escrows', value: '124' },
  { label: 'Successful Transactions', value: '3.2K' },
  { label: 'BCH Secured', value: '842' },
  { label: 'Average Resolution Time', value: '6 min' },
];

function Home() {
  return (
    <main className="bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
        <div>
          <div className="mb-6 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            Trusted escrow for Bitcoin Cash
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Secure Escrow Powered by Bitcoin Cash
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            TrustLock enables trustless peer-to-peer transactions using CashScript smart contracts,
            giving buyers, sellers, and arbiters a secure and transparent path to settle agreements.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="create-escrow"
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Create Escrow
            </a>
            <a
              href="how-it-works"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Learn How It Works
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)]">
          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Escrow Status</p>
                <p className="text-xl font-semibold">Secure & Verified</p>
              </div>
              <div className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-300">
                Live
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
                <span>Smart Contract</span>
                <span>CashScript</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800">
                <div className="h-2 w-3/4 rounded-full bg-blue-500" />
              </div>
              <div className="mt-6 grid gap-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2">
                  <span>Buyer</span>
                  <span>Locked</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2">
                  <span>Seller</span>
                  <span>Awaiting Release</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2">
                  <span>Arbiter</span>
                  <span>Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Features</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Built for secure, transparent transactions</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 h-10 w-10 rounded-full bg-blue-50 text-center leading-10 text-blue-600">
                •
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">A simple flow for every escrow</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-600">
                {step.icon}
              </div>
              <p className="text-sm font-semibold text-blue-600">0{index + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{step.title}</h3>
            </article>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-slate-50 p-6 text-center">
              <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-blue-600 px-8 py-12 text-center text-white shadow-[0_20px_60px_-25px_rgba(37,99,235,0.45)]">
          <h2 className="text-3xl font-semibold">Ready to Secure Your Transaction?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Start your escrow flow with confidence and give your transaction the protection it deserves.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="create-escrow" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-slate-100">
              Create Escrow
            </a>
            <a href="how-it-works" className="rounded-full border border-blue-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
              Learn More
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;